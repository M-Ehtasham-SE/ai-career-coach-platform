import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import resumeService from '../services/resumeService';
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Loader,
  Sparkles
} from 'lucide-react';

const ResumeUploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await resumeService.getMyResumes();
      if (response && response.status === 'success') {
        setResumes(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load your resumes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds the 5MB limit.');
      return false;
    }
    
    // Check extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'pdf' && extension !== 'docx') {
      setError('Only PDF and DOCX files are allowed.');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await resumeService.uploadResume(selectedFile);
      if (response && response.status === 'success') {
        setSuccess('Resume uploaded and processed successfully!');
        setSelectedFile(null);
        fetchResumes();
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      const msg = err.response?.data?.message || 'Failed to upload resume. Please try again.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    setError('');
    setSuccess('');
    try {
      await resumeService.deleteResume(id);
      setSuccess('Resume deleted successfully.');
      fetchResumes();
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError('Failed to delete the resume.');
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8 relative overflow-hidden">
      {/* Glowing backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800/80 transition-all text-slate-300 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI Career Coach
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Resume Management</h1>
          <p className="text-slate-400 mt-1">Upload and store your resume for AI evaluation and feedback.</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-400 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Main Grid: Upload & Existing Resumes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Upload Box */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                Upload New Resume
              </h2>

              <form onSubmit={handleUpload} className="space-y-4">
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-500/5' 
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/20'
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange}
                    className="hidden" 
                    accept=".pdf,.docx"
                  />
                  
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>

                  <p className="font-semibold text-sm">Drag & drop your resume here, or <span className="text-indigo-400">browse</span></p>
                  <p className="text-slate-500 text-xs mt-2">Supports PDF and DOCX formats (Max 5MB)</p>
                </div>

                {/* Selected File Details */}
                {selectedFile && (
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-slate-400 hover:text-white hover:underline transition-all shrink-0"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:pointer-events-none"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Parsing & Extracting Text...</span>
                    </>
                  ) : (
                    <span>Upload & Process</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* List of uploaded resumes */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl h-full flex flex-col">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 shrink-0">
                <Clock className="w-5 h-5 text-indigo-400" />
                Your Resumes
              </h2>

              <div className="space-y-4 overflow-y-auto flex-1 max-h-[360px] pr-1 scrollbar-thin">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <Loader className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                    <p className="text-sm">Loading resumes...</p>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    <FileText className="w-10 h-10 mb-3 text-slate-700" />
                    <p className="text-sm font-semibold">No resumes found</p>
                    <p className="text-xs text-slate-600 mt-1">Upload a resume to get started</p>
                  </div>
                ) : (
                  resumes.map((resume) => (
                    <div 
                      key={resume.id}
                      className="p-4 bg-slate-950/40 border border-slate-800 hover:border-slate-700 rounded-xl transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {resume.fileName}
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{formatDate(resume.uploadedAt)}</span>
                        </div>
                        
                        {resume.rawText && (
                          <p className="text-xs text-slate-600 mt-1.5 truncate">
                            Text Extracted: {resume.rawText.length} chars
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/20 transition-all shrink-0 self-center"
                        title="Delete resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
