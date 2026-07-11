import { create } from 'zustand';
import { aiService } from '../api/image.js';

export const useAiStore = create((set) => ({
  // 📊 State Attributes
  generatedImages: [],       // Holds a list of Cloudinary links built by the user
  imageDescription: '',      // Stores the latest text explanation from Groq Vision
  isGenerating: false,       // Loading flag specifically for image creation
  isAnalyzing: false,        // Loading flag specifically for vision processing
  uploadProgress: 0,         // Percentage progress for image upload
  uploadStatusText: '',      // Human-readable upload status text
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
    set({
      isAnalyzing: true,
      uploadProgress: 0,
      uploadStatusText: 'Uploading image 1 of 1...',
      error: null,
    });

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (prompt?.trim()) {
        formData.append('prompt', prompt.trim());
      }

      const data = await aiService.understandImage(formData, (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          set({ uploadProgress: percentComplete });
        }
      });

      set({ 
        imageDescription: data.description,
        isAnalyzing: false,
        uploadProgress: 100,
        uploadStatusText: 'Analyzing uploaded image...',
      });

      return data;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to analyze image';
      set({ error: errMsg, isAnalyzing: false, uploadProgress: 0, uploadStatusText: '' });
    }
  },

  // 🧹 Utility Actions
  clearError: () => set({ error: null }),
  clearDescription: () => set({ imageDescription: '' }),
  resetAiStore: () => set({ generatedImages: [], imageDescription: '', error: null })
}));