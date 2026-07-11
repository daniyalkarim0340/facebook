import { create } from 'zustand';
import { aiService } from '../api/image.js';

export const useAiStore = create((set) => ({
  // 📊 State Attributes
  generatedImages: [],       // Holds a list of Cloudinary links built by the user
  imageDescription: '',      // Stores the latest text explanation from Groq Vision
  isGenerating: false,       // Loading flag specifically for image creation
  isAnalyzing: false,        // Loading flag specifically for vision processing
  error: null,               // Holds error messages to present in the UI

  // 🎨 Action: Trigger Pollinations Generation & Cloudinary Sync
  generateImageAction: async (prompt, sessionId) => {
    set({ isGenerating: true, error: null });
    try {
      // 🎯 FIXED: Changed 'api' to 'aiService'
      const data = await aiService.generateImage(prompt, sessionId);
      
      set((state) => ({
        generatedImages: [...state.generatedImages, data.imageUrl],
        isGenerating: false,
      }));
      
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to generate image';
      set({ error: errMsg, isGenerating: false });
      throw err;
    }
  },

  // 👁️ Action: Upload Local Device File to Groq Vision
  understandImageAction: async (file, prompt = '') => {
    set({ isAnalyzing: true, error: null });
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (prompt?.trim()) {
        formData.append('prompt', prompt.trim());
      }

      const data = await aiService.understandImage(formData);

      set({ 
        imageDescription: data.description, 
        isAnalyzing: false 
      });
      
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to analyze image';
      set({ error: errMsg, isAnalyzing: false });
      throw err;
    }
  },

  // 🧹 Utility Actions
  clearError: () => set({ error: null }),
  clearDescription: () => set({ imageDescription: '' }),
  resetAiStore: () => set({ generatedImages: [], imageDescription: '', error: null })
}));