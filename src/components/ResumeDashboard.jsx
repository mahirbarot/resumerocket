import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

// Configure pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const ResumeDashboard = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(URL.createObjectURL(file));
    } else {
      setPdfFile(null);
      alert("Please upload a valid PDF file");
    }
  };

  const extractTextFromPDF = async () => {
    if (!pdfFile) return;
    setLoading(true);
    
    try {
      const response = await fetch(pdfFile);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const worker = createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      let extractedText = "";

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const { data } = await worker.recognize(canvas);
        extractedText += data.text + "\n";
      }

      await worker.terminate();

      const extractedData = parseExtractedText(extractedText);
      setExtractedData(extractedData);
    } catch (error) {
      console.error("Error extracting data:", error);
      alert("Error processing the resume");
    }

    setLoading(false);
  };

  const parseExtractedText = (text) => {
    const lines = text.split("\n");
    const data = { name: "", email: "", phone: "", skills: [], experience: [], education: [] };
    let currentSection = "";

    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;

      if (line.includes("@")) data.email = line;
      else if (line.match(/[\d-+()]{10,}/)) data.phone = line;
      else if (line.toLowerCase().includes("experience")) currentSection = "experience";
      else if (line.toLowerCase().includes("education")) currentSection = "education";
      else if (line.toLowerCase().includes("skills")) currentSection = "skills";
      else {
        if (!data.name && line.length > 2 && !currentSection) data.name = line;
        else if (currentSection === "skills") data.skills = line.split(/[,|;]/).map((s) => s.trim());
        else if (currentSection === "experience") data.experience.push(line);
        else if (currentSection === "education") data.education.push(line);
      }
    });

    return data;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Resume Dashboard</h1>

      <div className="mb-6">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {pdfFile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
            <div style={{ height: "500px" }}>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </div>
            <button
              onClick={extractTextFromPDF}
              disabled={loading}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Extract Resume Data"}
            </button>
          </div>

          {extractedData && (
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Extracted Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Personal Information</h3>
                  <p>Name: {extractedData.name}</p>
                  <p>Email: {extractedData.email}</p>
                  <p>Phone: {extractedData.phone}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {extractedData.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Experience</h3>
                  {extractedData.experience.map((exp, index) => (
                    <div key={index} className="mb-2">
                      <p>{exp}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold">Education</h3>
                  {extractedData.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <p>{edu}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeDashboard;
