import React from 'react';
import { Link } from 'react-router-dom';

const ResumeLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">ResumeGenius</h1>
        </div>
        <div className="flex gap-4">
          <a href="#how-it-works" className="text-gray-600">How it works</a>
          <a href="#pricing" className="text-gray-600">Pricing</a>
          <a href="#resources" className="text-gray-600">Resources</a>
          <a href="#help" className="text-gray-600">Help Center</a>
          <button className="px-4 py-2 text-blue-500">Sign in</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Get started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-[#e5d7cc] px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Instantly create a job-winning resume
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Our AI-powered tool instantly creates a resume tailored to the job you want. It's like having a professional resume writer at your fingertips.
          </p>
          <div className="flex gap-4 max-w-xl">
            <input
              type="text"
              placeholder="Job title"
              className="flex-1 px-4 py-3 rounded-md border"
            />
            <button className="px-6 py-3 bg-blue-500 text-white rounded-md">
              Create my resume
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">A better resume, faster</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get instant access to our AI-powered resume builder and start creating a resume that gets noticed by employers
          </p>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md">
            Start now
          </button>
        </div>
      </div>

      {/* How it works Section */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">How it works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold mb-2">Upload your resume</h3>
                <p className="text-gray-600">Upload your current resume or create a new one with our resume builder</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold mb-2">Get instant feedback</h3>
                <p className="text-gray-600">Our AI-powered tool will analyze your resume and provide real-time feedback to help you improve</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold mb-2">Download your resume</h3>
                <p className="text-gray-600">Download your resume as a PDF or Word document, or copy and paste the LaTeX code</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeLanding; 