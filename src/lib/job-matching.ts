import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { ParsedResume, JobMatch } from '@/lib/ml-services';

export interface JobMatchDetails extends JobMatch {
  skillMatchPercentage: number;
  experienceMatch: {
    years: number;
    relevancy: number;
  };
  educationMatch: {
    degreeLevel: string;
    relevancy: number;
  };
  overallScore: number;
}

const EDUCATION_LEVELS = {
  'phd': 5,
  'master': 4,
  'bachelor': 3,
  'associate': 2,
  'certificate': 1
};

export async function enhancedJobMatching(
  parsedResume: ParsedResume,
  jobPreferences?: {
    preferredLocations?: string[];
    minimumSalary?: number;
    remoteOnly?: boolean;
  }
): Promise<JobMatchDetails[]> {
  // Get all jobs from the database
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*');

  if (error) throw error;

  const matches = (jobs || []).map(job => {
    // Calculate skill match percentage
    const skillMatchPercentage = calculateSkillMatch(parsedResume.skills, job.required_skills);

    // Calculate experience match
    const experienceMatch = calculateExperienceMatch(parsedResume.experience, job);

    // Calculate education match
    const educationMatch = calculateEducationMatch(parsedResume.education, job);

    // Calculate overall score
    const overallScore = calculateOverallScore({
      skillMatchPercentage,
      experienceMatch,
      educationMatch,
      job,
      jobPreferences
    });

    return {
      title: job.title,
      company: job.company,
      score: overallScore,
      matchingSkills: parsedResume.skills.filter(skill => 
        job.required_skills.includes(skill.toLowerCase())
      ),
      skillMatchPercentage,
      experienceMatch,
      educationMatch,
      overallScore
    };
  });

  // Sort by overall score
  return matches.sort((a, b) => b.overallScore - a.overallScore);
}

function calculateSkillMatch(candidateSkills: string[], requiredSkills: string[]): number {
  const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase());
  const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase());

  const matchingSkills = normalizedCandidateSkills.filter(skill => 
    normalizedRequiredSkills.includes(skill)
  );

  // Calculate both the coverage of required skills and the relevance of candidate skills
  const requiredSkillsCoverage = matchingSkills.length / normalizedRequiredSkills.length;
  const candidateSkillsRelevance = matchingSkills.length / normalizedCandidateSkills.length;

  // Weighted average favoring required skills coverage
  return (requiredSkillsCoverage * 0.7) + (candidateSkillsRelevance * 0.3);
}

function calculateExperienceMatch(
  experience: ParsedResume['experience'],
  job: Database['public']['Tables']['jobs']['Row']
): { years: number; relevancy: number } {
  let totalYears = 0;
  let relevantYears = 0;

  experience.forEach(exp => {
    const years = parseExperienceYears(exp.duration);
    totalYears += years;

    // Check if experience is relevant to the job
    if (isExperienceRelevant(exp, job)) {
      relevantYears += years;
    }
  });

  return {
    years: totalYears,
    relevancy: totalYears > 0 ? relevantYears / totalYears : 0
  };
}

function parseExperienceYears(duration: string): number {
  const yearMatch = duration.match(/(\d+)\s*year/i);
  const monthMatch = duration.match(/(\d+)\s*month/i);

  let years = 0;
  if (yearMatch) years += parseInt(yearMatch[1]);
  if (monthMatch) years += parseInt(monthMatch[1]) / 12;

  return years;
}

function isExperienceRelevant(
  experience: ParsedResume['experience'][0],
  job: Database['public']['Tables']['jobs']['Row']
): boolean {
  const jobTitleWords = new Set(job.title.toLowerCase().split(/\W+/));
  const expTitleWords = new Set(experience.title.toLowerCase().split(/\W+/));

  // Calculate word overlap
  const overlap = [...jobTitleWords].filter(word => expTitleWords.has(word)).length;
  const relevanceScore = overlap / Math.min(jobTitleWords.size, expTitleWords.size);

  return relevanceScore >= 0.3; // 30% word overlap threshold
}

function calculateEducationMatch(
  education: ParsedResume['education'],
  job: Database['public']['Tables']['jobs']['Row']
): { degreeLevel: string; relevancy: number } {
  const highestDegree = findHighestDegree(education);
  
  // Default values if no education found
  if (!highestDegree) {
    return {
      degreeLevel: 'none',
      relevancy: 0
    };
  }

  // Calculate relevancy based on degree field matching job requirements
  const relevancy = calculateDegreeRelevancy(highestDegree, job);

  return {
    degreeLevel: highestDegree.degree,
    relevancy
  };
}

