import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [savedResumes, setSavedResumes] = useState([]);
  const [coins, setCoins] = useState(100);
  const [selectedResumeText, setSelectedResumeText] = useState('');
  
  const saveResume = (pdfFile, extractedText) => {
    setSavedResumes(prev => [...prev, {
      id: Date.now(),
      pdfUrl: URL.createObjectURL(pdfFile),
      text: extractedText,
      date: new Date().toISOString(),
      fileName: pdfFile.name
    }]);
    setCoins(prev => prev - 10);
  };

  const deleteResume = (id) => {
    setSavedResumes(prev => prev.filter(resume => resume.id !== id));
  };

  const setViewingResumeText = (text) => {
    setSelectedResumeText(text);
  };

  return (
    <ResumeContext.Provider value={{ 
      savedResumes, 
      saveResume, 
      deleteResume, 
      coins,
      selectedResumeText,
      setViewingResumeText 
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext); 