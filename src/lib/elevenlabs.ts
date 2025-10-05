// Eleven Labs API integration for text-to-speech and speech-to-text
const API_KEY = 'sk_c94ba04f6ae75394703767603a16ba2b8cb0f902e126b950';
const API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs - you can change these to your preferred voices
const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Male voice (Antoni)

/**
 * Converts text to speech using Eleven Labs API
 * @param text Text to convert to speech
 * @returns Audio URL that can be played
 */
export async function textToSpeech(text: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/text-to-speech/${DEFAULT_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Eleven Labs API error: ${response.status}`);
    }

    // Get audio data as blob
    const audioBlob = await response.blob();
    
    // Create a URL for the audio blob
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
}

/**
 * Handles speech-to-text conversion using browser's built-in speech recognition
 * as Eleven Labs doesn't offer speech-to-text
 * @returns Promise that resolves to the recognized text
 */
export function speechToText(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window)) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }
    
    // @ts-ignore - webkitSpeechRecognition is not in TypeScript types
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      resolve(text);
    };
    
    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };
    
    recognition.start();
  });
}

/**
 * Plays audio from a URL
 * @param audioUrl URL of audio to play
 * @returns Promise that resolves when audio is done playing
 */
export function playAudio(audioUrl: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => resolve();
    audio.play();
  });
}