function findHighestDegree(education: ParsedResume['education']): ParsedResume['education'][0] | null {
  if (!education.length) return null;

  return education.reduce((highest, current) => {
    const currentLevel = getDegreeLevel(current.degree);
    const highestLevel = getDegreeLevel(highest.degree);

    return currentLevel > highestLevel ? current : highest;
  });
}

function getDegreeLevel(degree: string): number {
  const normalizedDegree = degree.toLowerCase();
  
  for (const [level, value] of Object.entries(EDUCATION_LEVELS)) {
    if (normalizedDegree.includes(level)) {
      return value;
    }
  }

  return 0;
}

function calculateDegreeRelevancy(
  degree: ParsedResume['education'][0],
  job: Database['public']['Tables']['jobs']['Row']
): number {
  // This could be enhanced with a more sophisticated field matching algorithm
  const jobFields = extractJobFields(job.title, job.description || '');
  const degreeFields = extractDegreeFields(degree.degree);

  // Calculate field overlap
  const overlap = jobFields.filter(field => 
    degreeFields.some(degreeField => 
      degreeField.toLowerCase().includes(field.toLowerCase())
    )
  ).length;

  return overlap / Math.max(jobFields.length, 1);
}

function extractJobFields(title: string, description: string): string[] {
  const fields = new Set<string>();
  
  // Common technical fields
  const technicalFields = [
    'computer science', 'software', 'engineering', 'data science',
    'mathematics', 'physics', 'information technology', 'business',
    'finance', 'marketing', 'design'
  ];

  technicalFields.forEach(field => {
    if (title.toLowerCase().includes(field) || description.toLowerCase().includes(field)) {
      fields.add(field);
    }
  });

  return Array.from(fields);
}

function extractDegreeFields(degree: string): string[] {
  const fields = new Set<string>();
  
  // Remove common degree words
  const cleanDegree = degree
    .toLowerCase()
    .replace(/bachelor|master|phd|degree|of|in/g, '')
    .trim();

  // Split remaining words into potential fields
  cleanDegree.split(/[\s,]+/).forEach(field => {
    if (field) fields.add(field);
  });

  return Array.from(fields);
}

function calculateOverallScore({
  skillMatchPercentage,
  experienceMatch,
  educationMatch,
  job,
  jobPreferences
}: {
  skillMatchPercentage: number;
  experienceMatch: { years: number; relevancy: number };
  educationMatch: { degreeLevel: string; relevancy: number };
  job: Database['public']['Tables']['jobs']['Row'];
  jobPreferences?: {
    preferredLocations?: string[];
    minimumSalary?: number;
    remoteOnly?: boolean;
  };
}): number {
  // Base weights
  const weights = {
    skills: 0.4,
    experience: 0.3,
    education: 0.2,
    preferences: 0.1
  };

  // Calculate component scores
  const skillsScore = skillMatchPercentage;
  const experienceScore = (experienceMatch.years * 0.4) + (experienceMatch.relevancy * 0.6);
  const educationScore = (getDegreeLevel(educationMatch.degreeLevel) / 5 * 0.4) + 
                        (educationMatch.relevancy * 0.6);

  // Calculate preference score
  const preferenceScore = calculatePreferenceScore(job, jobPreferences);

  // Combine scores with weights
  return (skillsScore * weights.skills) +
         (experienceScore * weights.experience) +
         (educationScore * weights.education) +
         (preferenceScore * weights.preferences);
}

function calculatePreferenceScore(
  job: Database['public']['Tables']['jobs']['Row'],
  preferences?: {
    preferredLocations?: string[];
    minimumSalary?: number;
    remoteOnly?: boolean;
  }
): number {
  if (!preferences) return 1;

  let score = 0;
  let factors = 0;

  // Location preference
  if (preferences.preferredLocations?.length) {
    factors++;
    if (preferences.preferredLocations.some(loc => 
      job.location?.toLowerCase().includes(loc.toLowerCase())
    )) {
      score++;
    }
  }

  // Salary preference
  if (preferences.minimumSalary && job.salary_range) {
    factors++;
    const minSalary = extractMinSalary(job.salary_range);
    if (minSalary >= preferences.minimumSalary) {
      score++;
    }
  }

  // Remote work preference
  if (preferences.remoteOnly !== undefined) {
    factors++;
    const isRemote = job.location?.toLowerCase().includes('remote');
    if (!preferences.remoteOnly || isRemote) {
      score++;
    }
  }

  return factors > 0 ? score / factors : 1;
}

function extractMinSalary(salaryRange: string): number {
  const numbers = salaryRange.match(/\d+/g);
  if (!numbers) return 0;
  return Math.min(...numbers.map(n => parseInt(n)));
}