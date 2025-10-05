import { createClient } from '@supabase/supabase-js';
import { generateAIResponse } from './watsonx';

// Initialize Supabase client
const supabaseUrl = 'https://yyyfpcriefcurnosdmdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eWZwY3JpZWZjdXJub3NkbWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDc4NjYsImV4cCI6MjA3NTEyMzg2Nn0.kp3jGsec1NrTeTUpRjPuCEV2p6IXjsyKOaIPYC6S8ug';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Types
interface Creator {
  id: string;
  user_id: string;
  current_stock_price: number;
  followers_count: number;
  created_at: string;
  sentiment_positive?: number;
  last_updated?: string;
  user?: {
    name: string;
    profile_bio?: string;
    profile_image_url?: string;
  };
}

/**
 * Fetches top creators sorted by sentiment score and stock price potential
 */
export async function fetchTopCreators(): Promise<Creator[]> {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select(`
        *,
        user:user_id(name, profile_bio, profile_image_url)
      `)
      .order('sentiment_positive', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching creators:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchTopCreators:', error);
    return [];
  }
}

/**
 * Analyzes creators data to provide investment recommendations
 */
export async function analyzeInvestmentOpportunities(query: string): Promise<string> {
  try {
    // Fetch creators data
    const creators = await fetchTopCreators();
    
    if (!creators.length) {
      return "I couldn't find any creators to analyze. Please try again later.";
    }
    
    // Format creators data for the AI
    const creatorsData = creators.map(creator => ({
      name: creator.user?.name || 'Unknown',
      stockPrice: creator.current_stock_price,
      sentiment: creator.sentiment_positive || 0,
      followers: creator.followers_count,
      bio: creator.user?.profile_bio || 'No bio available'
    }));
    
    // Prepare prompt for Watson X
    const prompt = `
      You are an investment advisor for a social media creator investment platform called Starvest.
      Users can invest in creators and earn returns based on the creator's success.
      
      Here's data about our top creators:
      ${JSON.stringify(creatorsData, null, 2)}
      
      The user has asked: "${query}"
      
      Based on sentiment scores and stock prices, provide investment advice.
      Higher sentiment scores (closer to 100) indicate positive investor sentiment.
      Consider both sentiment and current stock price - sometimes lower priced creators with high sentiment offer better growth opportunities.
      
      Respond in a conversational but professional tone, offering specific recommendations with brief explanations.
      Limit your response to 3 top creator recommendations maximum.

      Note: Avoid using special formatting characters like asterisks. Present names and values in plain text.
    `;
    
    // Send to AI for analysis (Watson X with Gemini fallback)
    const response = await generateAIResponse(prompt);
    return response;
  } catch (error) {
    console.error('Error analyzing investment opportunities:', error);
    return "I'm having trouble analyzing investment opportunities at the moment. Please try again later.";
  }
}

/**
 * Processes a voice query about investments
 */
export async function processInvestmentQuery(query: string): Promise<string> {
  try {
    // Process common investment queries
    if (query.toLowerCase().includes('best creator') || 
        query.toLowerCase().includes('recommend') || 
        query.toLowerCase().includes('top creator') ||
        query.toLowerCase().includes('invest in')) {
      return await analyzeInvestmentOpportunities(query);
    }
    
    // Handle general questions about the platform
    if (query.toLowerCase().includes('how does') && 
        (query.toLowerCase().includes('work') || query.toLowerCase().includes('platform'))) {
      return "Creator stake allows you to invest in promising social media creators. You can buy creator tokens that increase in value as the creator grows in popularity. The platform uses sentiment analysis to help identify promising investment opportunities.";
    }
    
    // Default response for other queries
    return await analyzeInvestmentOpportunities("Who are the best creators to invest in right now?");
  } catch (error) {
    console.error('Error processing investment query:', error);
    return "I'm having trouble processing your query. Please try again with a question about creator investments.";
  }
}
