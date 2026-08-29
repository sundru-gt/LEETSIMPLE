const express = require('express');
const router = express.Router();
const { analyzeWithGroq } = require('../services/groqService');

router.post('/analyze', async (req, res) => {
    try {
        const { title, problem, constraints } = req.body;

        // Validating the input received
        if (
            !title || typeof title !== 'string' ||
            !problem || typeof problem !== 'string' ||
            !constraints || typeof constraints !== 'string'
        ) {
            return res.status(400).json({
                error: 'Missing or invalid required fields: title, problem, constraints (must be non-empty strings)'
            });
        }

        // Calling Groq API for analysis
        const analysis = await analyzeWithGroq({ title, problem, constraints });
        return res.json(analysis);

    } catch (error) {
        console.error('Error in /analyze:', error.message);

        // Rate limit handling from Groq
        if (error.message.includes('429')) {
            return res.status(429).json({
                error: 'Rate limit reached. Please wait a moment and try again.'
            });
        }

        // Upstream service failure
        if (error.message.includes('Groq API')) {
            return res.status(503).json({
                error: 'Analysis service temporarily unavailable. Please try again.'
            });
        }

        return res.status(500).json({
            error: 'Failed to analyze problem. Please try again.'
        });
    }
});

module.exports = router;