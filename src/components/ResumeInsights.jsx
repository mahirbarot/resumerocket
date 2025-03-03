import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ResumeInsights = ({ extractedText }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAIInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
      
      const prompt = `
        Based on this resume text, analyze and provide insights in the following JSON format:
        {
          "top_countries": [list of 5 countries paying most for this candidate's skills/profile],
          "top_startups": [list of 5 startups that would be good fits for this candidate],
          "top_job_profiles": [list of 5 job titles/roles that match this candidate's experience],
          "key_skills": [list of 5 most marketable skills from the resume],
          "skill_gaps": [list of 3 skills to develop for better opportunities],
          "ats_score": [numerical score from 1-100 estimating how well this resume would perform in ATS systems]
        }

        Resume Text:
        ${extractedText}
        
        Respond ONLY with the JSON. No other text.
      `;

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
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      // Parse the JSON response text
      const resultText = data.candidates[0].content.parts[0].text;
      const jsonStart = resultText.indexOf('{');
      const jsonEnd = resultText.lastIndexOf('}') + 1;
      const jsonString = resultText.substring(jsonStart, jsonEnd);
      
      const parsedData = JSON.parse(jsonString);
      setInsights(parsedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Second function to get ATS data
  const getATSInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
      
      const prompt = `
        Analyze this resume for ATS optimization and provide detailed feedback in the following JSON format:
        {
          "overall_score": [number between 1-100],
          "keyword_match": [number between 1-100],
          "format_score": [number between 1-100],
          "readability_score": [number between 1-100],
          "improvement_suggestions": [list of 5 specific suggestions to improve ATS compatibility],
          "missing_keywords": [list of 5 industry-standard keywords that should be added]
        }

        Resume Text:
        ${extractedText}
        
        Respond ONLY with the JSON. No other text.
      `;

      const response = await fetch(`${API_URL}?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
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
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      // Parse the JSON response text
      const resultText = data.candidates[0].content.parts[0].text;
      const jsonStart = resultText.indexOf('{');
      const jsonEnd = resultText.lastIndexOf('}') + 1;
      const jsonString = resultText.substring(jsonStart, jsonEnd);
      
      const atsData = JSON.parse(jsonString);
      
      // Merge with existing insights or set as new insights
      if (insights) {
        setInsights({...insights, ats_details: atsData});
      } else {
        setInsights({ats_details: atsData});
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ATS insights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to render bar charts
  const renderBarChart = (data, dataKey, title) => {
    if (!data || data.length === 0) return null;
    
    // Format data for chart display
    const chartData = data.map((item, index) => ({
      name: item,
      value: 100 - index * 10, // Simulated value decreasing by rank
    }));

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Render skills as cards
  const renderSkillCards = (skills, title, colorClass) => {
    if (!skills || skills.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className={`px-3 py-2 rounded-lg text-white ${colorClass}`}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render ATS score gauge
  const renderAtsScoreGauge = (score) => {
    if (!score && score !== 0) return null;
    
    // Determine color based on score
    let color = "#EF4444"; // Red for low scores
    if (score >= 70) color = "#10B981"; // Green for high scores
    else if (score >= 40) color = "#F59E0B"; // Yellow for medium scores
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">ATS Compatibility Score</h3>
        <div className="flex items-center">
          <div 
            className="text-4xl font-bold mr-4" 
            style={{ color }}
          >
            {score}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div 
              className="h-6 rounded-full" 
              style={{ 
                width: `${score}%`,
                backgroundColor: color 
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Resume Insights</h2>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={getAIInsights}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Get AI Insights"}
          </button>
          <button
            type="button"
            onClick={getATSInsights}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
          >
            {loading ? "Loading..." : "Get ATS Analysis"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {renderBarChart(insights.top_countries, "value", "Top Countries for Your Profile")}
            {renderBarChart(insights.top_job_profiles, "value", "Best Matching Job Profiles")}
          </div>
          <div>
            {renderBarChart(insights.top_startups, "value", "Recommended Startups")}
            {renderSkillCards(insights.key_skills, "Key Marketable Skills", "bg-green-600")}
            {renderSkillCards(insights.skill_gaps, "Skills to Develop", "bg-orange-500")}
            {insights.ats_score && renderAtsScoreGauge(insights.ats_score)}
          </div>

          {/* ATS Details Section */}
          {insights.ats_details && (
            <div className="col-span-1 lg:col-span-2 mt-6 p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-bold mb-4">ATS Analysis Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {["overall_score", "keyword_match", "format_score", "readability_score"].map((metric) => (
                  insights.ats_details[metric] !== undefined && (
                    <div key={metric} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm text-gray-500 uppercase">{metric.replace(/_/g, ' ')}</h3>
                      <p className="text-3xl font-bold">{insights.ats_details[metric]}</p>
                    </div>
                  )
                ))}
              </div>
              
              {insights.ats_details.improvement_suggestions && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Improvement Suggestions</h3>
                  <ul className="list-disc pl-5">
                    {insights.ats_details.improvement_suggestions.map((suggestion, idx) => (
                      <li key={idx} className="mb-1">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insights.ats_details.missing_keywords && renderSkillCards(
                insights.ats_details.missing_keywords, 
                "Missing Keywords", 
                "bg-blue-500"
              )}
            </div>
          )}
        </div>
      )}

      {!insights && !loading && (
        <div className="p-8 text-center text-gray-500">
          Click "Get AI Insights" to analyze your resume and see personalized recommendations.
        </div>
      )}
    </div>
  );
};

export default ResumeInsights;