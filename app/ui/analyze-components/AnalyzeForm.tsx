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

'use client'

import React, { useState } from 'react';
import { Box, Typography, Alert, Stack, CircularProgress } from '@mui/material';
import AnalyzeDocumentDropzone from './AnalyzeDocumentDropzone';
import AnalyzeResult from './AnalyzeResult';
import theme from '../../theme';

const { palette } = theme;

const AnalyzeForm: React.FC = () => {
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileAnalyzed = (analysis: string) => {
        setAnalysisResult(analysis);
        setError('');
    };

    const handleError = (message: string) => {
        setError(message);
        setAnalysisResult('');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h1" color={palette.text.secondary} sx={{ fontSize: '1.8rem', mb: 3 }}>
                Analyze Document
            </Typography>

            <AnalyzeDocumentDropzone
                onFileAnalyzed={handleFileAnalyzed}
                onError={handleError}
                setLoading={setLoading}
            />

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            {analysisResult && !loading && (
                <AnalyzeResult analysis={analysisResult} />
            )}
        </Box>
    );
};

export default AnalyzeForm;
