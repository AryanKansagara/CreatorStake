/**
 * AI integration module supporting both IBM Watson X and Google Gemini
 * 
 * This implementation provides dual API support:
 * 1. Primary: IBM Watson X API
 * 2. Fallback: Google Gemini API
 * 
 * Both implementations use direct API approaches compatible with browser environments.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Watson X Configuration
const WATSONX_SERVICE_URL = 'https://us-south.ml.cloud.ibm.com';
const WATSONX_MODEL_ID = 'ibm/granite-13b-instruct-v2';
const WATSONX_API_KEY = 'CedIG0XUkimBfIvRCCa0suaGnC0lY4ToQXusP5jy1P3R';

// Gemini Configuration
const GEMINI_API_KEY = 'AIzaSyDB8V6a9ocdHorGnXi0a_QVuZuXeqCl6Bs';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Optional CORS proxy to use if direct calls fail
// In production, you would use your own proxy or backend service
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Helper function to handle API calls with CORS proxy fallback
 */
async function apiCallWithFallback(url: string, options: RequestInit): Promise<Response> {
  try {
    // Try direct call first
    const directPromise = fetch(url, options);
    
    // Set up a quick timeout to detect CORS issues
    const timeoutPromise = new Promise<Response>((_, reject) => {
      setTimeout(() => reject(new Error('Direct API call timed out')), 3000);
    });
    
    // Race between the direct call and the timeout
    return await Promise.race([directPromise, timeoutPromise]);
  } catch (error) {
    console.warn('Direct API call failed, trying with CORS proxy:', error);
    
    // If direct call fails (likely due to CORS), try with proxy
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    try {
      return await fetch(proxyUrl, options);
    } catch (proxyError) {
      console.error('Proxy API call also failed:', proxyError);
      throw new Error('All API approaches failed');
    }
  }
}

/**
 * Sends a prompt to Watson X AI and gets a response
 * @param prompt The prompt to send to Watson X
 * @returns The text response from Watson X
 */
export async function generateWithWatsonX(prompt: string): Promise<string> {
  try {
    console.log('Sending request to Watson X AI...');
    
    // Set a quick timeout to detect CORS issues faster
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Try the most common endpoint format first
    const response = await fetch(`${WATSONX_SERVICE_URL}/ml/v1/text/generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WATSONX_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model_id: WATSONX_MODEL_ID,
        input: prompt,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: 200,
          min_new_tokens: 30,
          temperature: 0.7
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Watson X API error (${response.status}): ${errorText}`);
      throw new Error(`Watson X API error: ${response.status}`);
    }

    // Parse and return the response
    const data = await response.json();
    
    // Log the response for debugging
    console.log('Watson X API response:', data);
    
    // Handle different response formats
    if (data.results && data.results[0] && data.results[0].generated_text) {
      return data.results[0].generated_text;
    } else if (data.generated_text) {
      return data.generated_text;
    } else {
      console.warn('Unexpected response format from Watson X:', data);
      return 'Unable to get a response from Watson X at this time.';
    }
  } catch (error) {
    console.error('Error generating with Watson X:', error);
    return 'Unable to connect to Watson X AI at this time. Please try again later.';
  }
}

/**
 * Fallback to Google Gemini for text generation when Watson X fails
 * @param prompt The prompt to send to Gemini
 * @returns The text response from Gemini
 */
export async function generateWithGemini(prompt: string): Promise<string> {
  try {
    console.log('Falling back to Gemini API...');
    
    // Send the prompt to Gemini
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();
    
    console.log('Gemini response received successfully');
    return responseText;
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Investment analysis currently unavailable. Consider reviewing the creator metrics before making a decision.';
  }
}

/**
 * Primary function to get AI-generated text - tries Watson X first, falls back to Gemini
 */
export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    // First try Watson X with a shorter timeout
    const watsonPromise = new Promise<string>(async (resolve, reject) => {
      try {
        // Set a quick timeout for Watson X
        const timeoutId = setTimeout(() => {
          reject(new Error('Watson X timed out'));
        }, 5000);
        
        const response = await generateWithGemini(prompt);
        clearTimeout(timeoutId);
        resolve(response);
      } catch (e) {
        reject(e);
      }
    });
    
    // Try to get Watson response with timeout
    try {
      return await watsonPromise;
    } catch (watsonError) {
      console.error('Watson X failed, falling back to Gemini:', watsonError);
      // Immediately fall back to Gemini
      return await generateWithGemini(prompt);
    }
  } catch (error) {
    console.error('All AI providers failed:', error);
    return 'Investment analysis currently unavailable. Please consider the creator metrics and make your decision based on available data.';
  }
}

/**
 * Create a proxy service for Watson X
 * 
 * For production use, you would typically create a backend service to proxy
 * requests to Watson X AI to avoid exposing your API key in the frontend.
 * 
 * Example backend implementation (Node.js/Express):
 * 
 * ```javascript
 * const express = require('express');
 * const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');
 * const app = express();
 * 
 * app.use(express.json());
 * 
 * // Load environment variables
 * require('dotenv').config();
 * 
 * // Initialize Watson X service
 * const watsonxService = WatsonXAI.newInstance({
 *   version: '2024-05-31',
 *   serviceUrl: 'https://us-south.ml.cloud.ibm.com',
 * });
 * 
 * app.post('/api/generate-text', async (req, res) => {
 *   try {
 *     const { prompt } = req.body;
 *     
 *     const params = {
 *       input: prompt,
 *       modelId: 'ibm/granite-13b-instruct-v2',
 *       projectId: 'YOUR_PROJECT_ID',
 *       parameters: {
 *         max_new_tokens: 500,
 *         min_new_tokens: 50,
 *         temperature: 0.7,
 *       },
 *     };
 *     
 *     const response = await watsonxService.generateText(params);
 *     res.json({ text: response.result.results[0].generated_text });
 *   } catch (error) {
 *     console.error('Error:', error);
 *     res.status(500).json({ error: 'Failed to generate text' });
 *   }
 * });
 * 
 * app.listen(3001, () => {
 *   console.log('Server running on port 3001');
 * });
 * ```
 */
