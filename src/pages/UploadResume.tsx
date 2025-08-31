import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Download, Eye } from 'lucide-react';
import { ResumeService } from '../services/resumeService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Resume</h1>
        <p className="text-gray-600">Upload your resume to get AI-powered job matching and recommendations</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}
        
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver 
              ? 'border-primary-400 bg-primary-50' 
              : uploaded 
              ? 'border-success-400 bg-success-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploaded ? (
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-success-500 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Resume Uploaded Successfully!</h3>
                <p className="text-gray-600 mt-2">Your resume has been processed and analyzed.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-16 w-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {file ? 'Ready to Upload' : 'Drop your resume here'}
                </h3>
                <p className="text-gray-600 mt-2">
                  {file ? `Selected: ${file.name}` : 'or click to browse files'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Supports PDF and DOCX files up to 10MB</p>
              </div>
              
              <div className="space-y-3">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Browse Files
                </label>
                
                {file && (
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="block w-full sm:w-auto px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Processing...' : 'Upload & Analyze'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {uploading && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-900">Processing Your Resume</h3>
              <p className="text-primary-700">Our AI is extracting key information and skills...</p>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Data Preview */}
      {extractedData && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Extracted Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {extractedData.name}</p>
                <p><span className="font-medium">Email:</span> {extractedData.email}</p>
                <p><span className="font-medium">Phone:</span> {extractedData.phone}</p>
                {extractedData.linkedin && (
                  <p><span className="font-medium">LinkedIn:</span> {extractedData.linkedin}</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {extractedData.skills.map((skill: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3">Experience</h3>
              <div className="space-y-4">
                {extractedData.experience.map((exp: any, index: number) => (
                  <div key={index} className="border-l-4 border-secondary-400 pl-4">
                    <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                    <p className="text-secondary-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-600 mb-1">{exp.duration}</p>
                    <p className="text-sm text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
              <div className="space-y-2">
                {extractedData.education.map((edu: any, index: number) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.school}</p>
                      {edu.stream && <p className="text-sm text-gray-500">Stream: {edu.stream}</p>}
                      {edu.cgpa && <p className="text-sm text-gray-500">CGPA: {edu.cgpa}</p>}
                    </div>
                    <span className="text-sm text-gray-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {extractedData.certifications && extractedData.certifications.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedData.certifications.map((cert: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium"
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
                <h3 className="font-semibold text-gray-900 mb-3">Projects</h3>
                <div className="space-y-4">
                  {extractedData.projects.map((project: any, index: number) => (
                    <div key={index} className="border-l-4 border-accent-400 pl-4">
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <span 
                            key={techIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
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

          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <div className="flex space-x-3">
              <button 
                onClick={handleDownloadAnalysis}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button 
                onClick={handleFindMatches}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Find Job Matches</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}