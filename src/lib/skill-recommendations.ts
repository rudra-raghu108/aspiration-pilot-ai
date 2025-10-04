import * as tf from '@tensorflow/tfjs';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface SkillRecommendation {
  skill: string;
  relevance: number;
  reason: string;
  requiredBy: number; // Number of jobs requiring this skill
  growthTrend: 'rising' | 'stable' | 'declining';
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = Beginner, 5 = Expert
}

const COMMON_TECH_SKILLS = {
  'javascript': { category: 'programming', difficulty: 2 },
  'python': { category: 'programming', difficulty: 2 },
  'react': { category: 'frontend', difficulty: 3 },
  'node.js': { category: 'backend', difficulty: 3 },
  'sql': { category: 'database', difficulty: 2 },
  'aws': { category: 'cloud', difficulty: 4 },
  'docker': { category: 'devops', difficulty: 3 },
  'machine learning': { category: 'ai', difficulty: 4 },
  'data analysis': { category: 'data', difficulty: 3 },
  'product management': { category: 'business', difficulty: 4 },
  'agile': { category: 'methodology', difficulty: 2 },
  'ui/ux': { category: 'design', difficulty: 3 }
} as const;

const SKILL_RELATIONSHIPS = {
  'frontend': ['javascript', 'react', 'ui/ux'],
  'backend': ['node.js', 'python', 'sql'],
  'fullstack': ['javascript', 'react', 'node.js', 'sql'],
  'data science': ['python', 'machine learning', 'data analysis'],
  'devops': ['docker', 'aws', 'python'],
  'product': ['agile', 'product management', 'ui/ux']
};

export async function getSkillRecommendations(
  profile: Profile,
  limit = 10
): Promise<SkillRecommendation[]> {
  // Get current skills
  const currentSkills = new Set(profile.skills || []);
  const assessedSkills = new Set(profile.skill_assessments?.map(s => s.skill) || []);
  
  // Get target roles from career goals
  const targetRoles = profile.career_goals?.targetRoles || [];
  const targetIndustries = profile.career_goals?.industries || [];
  
  // Get all jobs from the database
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*');

  // Build skill frequency map from jobs
  const skillFrequency = new Map<string, number>();
  const skillsByRole = new Map<string, Set<string>>();
  
  jobs?.forEach(job => {
    // Count skill frequency
    job.required_skills.forEach(skill => {
      skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
    });
    
    // Group skills by role
    if (job.title) {
      const normalizedTitle = job.title.toLowerCase();
      const skillSet = skillsByRole.get(normalizedTitle) || new Set();
      job.required_skills.forEach(skill => skillSet.add(skill));
      skillsByRole.set(normalizedTitle, skillSet);
    }
  });

  // Get relevant skills based on target roles
  const relevantSkills = new Set<string>();
  targetRoles.forEach(role => {
    const roleKey = Object.keys(SKILL_RELATIONSHIPS).find(k => 
      role.toLowerCase().includes(k)
    );
    if (roleKey) {
      SKILL_RELATIONSHIPS[roleKey as keyof typeof SKILL_RELATIONSHIPS].forEach(skill => 
        relevantSkills.add(skill)
      );
    }
  });

  // Calculate recommendations
  const recommendations: SkillRecommendation[] = [];
  
  for (const [skill, frequency] of skillFrequency.entries()) {
    // Skip skills the user already has
    if (currentSkills.has(skill)) continue;

    const skillInfo = COMMON_TECH_SKILLS[skill as keyof typeof COMMON_TECH_SKILLS];
    if (!skillInfo) continue;

    // Calculate base relevance score
    let relevance = 0;
    
    // Skill is specifically relevant to target roles
    if (relevantSkills.has(skill)) {
      relevance += 0.4;
    }
    
    // Skill is frequently required in jobs
    relevance += Math.min(frequency / (jobs?.length || 1), 0.3);
    
    // Skill complements existing skills
    const complementarySkills = Object.values(SKILL_RELATIONSHIPS)
      .filter(skills => skills.includes(skill))
      .flat();
    const complementaryScore = complementarySkills
      .filter(s => currentSkills.has(s))
      .length / complementarySkills.length;
    relevance += complementaryScore * 0.3;

    // Generate reason for recommendation
    let reason = '';
    if (relevantSkills.has(skill)) {
      reason = `Required for ${targetRoles.join(' or ')} roles`;
    } else if (complementaryScore > 0) {
      reason = 'Complements your current skill set';
    } else {
      reason = 'In-demand skill in your target industry';
    }

    // Determine growth trend based on job postings
    const growthTrend = frequency > (jobs?.length || 1) * 0.5 ? 'rising' : 
                       frequency > (jobs?.length || 1) * 0.2 ? 'stable' : 
                       'declining';

    recommendations.push({
      skill,
      relevance,
      reason,
      requiredBy: frequency,
      growthTrend,
      difficulty: skillInfo.difficulty as 1 | 2 | 3 | 4 | 5
    });
  }

  // Sort by relevance and return top recommendations
  return recommendations
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

export async function getSkillProgressInsights(profile: Profile) {
  const currentSkills = profile.skill_assessments || [];
  const progressHistory = profile.career_progression || [];
  
  // Calculate skill development velocity
  const skillProgress = new Map<string, {
    initialLevel: number;
    currentLevel: number;
    timeSpan: number; // in days
  }>();

  currentSkills.forEach(skill => {
    const firstMention = progressHistory.find(p => 
      p.skillsGained.includes(skill.skill)
    );
    
    if (firstMention) {
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(firstMention.date).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      
      skillProgress.set(skill.skill, {
        initialLevel: 1,
        currentLevel: skill.level,
        timeSpan: daysSince
      });
    }
  });

  // Generate insights
  const insights = [];
  
  for (const [skill, progress] of skillProgress.entries()) {
    const velocityPerMonth = (progress.currentLevel - progress.initialLevel) / 
                           (progress.timeSpan / 30);
    
    if (velocityPerMonth > 0.5) {
      insights.push({
        skill,
        type: 'fast-progress',
        message: `Great progress in ${skill}! You're learning this skill quickly.`
      });
    } else if (velocityPerMonth < 0.1 && progress.timeSpan > 90) {
      insights.push({
        skill,
        type: 'stagnant',
        message: `Consider focusing more on ${skill} - progress has been slow.`
      });
    }
  }

  return insights;
}