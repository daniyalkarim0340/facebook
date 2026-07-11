import api from "./axios.instance";

export const aiService = {
  // 🎨 Generate an AI Image
  generateImage: async (prompt, sessionId) => {
    const response = await api.post('ai/generate-image', { prompt, sessionId });
    return response.data;
  },

  // 👁️ Send Image to Groq for Caption/Understanding (Expects Form-Data)
  understandImage: async (formData, onUploadProgress) => {
    const response = await api.post('ai/understand-image', formData, {
      onUploadProgress,
    });
    return response.data;
  },
};