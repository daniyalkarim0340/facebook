import { Groq } from 'groq-sdk';

// Initialize Groq (ensure GROQ_API_KEY is in your .env file)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, 
});

export const handleVoiceChat = async (req, res) => {
    const { transcribedText } = req.body;

    if (!transcribedText) {
        return res.status(400).json({ error: "transcribedText is required" });
    }

    // Set HTTP headers to keep the connection open and stream chunks
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    try {
        const stream = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are a helpful, conversational AI voice assistant. Keep answers concise, natural, and easy to speak out loud. Do not use markdown formatting.' 
                },
                { 
                    role: 'user', 
                    content: transcribedText 
                }
            ],
            stream: true,
            temperature: 0.7,
        });

        // Loop through the Groq stream and push chunks to the client immediately
        for await (const chunk of stream) {
            const textChunk = chunk.choices[0]?.delta?.content || '';
            if (textChunk) {
                res.write(textChunk); 
            }
        }

        // Close the connection once the LLM finishes speaking
        res.end(); 

    } catch (error) {
        console.error("Groq processing failed:", error);
        
        // Only send an error status if we haven't already started streaming data
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate AI response" });
        } else {
            res.end(); 
        }
    }
};