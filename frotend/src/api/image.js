import api from "./axios.instance";

export const aiService = {
  // 🎨 Generate an AI Image
  generateImage: async (prompt, sessionId) => {
    const response = await api.post('ai/generate-image', { prompt, sessionId });
    return response.data;
  },

  // 👁️ Send Image to Groq for Caption/Understanding (Expects Form-Data)
  understandImage: async (formData) => {
    const response = await api.post('ai/understand-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Crucial for file uploads
      },
    });
    return response.data;
  },
};