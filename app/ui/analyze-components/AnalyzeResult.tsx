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

import React from 'react';
import { Box, Typography } from '@mui/material';
import theme from '../../theme';

const { palette } = theme;

interface AnalyzeResultProps {
    analysis: string;
}

const AnalyzeResult: React.FC<AnalyzeResultProps> = ({ analysis }) => {
    return (
        <Box mt={3}>
            <Typography variant="h6" color={palette.text.secondary}>Analysis Result:</Typography>
            <Box sx={{
                p: 2,
                bgcolor: palette.background.paper,
                border: '1px solid',
                borderColor: palette.divider,
                borderRadius: 1,
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
            }}>
                {analysis}
            </Box>
        </Box>
    );
};

export default AnalyzeResult;
