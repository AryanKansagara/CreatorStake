import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Speaker, X } from "lucide-react";
import { toast } from "sonner";

// Import custom utilities
import { textToSpeech, speechToText, playAudio } from '@/lib/elevenlabs';
import { processInvestmentQuery } from '@/lib/investmentAdvisor';

export default function InvestmentAdvisor({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle recording and processing speech
  const handleRecordSpeech = async () => {
    try {
      setRecording(true);
      toast.info("Listening... speak now");
      
      const text = await speechToText();
      setUserQuery(text);
      setRecording(false);
      
      await processQuery(text);
    } catch (error: any) {
      console.error('Error recording speech:', error);
      toast.error(`Error recording speech: ${error.message || 'Unknown error'}`);
      setRecording(false);
    }
  };

  // Process text query
  const processQuery = async (text: string) => {
    try {
      setLoading(true);
      toast.info("Processing your investment query...");

      // Get investment advice
      const response = await processInvestmentQuery(text);
      setAdvisorResponse(response);

      // Convert response to speech
      const audioUrl = await textToSpeech(response);
      setAudioUrl(audioUrl);
      
      // Hide loading indicator once we have the response
      setLoading(false);
      
      // Play audio (don't await so loading indicator disappears)
      playAudio(audioUrl);
    } catch (error: any) {
      console.error('Error processing query:', error);
      toast.error(`Error: ${error.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  // Play audio response again
  const handlePlayAudio = () => {
    if (audioUrl) {
      playAudio(audioUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <Card className="glass w-full max-w-md p-6 rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Investment Advisor</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* User query */}
          <div className="min-h-12">
            {userQuery && (
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Your query:</p>
                <p>{userQuery}</p>
              </div>
            )}
          </div>
          
          {/* Advisor response */}
          <div className="min-h-32 max-h-80 overflow-y-auto">
            {advisorResponse && (
              <div className="bg-emerald-500/10 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Investment advice:</p>
                <p className="whitespace-pre-line">{advisorResponse}</p>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant={recording ? "destructive" : "default"}
              className="gap-2 w-3/4"
              onClick={handleRecordSpeech}
              disabled={loading}
            >
              <Mic className="h-5 w-5" />
              {recording ? "Listening..." : "Ask for Investment Advice"}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={handlePlayAudio}
              disabled={!audioUrl || loading}
            >
              <Speaker className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-8 w-8 rounded-full border-2 border-r-transparent border-white animate-spin mx-auto mb-2"></div>
              <p className="text-sm">Analyzing investments...</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
