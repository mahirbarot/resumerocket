import React, { useState, useRef, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import { useResume } from '../context/ResumeContext';
import ResumeInsights from './ResumeInsights';


// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFOCR() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const { saveResume, coins } = useResume();

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);

    // Listen for changes in theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Clean up URL object when component unmounts or file changes
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [pdfUrl]);

  useEffect(() => {
    // Render PDF page when currentPage or file changes
    if (file && pdfUrl) {
      renderPage();
    }
  }, [currentPage, pdfUrl]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    processFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDropActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDropActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDropActive(false);
  };

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setExtractedText('');
      setProgress(0);

      // Create URL for PDF viewer
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      const newPdfUrl = URL.createObjectURL(selectedFile);
      setPdfUrl(newPdfUrl);

      // Load the PDF document to get number of pages
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjs.getDocument(typedArray).promise;
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      };
      fileReader.readAsArrayBuffer(selectedFile);
    } else if (selectedFile) {
      alert('Please select a valid PDF file');
    }
  };

  const renderPage = async () => {
    if (!pdfUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    try {
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      // Get the page
      const page = await pdf.getPage(currentPage);

      // Determine the scale to fit the canvas
      const viewport = page.getViewport({ scale: 1.0 });
      const containerWidth = canvas.parentElement.clientWidth;
      const scale = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      // Set canvas dimensions to match the viewport
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      // Render the page
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering PDF:', error);
    }
  };

  const extractTextFromPDF = async () => {
    if (!file) return;

    // Check if user has enough coins
    if (coins < 10) {
      alert('Not enough coins! You need 10 coins to extract text.');
      return;
    }

    setLoading(true);
    setExtractedText('');
    setProgress(0);

    try {
      const fileReader = new FileReader();

      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);

        // Load the PDF document
        const pdf = await pdfjs.getDocument(typedArray).promise;
        const totalPages = pdf.numPages;
        let fullText = '';

        // Process each page
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          // Update progress
          setProgress(Math.floor((pageNum - 1) / totalPages * 100));

          // Get the page
          const page = await pdf.getPage(pageNum);

          // Render page to canvas for OCR
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Perform OCR on the canvas
          const { data } = await Tesseract.recognize(
            canvas.toDataURL('image/png'),
            'eng',
            {
              logger: m => {
                if (m.status === 'recognizing text') {
                  setProgress(Math.floor((pageNum - 1 + m.progress) / totalPages * 100));
                }
              }
            }
          );

          fullText += `---- Page ${pageNum} ----\n\n` + data.text + '\n\n';
          setExtractedText(prevText => prevText + `---- Page ${pageNum} ----\n\n` + data.text + '\n\n');
        }

        setProgress(100);
        setLoading(false);

        // After successful text extraction:
        saveResume(file, fullText);
      };

      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error extracting text:', error);
      setLoading(false);
      setExtractedText('Error extracting text: ' + error.message);
    }
  };

  const changePage = (offset) => {
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  };

  const copyToClipboard = () => {
    if (!extractedText) return;

    navigator.clipboard.writeText(extractedText)
      .then(() => {
        setIsTextCopied(true);
        setTimeout(() => setIsTextCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-3xl font-bold">Resume Text Extractor</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{coins} coins</span>
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
        </div>

        <div
          className={`mb-8 border-2 border-dashed transition-all duration-300 rounded-xl p-8 text-center ${dropActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : isDarkMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-14 w-14 mb-4 transition-colors ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>

            <h2 className="text-xl font-semibold mb-2">
              {dropActive ? 'Drop your PDF here' : 'Upload your resume'}
            </h2>

            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Drag and drop your PDF file here, or click to browse
            </p>

            {file && (
              <div className={`mt-4 py-2 px-4 rounded-lg inline-flex items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-6 8v4h6v-4H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
              </div>
            )}
          </div>
        </div>

        {pdfUrl && (
          <div className={`mb-8 rounded-xl overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 shadow-lg shadow-black/30' : 'bg-white shadow-lg'}`}>
            <div className={`p-4 flex items-center justify-between transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <h2 className="font-semibold">PDF Preview</h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changePage(-1)}
                  disabled={currentPage <= 1}
                  className={`p-2 rounded-full transition-all transform hover:scale-105 focus:outline-none disabled:opacity-50 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className={`text-sm font-medium px-3 py-1 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  Page {currentPage} of {numPages}
                </div>

                <button
                  onClick={() => changePage(1)}
                  disabled={currentPage >= numPages}
                  className={`p-2 rounded-full transition-all transform hover:scale-105 focus:outline-none disabled:opacity-50 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={`flex justify-center p-4 transition-colors overflow-auto ${isDarkMode ? 'bg-gray-900/40' : 'bg-gray-50'}`}>
              <div className={`overflow-hidden ${isDarkMode ? 'shadow-lg shadow-black/30 ring-1 ring-gray-700' : 'shadow-lg'}`}>
                <canvas ref={canvasRef} className="block pdf-canvas" />
              </div>
            </div>
          </div>
        )}

        {file && (
          <div className="mb-8 flex flex-col items-center">
            <button
              onClick={extractTextFromPDF}
              disabled={loading}
              className={`group relative px-6 py-3 text-white text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed ${loading
                  ? isDarkMode ? 'bg-blue-600/50' : 'bg-blue-400'
                  : isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <span className="flex items-center">
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform transition-transform group-hover:rotate-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{loading ? 'Extracting...' : 'Extract Text'}</span>
                {!loading && <span className="ml-2">(10 coins)</span>}
              </span>
            </button>

            {loading && (
              <div className="mt-6 w-full max-w-md">
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Processing PDF</span>
                  <span>{progress}%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className={`text-sm mt-2 text-center italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {progress < 30 ? 'Analyzing document structure...' :
                    progress < 60 ? 'Recognizing text content...' :
                      progress < 90 ? 'Processing final details...' :
                        'Almost finished...'}
                </p>
              </div>
            )}
          </div>
        )}

        {extractedText && (
          <>
            <div className={`mt-8 transition-all duration-300 ${isDarkMode ? 'bg-gray-800 shadow-lg shadow-black/30' : 'bg-white shadow-lg'} rounded-xl overflow-hidden`}>
              <div className={`p-4 flex justify-between items-center transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-lg font-semibold">Extracted Content</h2>
                </div>

                <button
                  onClick={copyToClipboard}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors focus:outline-none ${isDarkMode
                      ? isTextCopied ? 'bg-green-800 text-green-100' : 'hover:bg-gray-600 focus:bg-gray-600'
                      : isTextCopied ? 'bg-green-100 text-green-800' : 'hover:bg-gray-200 focus:bg-gray-200'
                    }`}
                  aria-label="Copy to clipboard"
                >
                  {isTextCopied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Saved!</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      <span className="text-sm font-medium">Save</span>
                    </>
                  )}
                </button>
              </div>

              <div className={`p-6 overflow-y-auto max-h-96 whitespace-pre-wrap transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                {extractedText}
              </div>

            </div>

            <button
            className='ai-insights-btn'
              type="button"
              onClick={() => setShowInsights(true)}
            >
              Get AI Assistance 
              <img src="/ai.png" alt="" srcSet="" style={{ height: "18px" }} />
            </button>

            {showInsights && (
              <ResumeInsights extractedText={extractedText} />
            )}
          </>


        )}

      </div>

    </div>
  );
}

export default PDFOCR;