import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Download, Eye, Zap, Award, Sparkles } from 'lucide-react';
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <span>Upload Resume</span>
        </h1>
        <p className="text-gray-600 text-lg">Upload your resume to get AI-powered analysis, job matching, and career recommendations</p>
      </div>

      {/* Upload Section */}
      <Card className="p-10 shadow-2xl" gradient>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}
        
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragOver 
              ? 'border-blue-400 bg-blue-50 scale-105' 
              : uploaded 
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploaded ? (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Resume Uploaded Successfully!</h3>
                <p className="text-gray-600 mt-3 text-lg">Your resume has been processed and analyzed with AI precision.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                <Upload className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {file ? 'Ready to Upload' : 'Drop your resume here'}
                </h3>
                <p className="text-gray-600 mt-3 text-lg">
                  {file ? `Selected: ${file.name}` : 'or click to browse files'}
                </p>
                <p className="text-gray-500 mt-2">Supports PDF and DOCX files up to 10MB</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Browse Files
                </label>
                
                {file && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    loading={uploading}
                    variant="secondary"
                    size="lg"
                    icon={Brain}
                  >
                    {uploading ? 'Processing...' : 'Upload & Analyze'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Processing Status */}
      {uploading && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 p-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg">Processing Your Resume</h3>
              <p className="text-blue-700">Our advanced AI is extracting key information, skills, and insights...</p>
            </div>
          </div>
        </Card>
      )}

      {/* Extracted Data Preview */}
      {extractedData && (
        <Card className="p-8 shadow-2xl" gradient>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
            <Award className="h-6 w-6 text-blue-600" />
            <span>AI-Extracted Information</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Personal Information</span>
              </h3>
              <div className="space-y-3">
                <p className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Name:</span> 
                  <span className="text-gray-900 font-medium">{extractedData.name}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Email:</span> 
                  <span className="text-gray-900 font-medium">{extractedData.email}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Phone:</span> 
                  <span className="text-gray-900 font-medium">{extractedData.phone}</span>
                </p>
                {extractedData.linkedin && (
                  <p className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">LinkedIn:</span> 
                    <span className="text-blue-600 font-medium">{extractedData.linkedin}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span>Technical Skills</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {extractedData.skills.map((skill: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <span>Professional Experience</span>
              </h3>
              <div className="space-y-6">
                {extractedData.experience.map((exp: any, index: number) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm border-l-4 border-emerald-400 rounded-r-xl p-4 shadow-sm">
                    <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                    <p className="text-emerald-600 font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-600 mb-2 font-medium">{exp.duration}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                <span>Education</span>
              </h3>
              <div className="space-y-4">
                {extractedData.education.map((edu: any, index: number) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">{edu.degree}</h4>
                        <p className="text-gray-700 font-medium">{edu.school}</p>
                        {edu.stream && <p className="text-sm text-indigo-600 font-medium">Stream: {edu.stream}</p>}
                        {edu.cgpa && <p className="text-sm text-green-600 font-medium">CGPA: {edu.cgpa}</p>}
                    </div>
                      <span className="text-sm text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-full">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {extractedData.certifications && extractedData.certifications.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <span>Certifications</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {extractedData.certifications.map((cert: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-semibold border border-amber-200 shadow-sm"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {extractedData.projects && extractedData.projects.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-pink-600" />
                  <span>Projects</span>
                </h3>
                <div className="space-y-6">
                  {extractedData.projects.map((project: any, index: number) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm border-l-4 border-pink-400 rounded-r-xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 text-lg">{project.name}</h4>
                      <p className="text-gray-700 mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
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
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleDownloadAnalysis}
                icon={Download}
              >
                Download Analysis
              </Button>
              <Button
                onClick={handleFindMatches}
                variant="secondary"
                size="lg"
                icon={Eye}
              >
                Find Job Matches
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}