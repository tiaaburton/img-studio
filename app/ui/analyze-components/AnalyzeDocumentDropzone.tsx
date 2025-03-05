// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import React, { useState, useRef, useCallback, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileToBase64 } from '../edit-components/EditForm';
import { getDescriptionFromGemini } from '../../api/gemini/action';

import theme from '../../theme';
const { palette } = theme;

interface AnalyzeDocumentDropzoneProps {
    onFileAnalyzed: (analysis: string) => void;
    onError: (message: string) => void;
    setLoading: (loading: boolean) => void;
}

const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB

const AnalyzeDocumentDropzone: React.FC<AnalyzeDocumentDropzoneProps> = ({ onFileAnalyzed, onError, setLoading }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const analyzePDFWithGemini = async (base64: string): Promise<string> => {
        const prompt = `Analyze this PDF for marketing voice, color palette, and atmosphere.  Provide a concise summary suitable for appending to an image generation prompt. The PDF is encoded in base64: $`;
        try {
            const response = await getDescriptionFromGemini(base64, "Default"); // Adjust type as needed
            return response as string;
        } catch (error) {
            console.error("Error in Gemini analysis:", error);
            throw new Error("Error analyzing PDF with Gemini.");
        }
    };

    const uploadFileInChunks = async (file: File) => {
        setLoading(true);
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let currentChunk = 0;
        let base64Data = '';

        while (currentChunk < totalChunks) {
            const start = currentChunk * CHUNK_SIZE;
            const end = Math.min(file.size, (currentChunk + 1) * CHUNK_SIZE);
            const chunk = file.slice(start, end);

            try {
                const chunkBase64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = reader.result as string;
                        const base64Chunk = result.split(',')[1]; // Extract base64 part
                        resolve(base64Chunk);
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(chunk); // Read as Data URL to get base64
                });

                base64Data += chunkBase64; // Append chunk to the complete base64 data
                currentChunk++;
            } catch (error) {
                console.error("Error reading chunk:", error);
                onError("Error reading file. Please try again.");
                setLoading(false);
                return;
            }
        }

        try {
            const analysis = await analyzePDFWithGemini(base64Data);
            onFileAnalyzed(analysis);
        } catch (error) {
            console.error("Error analyzing PDF:", error);
            onError("Error analyzing PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (!file) return;

        if (file.type !== 'application/pdf') {
            onError('Only PDF files are accepted.');
            return;
        }

        setSelectedFile(file);

        if (file.size > CHUNK_SIZE) {
            await uploadFileInChunks(file);
        } else {
            setLoading(true);
            try {
                const base64 = await fileToBase64(file);
                const analysis = await analyzePDFWithGemini(base64);
                onFileAnalyzed(analysis);
            } catch (error) {
                console.error("Error analyzing PDF:", error);
                onError("Error analyzing PDF. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    }, [onFileAnalyzed, onError, setLoading]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

    const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onDrop([file]);
        }
    };

    return (
        <Box {...getRootProps()} sx={{
            border: '1px dashed gray',
            padding: '20px',
            cursor: 'pointer',
            textAlign: 'center',
            '&:hover': {
                backgroundColor: palette.action.hover,
            },
        }}>
            <input {...getInputProps()} accept=".pdf" onChange={handleFileSelect} ref={fileInputRef} style={{ display: 'none' }} />
            <Typography>
                {isDragActive ? 'Drop the PDF here...' : 'Drag and drop a PDF here, or click to select file'}
            </Typography>
            {selectedFile && <Typography>Selected file: {selectedFile.name}</Typography>}
        </Box>
    );
};

export default AnalyzeDocumentDropzone;
