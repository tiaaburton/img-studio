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

import * as React from 'react';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AnalyzeDocumentDropzone from './AnalyzeDocumentDropzone';


const Analyze: React.FC = () => {
  const [analysis, setAnalysis] = useState<string>("");

  const handleFileAnalyzed = (analysisResult: string) => {
    setAnalysis(analysisResult);
  };

  return (
    <Box>
      <Typography variant="h2">Analyze</Typography>
      <AnalyzeDocumentDropzone onFileAnalyzed={handleFileAnalyzed} />

      {analysis && (
        <Box mt={2}>
          <Typography variant="h6">Extracted Information:</Typography>
          <pre>{analysis}</pre>
        </Box>
      )}
    </Box>
  );
};

export default Analyze;
