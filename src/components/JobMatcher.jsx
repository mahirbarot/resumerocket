import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

function JobMatcher() {
  const { savedResumes } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResume, setSelectedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference for dark mode on component mount
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    
    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const generateResumeContent = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validate inputs first
      if (!selectedResume) {
        throw new Error('Please select a resume first');
      }

      if (!jobDescription.trim()) {
        throw new Error('Please enter a job description');
      }

      // Updated API URL to use gemini-1.5-flash model
      const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
      
      // Get the selected resume's text
      const resume = savedResumes.find(resume => resume.id === parseInt(selectedResume));
      if (!resume || !resume.text) {
        throw new Error('Selected resume not found or has no content');
      }

      const prompt = `
        I need you to help me tailor my resume for a specific job posting. Please analyze my current resume and the job description, then create an optimized version that highlights relevant experiences and skills.

        Current Resume:
        ${resume.text}

        Job Description:
        ${jobDescription}

        Instructions:
        1. Maintain all truthful information from the original resume
        2. Reorganize and rephrase content to better match the job requirements
        3. Highlight relevant skills and experiences
        4. Keep the same basic structure but optimize the content
        5. Return the result in a clear, professional format
      `;

      // Simplified request body to match the official documentation
      const response = await fetch(`${API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error details:', errorData);
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid response format from API');
      }

      const generatedContent = data.candidates[0].content.parts[0].text;
      setGeneratedResume(generatedContent);
      setError('');

    } catch (error) {
      console.error('Error generating resume:', error);
      setError(error.message || 'Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateResumeContent();
  };

  const handleRegenerate = async () => {
    await generateResumeContent();
  };

  const handleGeneratePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Remove markdown syntax for PDF
      const plainText = generatedResume.replace(/[#*`_]/g, '');
      
      // Set margins and usable width
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const usableWidth = pageWidth - (2 * margin);
      
      // Add title on first page
      doc.setFontSize(16);
      doc.text("Generated Resume", margin, margin);
      
      // Set content font size and calculate line height
      doc.setFontSize(12);
      const lineHeight = doc.getFontSize() * 1.15; // Multiply by 1.15 for comfortable reading
      
      // Split text into lines that fit the width
      const splitText = doc.splitTextToSize(plainText, usableWidth);
      
      // Calculate total height needed
      const totalHeight = splitText.length * lineHeight;
      
      // Calculate how many lines can fit on first page (accounting for title)
      const linesPerPage = Math.floor((pageHeight - (margin * 2) - lineHeight) / lineHeight);
      let currentLine = 0;
      
      // Start content below title on first page
      let yPosition = margin + lineHeight * 2; // Extra line height for spacing after title
      
      // Add text line by line, creating new pages as needed
      while (currentLine < splitText.length) {
        if (yPosition > pageHeight - margin) {
          // Add new page if we've reached the bottom margin
          doc.addPage();
          yPosition = margin; // Reset Y position for new page
        }
        
        doc.text(splitText[currentLine], margin, yPosition);
        yPosition += lineHeight;
        currentLine++;
      }
      
      // Save the PDF
      const fileName = `tailored-resume-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">
            <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Resume</span> Tailor
          </h2>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-200 text-gray-600'} transition-all duration-300 hover:scale-110`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6 transition-all duration-300`}>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Upload your resume and paste a job description to generate a tailored version that highlights your relevant skills and experience.
          </p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center ${isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-700'}`}
            >
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={`block font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Select Your Base Resume
              </label>
              <div className={`relative ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className={`w-full pl-4 pr-10 py-3 border-2 border-color-gray-200 appearance-none rounded-lg focus:outline-none focus:ring-2 transition-shadow duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  required
                >
                  <option value="">Select a resume...</option>
                  {savedResumes.map(resume => (
                    <option key={resume.id} value={resume.id}>
                      {resume.fileName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className={`block font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Job Description
              </label>
              <div className={`relative overflow-hidden rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200`}>
                <svg className="absolute top-3 left-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className={`w-full p-3 pl-10 h-64 border-2 border-color-gray-200 focus:outline-none resize-none ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}`}
                  placeholder="Paste the job description here..."
                  required
                />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                The more detailed the job description, the better we can tailor your resume.
              </p>
            </div>
            
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800 disabled:text-blue-100' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300'
              }`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Tailored Resume</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
        
        {generatedResume && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-12 rounded-xl shadow-xl overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="p-6 border-b border-dashed flex justify-between items-center flex-wrap gap-4 sm:flex-nowrap">
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Tailored Resume
              </h3>
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleGeneratePDF}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Save as PDF</span>
                </motion.button>
                
                <motion.button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:text-blue-200 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white'
                  }`}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Regenerate</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            <div className={`p-8 prose max-w-none ${isDarkMode ? 'prose-invert bg-gray-800' : 'bg-white'}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} {...props} />,
                  h2: ({node, ...props}) => <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} {...props} />,
                  h3: ({node, ...props}) => <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-4 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-4 space-y-2" {...props} />,
                  p: ({node, ...props}) => <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline ? (
                      <code className={`px-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} {...props} />
                    ) : (
                      <code className={`block p-2 rounded mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} {...props} />
                    ),
                  em: ({node, ...props}) => <em className="italic" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                }}
              >
                {generatedResume}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default JobMatcher;