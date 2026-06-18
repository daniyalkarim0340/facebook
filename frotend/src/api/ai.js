import api from "./axios.instance";

// -------------------
// GET AVAILABLE AGENTS
// -------------------
export const getAvailableAgents = async () => {
  try {
    const response = await api.get("/ai/agents");
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

// -------------------
// SEND CHAT MESSAGE (Core AI Agent Engine)
// -------------------
export const handleAgentChat = async (chatData) => {
  try {
    // chatData payload should look like: { message: "your prompt", sessionId: "optionalId", model: "model-id" }
    const response = await api.post("/ai/chat/agent", chatData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

// -------------------
// GET CHAT HISTORY LIST (Sidebar Summary Titles)
// -------------------
export const getUserChatHistory = async () => {
  try {
    const response = await api.get("/ai/chat/history");
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

// -------------------
// DELETE CHAT SESSION THREAD
// -------------------
export const deleteUserChatSession = async (sessionId) => {
  try {
    const response = await api.delete(`/ai/chat/history/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

// -------------------
// TRANSCRIBE AUDIO
// -------------------
export const transcribeAudio = async (audioBlob) => {
  try {
    // Ensure we have a proper Blob with correct MIME type
    let audioToSend = audioBlob;
    
    if (!audioToSend.type || !audioToSend.type.startsWith('audio/')) {
      audioToSend = new Blob([audioBlob], { type: 'audio/webm' });
    }

    const formData = new FormData();
    formData.append("audio", audioToSend);

    // Let axios handle Content-Type header automatically for FormData
    const response = await api.post("/transcribe/transcribe", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};