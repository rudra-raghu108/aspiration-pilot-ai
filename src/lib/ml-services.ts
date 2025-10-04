import * as tf from '@tensorflow/tfjs';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

// Simple tokenizer function
const tokenize = (text: string): string[] => {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// Common skills dictionary
const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'angular', 'vue',
    'node.js', 'express', 'mongodb', 'sql', 'postgresql', 'aws', 'azure', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'machine learning', 'data science',
    'artificial intelligence', 'devops', 'ci/cd', 'test driven development'
];

// Function to extract skills from text
function extractSkills(text: string): string[] {
    const tokens = tokenize(text);
    const skills = new Set<string>();
    
    // Check for single-word skills
    tokens.forEach(token => {
        if (commonSkills.includes(token)) {
            skills.add(token);
        }
    });
    
    // Check for multi-word skills
    commonSkills.forEach(skill => {
        if (text.toLowerCase().includes(skill)) {
            skills.add(skill);
        }
    });
    
    return Array.from(skills);
}

// Function to extract experience sections
function extractExperience(text: string): ParsedResume['experience'] {
    const lines = text.split('\n');
    const experience: ParsedResume['experience'] = [];
    let currentExp: Partial<ParsedResume['experience'][0]> = {};
    
    const datePattern = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\s*(-|–|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|\b\d{4}\s*(-|–|to)\s*\d{4}|\b\d{4}\s*(-|–|to)\s*present\b/i;
    const titlePattern = /\b(senior|lead|principal|software|developer|engineer|architect|manager|director|consultant)\b/i;
    
    lines.forEach(line => {
        line = line.trim();
        
        if (datePattern.test(line)) {
            if (currentExp.title) {
                experience.push(currentExp as ParsedResume['experience'][0]);
            }
            currentExp = { duration: line.match(datePattern)![0], description: [] };
        } else if (titlePattern.test(line)) {
            currentExp.title = line;
            currentExp.company = ''; // This would need more sophisticated parsing
        } else if (line.length > 30 && currentExp.title) {
            currentExp.description = currentExp.description || [];
            currentExp.description.push(line);
        }
    });
    
    if (currentExp.title) {
        experience.push(currentExp as ParsedResume['experience'][0]);
    }
    
    return experience;
}

export interface ParsedResume {
    skills: string[];
    experience: {
        title: string;
        company: string;
        duration: string;
        description: string[];
    }[];
    education: {
        degree: string;
        institution: string;
        year: string;
    }[];
}

export interface JobMatch {
    title: string;
    company: string;
    score: number;
    matchingSkills: string[];
}

// Function to extract text from PDF
async function extractTextFromPDF(pdfUrl: string): Promise<string> {
    const response = await fetch(pdfUrl);
    const pdfData = await response.arrayBuffer();
    
    // Using pdf.js to extract text
    const pdfjsLib = await import('pdfjs-dist');
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(' ');
    }
    
    return fullText;
}

// Function to parse resume using NLP
export async function parseResume(resumeUrl: string): Promise<ParsedResume> {
    try {
        const text = await extractTextFromPDF(resumeUrl);
        
        // Extract skills using natural-based processing
        const skills = extractSkills(text);
        
        // Extract experience sections
        const experience = extractExperience(text);
        
        // Extract education sections using pattern matching
        const educationPattern = /\b(?:Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|Ph\.?D\.?|Degree)\b.*?\b(?:19|20)\d{2}\b/gi;
        const educationMatches = text.match(educationPattern) || [];
        const education = educationMatches.map(match => {
            const parts = match.split(/\s+at\s+|\s+from\s+|\s+,\s+/);
            return {
                degree: parts[0],
                institution: parts[1] || '',
                year: (match.match(/\b(19|20)\d{2}\b/) || [''])[0]
            };
        });
        
        return {
            skills,
            experience,
            education
        };
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw error;
    }
}

// Function to find job matches using ML
export async function findJobMatches(parsedResume: ParsedResume): Promise<JobMatch[]> {
    try {
        // Get all available jobs from the database
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*');
            
        if (error) throw error;
        
        // Calculate similarity scores and other metrics
        const matches = (jobs || []).map(job => {
            // Find matching skills
            const matchingSkills = parsedResume.skills.filter(
                skill => job.required_skills.includes(skill.toLowerCase())
            );
            
            // Calculate skill match ratio
            const skillMatchRatio = matchingSkills.length / job.required_skills.length;
            
            // Calculate experience match score
            const experienceMatchScore = calculateExperienceMatch(parsedResume.experience, job);
            
            // Calculate basic similarity score
            const similarityScore = matchingSkills.length / 
                Math.max(parsedResume.skills.length, job.required_skills.length);
            
            // Weighted scoring
            const score = (
                similarityScore * 0.4 + 
                skillMatchRatio * 0.4 + 
                experienceMatchScore * 0.2
            );
            
            return {
                title: job.title,
                company: job.company,
                score: score,
                matchingSkills
            };
        });
        
        // Sort by combined score
        return matches.sort((a, b) => b.score - a.score);
    } catch (error) {
        console.error('Error finding job matches:', error);
        throw error;
    }
}

// Helper function to calculate experience match score
function calculateExperienceMatch(experience: ParsedResume['experience'], job: Database['public']['Tables']['jobs']['Row']): number {
    if (!experience.length) return 0;
    
    // Extract years of experience
    const yearsOfExperience = experience.reduce((total, exp) => {
        const duration = exp.duration.toLowerCase();
        const years = parseInt(duration.match(/\d+/)?.[0] || '0');
        return total + (duration.includes('year') ? years : years / 12);
    }, 0);
    
    // Calculate score based on experience
    const jobTitleWords = job.title.toLowerCase().split(' ');
    const experienceMatch = experience.some(exp => 
        jobTitleWords.some(word => 
            exp.title.toLowerCase().includes(word) && word.length > 3
        )
    );
    
    return (yearsOfExperience > 3 ? 0.7 : 0.3) + (experienceMatch ? 0.3 : 0);
}

// Helper function to calculate the similarity between two texts
function calculateTextSimilarity(text1: string, text2: string): number {
    const tokens1 = tokenize(text1);
    const tokens2 = tokenize(text2);
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    
    const intersection = [...set1].filter(token => set2.has(token));
    const union = new Set([...tokens1, ...tokens2]);
    
    return intersection.length / union.size;
}