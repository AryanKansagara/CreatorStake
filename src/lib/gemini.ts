import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = 'AIzaSyDB8V6a9ocdHorGnXi0a_QVuZuXeqCl6Bs';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Analyzes the sentiment of post content
 * @param text The text content of the post
 * @param imageUrl Optional image URL - ignored in text-only analysis
 * @returns A sentiment score between 10-100
 */
export async function analyzeSentiment(text: string, imageUrl?: string | null): Promise<number> {
  try {
    // Enhance the prompt with image description if image URL is provided
    let enhancedText = text;
    
    // If we have an image URL, we can at least mention it in the prompt
    if (imageUrl) {
      enhancedText += `\n\nThe post also includes an image at: ${imageUrl}. Please consider that this post has visual content.`;
    }
    
    // Build a robust prompt for text-only analysis
    const prompt = `
      Analyze the sentiment of this social media post from an investor's perspective.
      ${imageUrl ? "This post includes an image which you cannot see, but please consider that visual content usually increases engagement." : ""}
      
      Focus on how positive or engaging the content would be for potential investors.
      Rate the sentiment on a scale from 0.1 to 1.0, where:
      - 0.1-0.25: Very negative (concerning for investors)
      - 0.26-0.45: Negative (raises concerns)
      - 0.46-0.63: Somewhat negative/neutral (neither attractive nor concerning)
      - 0.64-0.75: Somewhat positive (mildly attractive to investors)
      - 0.76-0.85: Positive (attractive to investors)
      - 0.86-0.95: Very positive (highly attractive)
      - 0.96-1.00: Extremely positive (exceptional investment opportunity)
      
      Post content: "${enhancedText}"
      
      Consider factors like:
      - Tone and language
      - Specific financial or business terms
      - Mentions of growth, opportunity, or success
      - Any warning signs or negative indicators
      ${imageUrl ? "- The fact that the creator included visual content, which typically increases engagement" : ""}
      
      Only respond with a single decimal number between 0.1 and 1.0 representing the sentiment score.
    `;
    
    // Send to Gemini for analysis
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();
    
    // Extract decimal number from response (like 0.75)
    const scoreMatch = responseText.match(/\d+\.?\d*/); // Match numbers with optional decimal point and decimals
    if (scoreMatch) {
      const rawScore = parseFloat(scoreMatch[0]);
      
      // Ensure score is within range 0.1 to 1.0
      const normalizedScore = Math.min(Math.max(rawScore, 0.1), 1.0);
      
      // Convert to 10-100 scale for the database
      return Math.round(normalizedScore * 100);
    }
    
    // If we couldn't parse a score, use a default neutral-positive score
    return 65; // Default to slightly positive
  } catch (error) {
    console.error('Error analyzing sentiment with Gemini:', error);
    // Return a default neutral sentiment if analysis fails
    return 50; // Neutral default
  }
}

