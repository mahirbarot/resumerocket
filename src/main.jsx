import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter , Route, Routes } from 'react-router-dom'
import ImageAnalyzer from './components/ImageAnalyzer.jsx'
import NotFound from './components/NotFound.jsx'
import ResumeLanding from './components/ResumeLanding.jsx'
import ResumeDashboard from './components/ResumeDashboard.jsx'
import PDFOCR from './components/PdfOCR.jsx'
import { ResumeProvider } from './context/ResumeContext'
import Layout from './components/Layout'
import MyResumes from './components/MyResumes'
import JobMatcher from './components/JobMatcher'
import { useLocation } from 'react-router-dom'
import RecentlyFundedStartups from './components/RecentlyFundedStartups.jsx'
// import {StartupFunding} from './components/StartupFunding.jsx'

function AppWithLayout({ Component }) {
  const location = useLocation();
  
  // Don't show layout for home page
  if (location.pathname === '/') {
    return <Component />;
  }

  // Show layout for all other pages
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ResumeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route element={<Layout />}>
            <Route path='/image-analyzer' element={<ImageAnalyzer />} />
            <Route path='/ocr' element={<PDFOCR/>} />
            <Route path='/resume' element={<ResumeLanding />} />
            <Route path='/resume-dashboard' element={<ResumeDashboard />} />
            <Route path='/my-resumes' element={<MyResumes />} />
            <Route path='/job-matcher' element={<JobMatcher />} />
            <Route path='/recently-funded' element={<RecentlyFundedStartups />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ResumeProvider>
  </React.StrictMode>,
)
