import { Box, Typography, Alert } from '@mui/material'
import React, { useState, useRef, ChangeEvent } from 'react';
import { getDescriptionFromGemini } from '../../api/gemini/action';

import theme from '../../theme'
import { fileToBase64 } from '../edit-components/EditForm'
const { palette } = theme

interface AnalyzeDocumentDropzoneProps {
  onFileAnalyzed: (analysis: string) => void;
}


const AnalyzeDocumentDropzone: React.FC<AnalyzeDocumentDropzoneProps> = ({ onFileAnalyzed }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMessage('Only PDF files are accepted.');
      return;
    }

    setSelectedFile(file);

    try {
      const base64 = await fileToBase64(file);
      // Process base64 with Gemini here
      const analysis = await analyzePDFWithGemini(base64);
      setAnalysisResult(analysis);
      onFileAnalyzed(analysis);
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      setErrorMessage("Error analyzing PDF. Please try again.");
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMessage('Only PDF files are accepted.');
      return;
    }

    setSelectedFile(file);
     try {
      const base64 = await fileToBase64(file);
      const analysis = await analyzePDFWithGemini(base64);
      setAnalysisResult(analysis);
      onFileAnalyzed(analysis);
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      setErrorMessage("Error analyzing PDF. Please try again.");
    }
  };


  const analyzePDFWithGemini = async (base64: string): Promise<string> => {
    // Call Gemini API function with the base64 encoded PDF
    try {
      const response = await getDescriptionFromGemini(base64, "Default");
      return response as string;
    } catch (error) {
      console.error("Error in Gemini analysis:", error);
      throw new Error("Error analyzing PDF with Gemini.");
    }
  };


  return (
    <div>
      <div
        style={{ border: '1px dashed gray', padding: '20px', cursor: 'pointer' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p>Drag and drop a PDF here or</p>
        <button onClick={() => fileInputRef.current?.click()}>Upload PDF</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf"
          onChange={handleFileInputChange}
        />
      </div>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {analysisResult && (
        <div>
          <Typography variant="h6">Analysis Result:</Typography>
          <pre>{analysisResult}</pre>
        </div>
      )}
    </div>
  );
};

export default AnalyzeDocumentDropzone;
