'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Copy } from 'lucide-react';
import { Loader } from '@/components/loader';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import animationData from '@/public/animation.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import { Heading } from '@/components/heading';
import { showCustomToast } from '@/app/utils/toast';

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => BrowserSpeechRecognition;
  }
}

const SpeechToText = () => {
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<BrowserSpeechRecognition | null>(null);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [hasTranscribed, setHasTranscribed] = useState<boolean>(false); 

  useEffect(() => {
    const savedText = Cookies.get('transcribedText');
    if (savedText) {
      setTranscribedText(savedText);
    }
  }, []);

  const saveToCookies = (text: string) => {
    Cookies.set('transcribedText', text, { expires: 7 });
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showCustomToast('❌ Speech recognition is not supported in this browser.');
      return;
    }

    if (!isRecording) {
      setTranscribedText('');
      setShowAnimation(true);
      setHasTranscribed(false); // Reset the transcribed state when starting a new recording

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(' ');
        setTranscribedText(transcript);
        saveToCookies(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        showCustomToast(`❌ Error: ${event.error}`);
      };

      recognitionInstance.onend = () => {
        setShowAnimation(false);
        if (isRecording && !hasTranscribed) {
          setHasTranscribed(true); // Mark transcription as completed
          showCustomToast('✅ Speech transcribed successfully!');
        }
      };

      recognitionInstance.start();
      setRecognition(recognitionInstance);
      showCustomToast('🎙️ Recording started...');
    } else {
      recognition?.stop();
      setRecognition(null);
      setShowAnimation(false);
      setHasTranscribed(true); // Mark transcription as completed if manually stopped
      showCustomToast('🛑 Recording stopped');
    }

    setIsRecording(!isRecording);
  };

  const handleCopyText = () => {
    if (transcribedText) {
      navigator.clipboard.writeText(transcribedText);
      showCustomToast('📋 Text copied to clipboard!');
    } else {
      showCustomToast('⚠️ No text available to copy!');
    }
  };

  return (
    <div className="min-h-screen text-black dark:text-white flex flex-col items-start justify-start p-8">
      <Heading
        title="Speech-To-Text"
        description="Live speech-to-text conversion with file upload support."
        icon={Mic}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
      />

      {loading && <Loader />}

      <div className="relative bg-white dark:bg-transparent p-4 rounded-lg w-full max-w-5xl text-center">
        {transcribedText ? (
          <p className="text-lg break-words max-w-full">{transcribedText}</p>
        ) : (
          <p className="text-gray-500">Your transcribed text will appear here</p>
        )}
      </div>

      {showAnimation && (
        <Lottie
          animationData={animationData}
          className="w-40 h-40 absolute bottom-32 left-1/2 transform -translate-x-1/2"
        />
      )}

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex gap-6 px-8 py-3 rounded-full bg-transparent shadow-lg mb-2 items-center border-4 border-transparent bg-clip-border border-image-gradient-to-r from-blue-500 to-green-500">
        <Button
          variant="outline"
          size="icon"
          onClick={handleMicClick}
          className={isRecording ? 'text-red-500' : 'text-blue-500'}
        >
          <Mic className="w-6 h-6" />
        </Button>

        <Button variant="outline" size="icon" onClick={handleCopyText}>
          <Copy className="w-6 h-6 text-blue-500" />
        </Button>
      </div>
    </div>
  );
};

export default SpeechToText;
