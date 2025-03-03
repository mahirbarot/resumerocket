import React, { useState } from 'react';
import axios from 'axios';
import base64js from 'base64-js';
import '../index.css';


async function analyzeImage(imageURL, prompt) {
  try {
    const imageResponse = await axios.get(imageURL, { responseType: 'arraybuffer' });
    const imageBuffer = imageResponse.data;
    const base64Image = base64js.fromByteArray(new Uint8Array(imageBuffer));
    const apiKey = 'AIzaSyDObBy45Ullqk6W0qgCqr-4yn-KclbCgdQ'; // Use env var or hardcode

    const model = 'gemini-1.5-pro';

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

function ImageAnalyzer() {
  const [resultText, setResultText] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const imageURL = 'https://krcrtv.com/resources/media2/original/full/1600/center/80/46e7bb6f-f0bd-4f27-affb-a09552267b10-AP23008661331836.jpg';
  const prompt = 'Explain the forestry damage . Categorise the damage in (low, med, high). Is there any electical hazard present? give your views as forest expert.';

  const handleClick = async () => {
    setLoading(true); // Set loading to true
    setResultText(''); // Clear previous result
    try {
      const result = await analyzeImage(imageURL, prompt);
      if (
        result &&
        result.candidates &&
        result.candidates[0] &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts[0] &&
        result.candidates[0].content.parts[0].text
      ) {
        setResultText(result.candidates[0].content.parts[0].text);
      } else {
        setResultText('No text response found');
      }
    } catch (err) {
      console.error('Web example failed:', err);
      setResultText('Error occurred.');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className='imgAnal'>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>
      {loading && <p>Loading...</p>}
      <p>{resultText}</p>
    </div>
  );
}

export default ImageAnalyzer;