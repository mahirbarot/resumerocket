import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';

function MyResumes() {
  const { savedResumes, deleteResume } = useResume();
  const [selectedText, setSelectedText] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Listen for changes in theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const handleViewText = (resume) => {
    setSelectedText(resume.text);
    setSelectedResume(resume);
  };

  const handleDeleteClick = (resumeId) => {
    setConfirmDelete(resumeId);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteResume(confirmDelete);
      setConfirmDelete(null);
      
      // If the deleted resume was being viewed, close the modal
      if (selectedResume && selectedResume.id === confirmDelete) {
        setSelectedText(null);
        setSelectedResume(null);
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const copyToClipboard = () => {
    if (!selectedText) return;
    
    navigator.clipboard.writeText(selectedText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <h2 className="text-3xl font-bold">My Resumes</h2>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-opacity-20 transition-colors hover:bg-gray-500 focus:outline-none"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        
        {savedResumes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedResumes.map((resume) => (
              <div
                key={resume.id}
                className={`rounded-xl overflow-hidden transition-all duration-300 transform hover:translate-y-[-4px] ${
                  isDarkMode 
                    ? 'bg-gray-800 shadow-lg shadow-black/30 border border-gray-700' 
                    : 'bg-white shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mt-1 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-semibold truncate" title={resume.fileName}>
                        {resume.fileName}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(resume.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300' 
                          : 'hover:bg-red-100 text-red-500 hover:text-red-600'
                      }`}
                      aria-label="Delete resume"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                
                  <div className="flex items-center mt-3 space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatDate(resume.date)}
                    </p>
                  </div>
                </div>
                
                <div className="p-5 space-y-3">
                  <a
                    href={resume.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg transition-all transform focus:outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500/50' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600/50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-6a2 2 0 01-2-2V4z" />
                      <path fill="#fff" d="M8 11a1 1 0 100 2h4a1 1 0 100-2H8z" />
                      <path fill="#fff" d="M8 7a1 1 0 000 2h4a1 1 0 100-2H8z" />
                    </svg>
                    <span className="font-medium">View PDF</span>
                  </a>
                  
                  <button
                    onClick={() => handleViewText(resume)}
                    className={`flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600 focus:ring-blue-500/50' 
                        : 'bg-gray-100 hover:bg-gray-200 border border-gray-200 focus:ring-blue-600/50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>View Text</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center rounded-xl py-16 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-medium mb-2">No resumes saved yet</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center max-w-md`}>
              Upload your first resume to get started with text extraction and analysis.
            </p>
            <button
              onClick={() => window.location.href = '/upload'}
              className={`mt-6 flex items-center space-x-2 px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500/50' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600/50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Upload Resume</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setConfirmDelete(null)}>
          <div 
            className={`rounded-lg p-6 max-w-md w-full transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-full mr-4 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Delete Resume</h3>
            </div>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Text Viewer Modal */}
      {selectedText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedText(null)}>
          <div 
            className={`rounded-xl overflow-hidden max-w-4xl w-full max-h-[80vh] flex flex-col transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold">
                  {selectedResume && selectedResume.fileName}
                </h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors focus:outline-none ${
                    isDarkMode 
                      ? copied ? 'bg-green-800 text-green-100' : 'hover:bg-gray-600 focus:bg-gray-600' 
                      : copied ? 'bg-green-100 text-green-800' : 'hover:bg-gray-200 focus:bg-gray-200'
                  }`}
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setSelectedText(null)}
                  className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={`flex-1 overflow-y-auto p-6 whitespace-pre-wrap transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              {selectedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyResumes;