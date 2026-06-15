import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  handleAgentChat, 
  getUserChatHistory, 
  deleteUserChatSession 
} from "../api/ai.js"; 
import api from "../api/axios.instance.js"; // Adjust to your relative path to Axios with withCredentials: true

const useChatStore = create(
  persist(
    (set, get) => ({
      history: [],
      messages: [
        {
          role: 'assistant',
          content: "Welcome to your elite AI workspace. I am optimized with live web capabilities to execute deep research, analyze markets, and answer complex queries in real time.",
          toolUsed: 'Internal Base Engine'
        }
      ],
      currentSessionId: null,
      loading: false,
      agentStatus: 'Idle',
      error: null,
      selectedModel: 'llama-3.3-70b-versatile', // Default model
      
      // Available models for user selection (Updated with new open-source models)
      availableModels: [
        { id: 'llama-3.3-70b-versatile', name: '🦙 Llama 3.3 70B (Powerful)', provider: 'Groq', speed: 'Fast' },
        { id: 'llama-3.1-70b-versatile', name: '🦙 Llama 3.1 70B (Balanced)', provider: 'Groq', speed: 'Fast' },
        { id: 'llama-3.1-8b-instant', name: '⚡ Llama 3.1 8B (Fast)', provider: 'Groq', speed: 'Very Fast' },
        { id: 'mixtral-8x7b-32768', name: '🔀 Mixtral 8x7B (Expert)', provider: 'Groq', speed: 'Fast' },
        { id: 'openai/gpt-oss-20b', name: '🚀 GPT-OSS 20B (Efficient)', provider: 'Groq', speed: 'Very Fast' },
        { id: 'qwen/qwen3-32b', name: '🐉 Qwen3 32B (Multilingual)', provider: 'Groq', speed: 'Fast' },
        { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: '👁️ Llama 4 Scout (Agentic)', provider: 'Groq', speed: 'Very Fast' }
      ],
      
      setSelectedModel: (model) => set({ selectedModel: model }),

      // -------------------
      // 1. FETCH ACTIVE SESSION'S HISTORICAL MESSAGES
      // -------------------
      fetchSessionMessages: async (sessionId) => {
        if (!sessionId) return;
        try {
          set({ loading: true, agentStatus: 'Loading conversation...' });
          
          const response = await api.get(`/ai/chat/messages/${sessionId}`);
          
          if (response.data?.status === 'success') {
            const fetchedMessages = response.data.data?.messages || [];
            
            set({ 
              currentSessionId: sessionId,
              messages: fetchedMessages.length > 0 ? fetchedMessages : [
                {
                  role: 'assistant',
                  content: "Conversation loaded.",
                  toolUsed: 'Database Hydration'
                }
              ]
            });
          }
        } catch (err) {
          console.error("Failed to load conversation:", err);
          set({ error: err.message || "Failed to load messages." });
        } finally {
          set({ loading: false, agentStatus: 'Idle' });
        }
      },

      // -------------------
      // FETCH ALL HISTORICAL THREADS (SIDEBAR)
      // -------------------
      fetchHistoryList: async () => {
        try {
          const data = await getUserChatHistory();
          if (data.status === 'success' || data.success) {
            set({ history: data.data?.history || data.history || [] });
          }
        } catch (err) {
          console.error("Zustand history sync dropped:", err);
          set({ error: err.message || "Failed to load chat history." });
        }
      },

      // -------------------
      // START A FRESH CHAT CANVAS
      // -------------------
      handleNewChat: () => {
        set({
          currentSessionId: null,
          messages: [
            {
              role: 'assistant',
              content: "Canvas cleared. Ask me anything—I can dynamically execute real-time web lookups using Llama 3 architectures.",
              toolUsed: 'Internal Base Engine'
            }
          ],
          agentStatus: 'Idle'
        });
      },

      // -------------------
      // SEND PROMPT MESSAGE
      // -------------------
      sendMessage: async (userPrompt) => {
        if (!userPrompt.trim() || get().loading) return;

        set({ 
          loading: true, 
          agentStatus: 'Evaluating Data Requirements...',
          messages: [...get().messages, { role: 'user', content: userPrompt }]
        });

        try {
          setTimeout(() => {
            if (get().loading) set({ agentStatus: 'Orchestrating Live Web Queries...' });
          }, 800);

          const data = await handleAgentChat({
            message: userPrompt,
            sessionId: get().currentSessionId,
            model: get().selectedModel // Pass selected model to backend
          });

          if (data.status === 'success' || data.success) {
            const incomingSessionId = data.sessionId || data.data?.sessionId;
            
            set((state) => ({
              currentSessionId: incomingSessionId,
              messages: [
                ...state.messages,
                {
                  role: 'assistant',
                  content: data.data?.response || data.response,
                  toolUsed: data.data?.toolExecuted || data.toolExecuted || 'Llama Core Pipeline'
                }
              ]
            }));

            await get().fetchHistoryList();
          }
        } catch (err) {
          set((state) => ({
            messages: [
              ...state.messages,
              {
                role: 'assistant',
                content: err.response?.data?.message || err.message || "A network interface transaction failure dropped the request.",
                toolUsed: 'System Error Fallback'
              }
            ]
          }));
        } finally {
          set({ loading: false, agentStatus: 'Idle' });
        }
      },

      // -------------------
      // DELETE CHAT THREAD ENTIRELY
      // -------------------
      deleteSession: async (sessionId) => {
        try {
          const data = await deleteUserChatSession(sessionId);
          if (data.status === 'success' || data.success) {
            if (get().currentSessionId === sessionId) {
              get().handleNewChat();
            }

            set((state) => ({
              history: state.history.filter((item) => item._id !== sessionId)
            }));
          }
        } catch (err) {
          console.error("Failed to remove history entity:", err);
          set({ error: err.message || "Failed to delete conversation thread." });
        }
      },

      // -------------------
      // 2. GENERATE AI IMAGE
      // -------------------
      generateAiImage: async (promptText) => {
        if (!promptText.trim() || get().loading) return;

        set({ 
          loading: true, 
          agentStatus: 'Synthesizing Visual Pixels...' 
        });

        try {
          set((state) => ({
            messages: [...state.messages, { role: 'user', content: `Generate image: ${promptText}` }]
          }));

          const response = await fetch('/api/images/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText }),
          });
          
          const data = await response.json();
          
          if (data.success || data.status === 'success') {
            const imageUrl = data.url || data.data?.url;
            
            set((state) => ({ 
              messages: [
                ...state.messages, 
                { 
                  role: 'assistant', 
                  content: `![Generated Image](${imageUrl})`,
                  toolUsed: 'Diffusion Engine'
                }
              ] 
            }));
          } else {
            throw new Error(data.error || "Failed to generate visual asset.");
          }
        } catch (err) {
          console.error("Frontend HTTP Image Request Failure:", err);
          set((state) => ({
            messages: [
              ...state.messages,
              {
                role: 'assistant',
                content: err.message || "An error occurred while rendering your image.",
                toolUsed: 'System Error Fallback'
              }
            ]
          }));
        } finally {
          set({ loading: false, agentStatus: 'Idle' });
        }
      }
    }),
    {
      name: "agent-core-chat-storage", // LocalStorage registry namespace key
      partialize: (state) => ({ currentSessionId: state.currentSessionId }), // ONLY keep the active session ID inside localStorage
    }
  )
);

export default useChatStore; 