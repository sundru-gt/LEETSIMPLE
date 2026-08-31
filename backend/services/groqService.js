const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

const systemPrompt = `You are LEETSIMPLE, an algorithm complexity assistant for LeetCode.

Your job is to analyze a LeetCode problem and determine the expected time and space complexity of an efficient solution.

Analyze:
* Problem statement
* Input constraints
* Expected optimal algorithmic approach
* Required auxiliary data structures

Return:
1. Expected Time Complexity
2. Expected Space Complexity
3. High-level recommended approach (keep it brief, act as a hint not a solution)
4. Short explanation of why the complexity is appropriate

Do NOT provide:
* Complete code
* Pseudocode that effectively reveals the entire solution
* Long tutorials
* Unnecessary discussion
* Multiple alternative solutions unless absolutely necessary

Keep the approach useful as a hint rather than a complete solution.

Return ONLY valid JSON with no additional text:
{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "approach": "...",
  "explanation": "..."
}`;

async function analyzeWithGroq(problemData) {
    try {
        const userMessage = `
Problem Title: ${problemData.title}

Problem Statement:
${problemData.problem}

Constraints:
${problemData.constraints}
`;

        const response = await axios.post(
            GROQ_API_URL,
            {
                model: MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.1,
                max_tokens: 5000,
                response_format: { type: 'json_object' }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        const choice = response.data?.choices?.[0];
        if (!choice || !choice.message?.content) {
            throw new Error('Groq returned an empty or invalid response structure');
        }

        const parsed = JSON.parse(choice.message.content.trim());

        // Validate required fields
        const requiredKeys = ['timeComplexity', 'spaceComplexity', 'approach', 'explanation'];
        for (const key of requiredKeys) {
            if (!parsed[key]) {
                throw new Error(`Missing required field '${key}' in Groq response`);
            }
        }

        return parsed;
    } catch (error) {
        if (error.response) {
            console.error('Groq API error:', error.response.status, error.response.data);
            throw new Error(
                `Groq API error (${error.response.status}): ${error.response.data?.error?.message || JSON.stringify(error.response.data)
                }`
            );
        }
        throw error;
    }
}

module.exports = { analyzeWithGroq };