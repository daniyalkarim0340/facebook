import express from 'express';
import { handleVoiceChat } from '../controllar/voice.js';


const Voiceroute = express.Router();

// Define the POST route that your frontend/audio pipeline will call
Voiceroute.post('/talk', handleVoiceChat);

export default Voiceroute;