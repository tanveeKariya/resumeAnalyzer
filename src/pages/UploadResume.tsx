import React, { useState } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertCircle, Brain, Download, Eye, Zap, 
  Award, Sparkles, ArrowRight, Clock, User, Building, MapPin, Mail, Phone,
  Globe, Star, Trophy, Target
} from 'lucide-react';
import { ResumeAnalysisService, EnhancedNLPService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

interface ResumeAnalysis {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  location?: string;
  summary?: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    location?: string;
    description: string;
    technologies?: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    cgpa?: string;
    stream?: string;
    location?: string;
  }>;
  certifications?: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    duration?: string;
    url?: string;
  }>;
  languages?: string[];
  achievements?: string[];
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
  const [processingStage, setProcessingStage] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (selectedFile.size > maxSize) {
      setError('File size too large. Please upload a file smaller than 10MB.');
      return;
    }

    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.docx')) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    setFile(selectedFile);
    setError('');
    setUploaded(false);
    setExtractedData(null);
    setProcessingStage('');
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
    setProcessingStage('Extracting text from file...');

    try {
      // Enhanced processing stages
      setTimeout(() => setProcessingStage('Analyzing content with AI...'), 1000);
      setTimeout(() => setProcessingStage('Extracting skills and experience...'), 3000);
      setTimeout(() => setProcessingStage('Generating professional insights...'), 5000);

      // Extract text from file
      const resumeText = await EnhancedNLPService.getResumeText(file);
      
      // Process with AI
      const extractedData = await EnhancedNLPService.extractResumeData(resumeText);
      
      // Upload to backend
      const result = await ResumeAnalysisService.uploadResume({
        originalText: resumeText,
        fileName: file.name
      });
      
      setExtractedData(extractedData);
      setAnalysisId(result.data._id);
      setUploading(false);
      setUploaded(true);
      setProcessingStage('');
      
      // Store analysis ID for job matching
      localStorage.setItem('currentAnalysisId', result.data._id);
      setToast({ message: 'Resume analyzed successfully!', type: 'success' });
      
    } catch (error: any) {
      console.error('Resume processing failed:', error);
      setError(error.message || 'Failed to process resume. Please try again.');
      setUploading(false);
      setProcessingStage('');
      setToast({ message: 'Failed to process resume', type: 'error' });
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
      const dataStr = JSON.stringify({
        ...extractedData,
        analyzedAt: new Date().toISOString(),
        analyzedBy: user?.name || 'Unknown'
      }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-analysis-${analysisId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const sampleFiles = [
    { name: 'Software Engineer Resume.pdf', type: 'PDF', icon: FileText },
    { name: 'Frontend Developer CV.docx', type: 'DOCX', icon: FileText },
    { name: 'Full Stack Developer.pdf', type: 'PDF', icon: FileText }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-xl">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <span>Upload Resume</span>
        </h1>
        <p className="text-slate-600 text-xl font-medium leading-relaxed">
          Upload your resume to get AI-powered analysis and intelligent job matching
        </p>
      </div>

      {/* Sample Files */}
      <Card glass padding="lg" shadow="medium" className="border border-white/20">
        <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span>Try with Sample Files</span>
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {sampleFiles.map((sample, index) => {
            const Icon = sample.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  const mockFile = new File(['sample content'], sample.name, {
                    type: sample.type === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  });
                  handleFileSelect(mockFile);
                }}
                className="p-6 border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{sample.name}</p>
                    <p className="text-sm text-slate-500">{sample.type} Sample</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

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
              ? 'border-blue-400 bg-blue-50/50 scale-105 shadow-xl' 
              : uploaded 
              ? 'border-emerald-400 bg-emerald-50/50 shadow-xl'
              : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-lg'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploaded ? (
            <div className="space-y-8">
              <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Resume Uploaded Successfully!</h3>
                <p className="text-slate-600 text-lg font-medium">Your resume has been processed and analyzed with AI precision.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
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
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg px-10 py-5 rounded-2xl cursor-pointer inline-flex items-center shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-violet-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FileText className="h-6 w-6 mr-3" />
                  Browse Files
                </label>
                
                {file && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    loading={uploading}
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
        <Card className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 text-white shadow-2xl border-0 relative overflow-hidden" padding="xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          </div>
          <div className="relative z-10 flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center animate-pulse shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-2xl mb-2">Processing Your Resume</h3>
              <p className="text-white/90 text-lg font-medium mb-3">{processingStage}</p>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm font-medium">This may take 30-60 seconds</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </Card>
      )}

      {/* Extracted Data Preview */}
      {extractedData && (
        <div className="space-y-8">
          {/* Personal Info Card */}
          <Card glass padding="xl" shadow="large" className="border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                <User className="h-8 w-8 text-blue-600" />
                <span>Personal Information</span>
              </h2>
              <div className="flex items-center space-x-2 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Analysis Complete</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 glass rounded-2xl border border-slate-200/60">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Name</span>
                    <p className="text-slate-900 font-bold text-lg">{extractedData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 glass rounded-2xl border border-slate-200/60">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Email</span>
                    <p className="text-slate-900 font-bold text-lg">{extractedData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 glass rounded-2xl border border-slate-200/60">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Phone</span>
                    <p className="text-slate-900 font-bold text-lg">{extractedData.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {extractedData.linkedin && (
                  <div className="flex items-center space-x-4 p-4 glass rounded-2xl border border-slate-200/60">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">LinkedIn</span>
                      <p className="text-blue-600 font-bold text-lg">{extractedData.linkedin}</p>
                    </div>
                  </div>
                )}
                
                {extractedData.location && (
                  <div className="flex items-center space-x-4 p-4 glass rounded-2xl border border-slate-200/60">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Location</span>
                      <p className="text-slate-900 font-bold text-lg">{extractedData.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="p-6 bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="h-6 w-6 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-lg">Profile Strength</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{extractedData.skills.length}</div>
                      <div className="text-sm text-slate-600 font-medium">Skills</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-violet-600">{extractedData.experience.length}</div>
                      <div className="text-sm text-slate-600 font-medium">Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Skills Section */}
          <Card glass padding="xl" shadow="large" className="border border-white/20">
            <h3 className="font-bold text-slate-900 text-2xl flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-violet-600" />
              </div>
              <span>Technical Skills ({extractedData.skills.length})</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {extractedData.skills.map((skill: string, index: number) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-violet-100 text-blue-800 rounded-2xl text-sm font-bold border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Professional Summary */}
          {extractedData.summary && (
            <Card glass padding="xl" shadow="large" className="border border-white/20">
              <h3 className="font-bold text-slate-900 text-2xl flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <span>Professional Summary</span>
              </h3>
              <div className="p-6 glass rounded-3xl border border-slate-200/60 shadow-lg">
                <p className="text-slate-700 leading-relaxed font-medium text-lg">{extractedData.summary}</p>
              </div>
            </Card>
          )}

          {/* Experience Section */}
          <Card glass padding="xl" shadow="large" className="border border-white/20">
            <h3 className="font-bold text-slate-900 text-2xl flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Building className="h-6 w-6 text-emerald-600" />
              </div>
              <span>Professional Experience ({extractedData.experience.length})</span>
            </h3>
            <div className="space-y-6">
              {extractedData.experience.map((exp: any, index: number) => (
                <div key={index} className="glass border-l-4 border-emerald-400 rounded-r-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xl mb-1">{exp.title}</h4>
                      <p className="text-emerald-600 font-bold text-lg">{exp.company}</p>
                      {exp.location && <p className="text-slate-600 font-medium">{exp.location}</p>}
                    </div>
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-2xl text-sm font-bold border border-emerald-200">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium mb-4">{exp.description}</p>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech: string, techIndex: number) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Education Section */}
          <Card glass padding="xl" shadow="large" className="border border-white/20">
            <h3 className="font-bold text-slate-900 text-2xl flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <span>Education ({extractedData.education.length})</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {extractedData.education.map((edu: any, index: number) => (
                <div key={index} className="glass rounded-3xl p-8 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-lg mb-2">{edu.degree}</h4>
                      <p className="text-slate-700 font-semibold text-base">{edu.school}</p>
                      {edu.location && <p className="text-slate-600 font-medium text-sm">{edu.location}</p>}
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
          </Card>

          {/* Action Buttons */}
          <Card className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 text-white shadow-2xl border-0 relative overflow-hidden" padding="xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            </div>
            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Find Your Dream Job?</h3>
              <p className="text-white/90 text-lg mb-8">
                Your resume has been analyzed. Now let's find the perfect job matches for you!
              </p>
              <div className="flex justify-center space-x-6">
                <Button
                  onClick={handleFindMatches}
                  variant="secondary"
                  size="xl"
                  icon={Target}
                  className="bg-white text-blue-600 hover:bg-slate-100 group"
                >
                  <span>Find Job Matches</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={handleDownloadAnalysis}
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  icon={Download}
                >
                  Download Analysis
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}