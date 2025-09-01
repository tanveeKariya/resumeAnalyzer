import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Download, Eye, Zap, Award, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { ResumeService } from '../services/resumeService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ResumeAnalysis {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    cgpa?: string;
    stream?: string;
  }>;
  certifications?: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export default function UploadResume() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string>('');
  const [analysisId, setAnalysisId] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
      setError('');
      setUploaded(false);
      setExtractedData(null);
    } else {
      setError('Please upload a PDF or DOCX file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const result = await ResumeService.uploadAndAnalyze(file);
      
      setExtractedData(result.extractedData);
      setAnalysisId(result.resumeId);
      setUploading(false);
      setUploaded(true);
    } catch (error: any) {
      console.error('Resume processing failed:', error);
      setError(error.message || 'Failed to process resume. Please try again.');
      setUploading(false);
    }
  };

  const handleFindMatches = () => {
    if (extractedData && analysisId) {
      localStorage.setItem('currentAnalysisId', analysisId);
      navigate('/matches');
    }
  };

  const handleDownloadAnalysis = () => {
    if (extractedData) {
      const dataStr = JSON.stringify(extractedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-analysis-${analysisId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center space-x-4">
          <div className="w-16 h-16 gradient-brand rounded-3xl flex items-center justify-center shadow-large">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <span>Upload Resume</span>
        </h1>
        <p className="text-slate-600 text-xl font-medium leading-relaxed">
          Upload your resume to get AI-powered analysis, intelligent job matching, and personalized career recommendations
        </p>
      </div>

      {/* Upload Section */}
      <Card glass padding="xl" shadow="large" className="border border-white/20">
        {error && (
          <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 animate-slide-down">
            <AlertCircle className="h-6 w-6 text-rose-600" />
            <span className="text-rose-800 font-semibold">{error}</span>
          </div>
        )}
        
        <div 
          className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ${
            dragOver 
              ? 'border-brand-400 bg-brand-50/50 scale-105 shadow-glow' 
              : uploaded 
              ? 'border-emerald-400 bg-emerald-50/50 shadow-large'
              : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/30 hover:shadow-medium'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploaded ? (
            <div className="space-y-8">
              <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto shadow-large">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Resume Uploaded Successfully!</h3>
                <p className="text-slate-600 text-lg font-medium">Your resume has been processed and analyzed with AI precision.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto shadow-medium">
                <Upload className="h-12 w-12 text-slate-400" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  {file ? 'Ready to Upload' : 'Drop your resume here'}
                </h3>
                <p className="text-slate-600 text-lg font-medium mb-2">
                  {file ? `Selected: ${file.name}` : 'or click to browse files'}
                </p>
                <p className="text-slate-500 font-medium">Supports PDF and DOCX files up to 10MB</p>
              </div>
              
              <div className="space-y-6">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="button-primary text-lg px-10 py-5 cursor-pointer inline-flex items-center shadow-large hover:shadow-glow-lg group"
                >
                  <FileText className="h-6 w-6 mr-3" />
                  Browse Files
                </label>
                
                {file && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    loading={loading}
                    variant="secondary"
                    size="xl"
                    icon={Brain}
                  >
                    {uploading ? 'Processing with AI...' : 'Upload & Analyze'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Processing Status */}
      {uploading && (
        <Card className="gradient-brand text-white shadow-large border-0 relative overflow-hidden" padding="xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          </div>
          <div className="relative z-10 flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center animate-pulse-soft shadow-medium">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-2xl mb-2">Processing Your Resume</h3>
              <p className="text-white/90 text-lg font-medium">Our advanced AI is extracting key information, skills, and career insights...</p>
              <div className="flex items-center space-x-2 mt-3">
                <Clock className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm font-medium">Estimated time: 30-60 seconds</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Extracted Data Preview */}
      {extractedData && (
        <Card glass padding="xl" shadow="large" className="border border-white/20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
              <Award className="h-8 w-8 text-brand-600" />
              <span>AI-Extracted Information</span>
            </h2>
            <div className="flex items-center space-x-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Analysis Complete</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 text-xl flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center">
                  <User className="h-6 w-6 text-brand-600" />
                </div>
                <span>Personal Information</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 glass rounded-2xl border border-slate-200/60">
                  <span className="font-bold text-slate-700 min-w-[60px]">Name:</span> 
                  <span className="text-slate-900 font-semibold">{extractedData.name}</span>
                </div>
                <div className="flex items-center space-x-3 p-4 glass rounded-2xl border border-slate-200/60">
                  <span className="font-bold text-slate-700 min-w-[60px]">Email:</span> 
                  <span className="text-slate-900 font-semibold">{extractedData.email}</span>
                </div>
                <div className="flex items-center space-x-3 p-4 glass rounded-2xl border border-slate-200/60">
                  <span className="font-bold text-slate-700 min-w-[60px]">Phone:</span> 
                  <span className="text-slate-900 font-semibold">{extractedData.phone}</span>
                </div>
                {extractedData.linkedin && (
                  <div className="flex items-center space-x-3 p-4 glass rounded-2xl border border-slate-200/60">
                    <span className="font-bold text-slate-700 min-w-[60px]">LinkedIn:</span> 
                    <span className="text-brand-600 font-semibold">{extractedData.linkedin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 text-xl flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-violet-600" />
                </div>
                <span>Technical Skills</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {extractedData.skills.map((skill: string, index: number) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-brand-100 to-violet-100 text-brand-800 rounded-2xl text-sm font-bold border border-brand-200 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mt-12">
            <h3 className="font-bold text-slate-900 text-xl flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
              <span>Professional Experience</span>
            </h3>
            <div className="space-y-6">
              {extractedData.experience.map((exp: any, index: number) => (
                <div key={index} className="glass border-l-4 border-emerald-400 rounded-r-3xl p-8 shadow-medium hover:shadow-large transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xl mb-1">{exp.title}</h4>
                      <p className="text-emerald-600 font-bold text-lg">{exp.company}</p>
                    </div>
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-2xl text-sm font-bold border border-emerald-200">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="mt-12">
            <h3 className="font-bold text-slate-900 text-xl flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-amber-600" />
              </div>
              <span>Education</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {extractedData.education.map((edu: any, index: number) => (
                <div key={index} className="glass rounded-3xl p-8 shadow-medium border border-slate-200/60 hover:shadow-large transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-lg mb-2">{edu.degree}</h4>
                      <p className="text-slate-700 font-semibold text-base">{edu.school}</p>
                      {edu.stream && <p className="text-amber-600 font-bold text-sm mt-1">Stream: {edu.stream}</p>}
                      {edu.cgpa && <p className="text-emerald-600 font-bold text-sm mt-1">CGPA: {edu.cgpa}</p>}
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm">
                      {edu.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {extractedData.certifications && extractedData.certifications.length > 0 && (
            <div className="mt-12">
              <h3 className="font-bold text-slate-900 text-xl flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-rose-600" />
                </div>
                <span>Certifications</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {extractedData.certifications.map((cert: string, index: number) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-800 rounded-2xl text-sm font-bold border border-rose-200 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {extractedData.projects && extractedData.projects.length > 0 && (
            <div className="mt-12">
              <h3 className="font-bold text-slate-900 text-xl flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-violet-600" />
                </div>
                <span>Projects</span>
              </h3>
              <div className="space-y-6">
                {extractedData.projects.map((project: any, index: number) => (
                  <div key={index} className="glass border-l-4 border-violet-400 rounded-r-3xl p-8 shadow-medium hover:shadow-large transition-all duration-300">
                    <h4 className="font-bold text-slate-900 text-xl mb-3">{project.name}</h4>
                    <p className="text-slate-700 mb-4 leading-relaxed font-medium">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, techIndex: number) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-violet-100 text-violet-700 rounded-xl text-xs font-bold border border-violet-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 flex justify-end space-x-6">
            <Button
              variant="outline"
              onClick={handleDownloadAnalysis}
              icon={Download}
              size="lg"
            >
              Download Analysis
            </Button>
            <Button
              onClick={handleFindMatches}
              variant="secondary"
              size="lg"
              icon={Eye}
              className="group"
            >
              <span>Find Job Matches</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}