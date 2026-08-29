require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzeRoute = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//initially
app.use(cors({
    origin: ['chrome-extension://*', 'http://localhost:*']
}));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

//Haven't created routes yet.
app.use('/api', analyzeRoute);
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`LEETSIMPLE backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    if (!process.env.GROQ_API_KEY) {
        console.log('Groq_api key is missing');
        process.exit(1);
    }
});