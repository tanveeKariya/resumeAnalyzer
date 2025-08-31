const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class SimilarityService {
  constructor() {
    this.jobDataset = this.loadJobDataset();
  }

  loadJobDataset() {
    try {
      const datasetPath = path.join(__dirname, '../../dataset/resume_job_matching_dataset_large.csv');
      
      if (!fs.existsSync(datasetPath)) {
        logger.warn('Dataset file not found, using fallback data');
        return this.getFallbackJobData();
      }

      const csvData = fs.readFileSync(datasetPath, 'utf8');
      return this.parseCSV(csvData);
    } catch (error) {
      logger.error('Failed to load job dataset:', error);
      return this.getFallbackJobData();
    }
  }

  parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const jobs = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= headers.length) {
        const job = {};
        headers.forEach((header, index) => {
          job[header] = values[index]?.trim();
        });
        jobs.push(job);
      }
    }

    return jobs;
  }

  getFallbackJobData() {
    return [
      {
        title: 'Software Engineer',
        skills: 'JavaScript,React,Node.js,MongoDB,Express',
        experience: 'mid',
        education: 'Computer Science,Information Technology',
        location: 'Remote'
      },
      {
        title: 'Frontend Developer',
        skills: 'React,JavaScript,CSS,HTML,TypeScript',
        experience: 'entry',
        education: 'Computer Science,Web Development',
        location: 'San Francisco'
      },
      {
        title: 'Full Stack Developer',
        skills: 'React,Node.js,Python,PostgreSQL,AWS',
        experience: 'senior',
        education: 'Computer Science,Software Engineering',
        location: 'New York'
      }
    ];
  }

  calculateJobMatch(resumeData, jobRequirements) {
    const resumeSkills = resumeData.skills || [];
    const jobSkills = jobRequirements.skills || [];
    
    // Skills matching
    const skillsMatch = this.calculateSkillsMatch(resumeSkills, jobSkills);
    
    // Experience matching
    const experienceMatch = this.calculateExperienceMatch(
      resumeData.experience || [],
      jobRequirements.experience || {}
    );
    
    // Education matching
    const educationMatch = this.calculateEducationMatch(
      resumeData.education || [],
      jobRequirements.education || {}
    );

    // Calculate weighted score
    const finalScore = Math.round(
      0.5 * skillsMatch +
      0.3 * experienceMatch +
      0.2 * educationMatch
    );

    return {
      skillsMatch,
      experienceMatch,
      educationMatch,
      finalScore,
      details: {
        matchingSkills: this.getMatchingSkills(resumeSkills, jobSkills),
        missingSkills: this.getMissingSkills(resumeSkills, jobSkills)
      }
    };
  }

  calculateSkillsMatch(resumeSkills, jobSkills) {
    if (!jobSkills.length) return 100;
    
    const normalizedResumeSkills = resumeSkills.map(skill => skill.toLowerCase());
    const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());
    
    const matchingSkills = normalizedJobSkills.filter(skill =>
      normalizedResumeSkills.some(resumeSkill =>
        resumeSkill.includes(skill) || skill.includes(resumeSkill)
      )
    );

    return Math.round((matchingSkills.length / normalizedJobSkills.length) * 100);
  }

  calculateExperienceMatch(resumeExperience, jobExperience) {
    if (!jobExperience.min) return 100;
    
    const totalExperience = resumeExperience.length;
    const requiredExperience = jobExperience.min || 0;
    
    if (totalExperience >= requiredExperience) {
      return 100;
    } else {
      return Math.round((totalExperience / requiredExperience) * 100);
    }
  }

  calculateEducationMatch(resumeEducation, jobEducation) {
    if (!jobEducation.stream || !jobEducation.stream.length) return 100;
    
    const resumeStreams = resumeEducation.map(edu => edu.stream?.toLowerCase()).filter(Boolean);
    const requiredStreams = jobEducation.stream.map(stream => stream.toLowerCase());
    
    const hasMatchingStream = resumeStreams.some(stream =>
      requiredStreams.some(required =>
        stream.includes(required) || required.includes(stream)
      )
    );

    return hasMatchingStream ? 100 : 60; // Partial credit for related fields
  }

  getMatchingSkills(resumeSkills, jobSkills) {
    const normalizedResumeSkills = resumeSkills.map(skill => skill.toLowerCase());
    const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());
    
    return jobSkills.filter(skill =>
      normalizedResumeSkills.some(resumeSkill =>
        resumeSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(resumeSkill.toLowerCase())
      )
    );
  }

  getMissingSkills(resumeSkills, jobSkills) {
    const matchingSkills = this.getMatchingSkills(resumeSkills, jobSkills);
    return jobSkills.filter(skill => !matchingSkills.includes(skill));
  }

  findMatchingJobs(resumeData, limit = 10) {
    const matches = [];
    
    for (const job of this.jobDataset) {
      const jobSkills = job.skills ? job.skills.split(',').map(s => s.trim()) : [];
      const jobEducation = {
        stream: job.education ? job.education.split(',').map(s => s.trim()) : []
      };
      
      const match = this.calculateJobMatch(resumeData, {
        skills: jobSkills,
        education: jobEducation
      });
      
      matches.push({
        ...job,
        matchScore: match.finalScore,
        skillsMatch: match.skillsMatch,
        experienceMatch: match.experienceMatch,
        educationMatch: match.educationMatch,
        matchingSkills: match.details.matchingSkills,
        missingSkills: match.details.missingSkills
      });
    }

    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }
}

module.exports = new SimilarityService();