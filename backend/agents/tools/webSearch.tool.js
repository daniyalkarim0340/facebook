import dotenv from 'dotenv';
import { tavily } from '@tavily/core';
import { completeChat } from '../llm.provider.js';
import { ROUTER_MODEL } from '../agent.config.js';

dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function optimizeSearchQuery(message, history = []) {
  let query = message.replace(/(search the web for|search for|look up|google for|web search)/gi, '').trim();

  if (history.length > 0 && query.length < 15) {
    try {
      const expanded = await completeChat({
        model: ROUTER_MODEL,
        temperature: 0.1,
        maxTokens: 120,
        messages: [
          ...history.slice(-4),
          {
            role: 'user',
            content: `Rewrite this into a single clean web search query. Output ONLY the query string.\nPrompt: "${query}"`,
          },
        ],
      });
      if (expanded?.trim().length > 3) query = expanded.trim();
    } catch {
      // keep original query
    }
  }

  return query;
}

export async function runWebSearch(query, { maxResults = 5 } = {}) {
  const results = await tvly.search(query, {
    searchDepth: 'advanced',
    maxResults,
  });

  const formatted = results.results
    .map((r) => `Source: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`)
    .join('\n---\n');

  return {
    query,
    raw: results,
    context: formatted || 'No web results found.',
    sourceCount: results.results?.length ?? 0,
  };
}
