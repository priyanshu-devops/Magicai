'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Copy } from 'lucide-react';
import { Loader } from '@/components/loader';
import Cookies from 'js-cookie';
import Lottie from 'lottie-react';
import animationData from '@/public/animation.json'; // Assuming you have the animation file
import { Heading } from '@/components/heading'; // Import the Heading component

// Declare SpeechRecognition globally for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

type SpeechRecognitionType = {
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

const SpeechToText = () => {
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(null);
  const [showAnimation, setShowAnimation] = useState<boolean>(false); // For controlling animation visibility

  useEffect(() => {
    const savedText = Cookies.get('transcribedText');
    if (savedText) {
      setTranscribedText(savedText);
    }
  }, []);

  const saveToCookies = (text: string) => {
    Cookies.set('transcribedText', text, { expires: 7 });
  };

  // 🎤 Mic Click (Speech Recognition)
  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    if (!isRecording) {
      // Clear existing text on mic start
      setTranscribedText('');
      setShowAnimation(true); // Show animation when starting to record

      const recognitionInstance = new SpeechRecognition() as SpeechRecognitionType;
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => (result[0] as SpeechRecognitionResult).transcript)
          .join(' ');
        setTranscribedText(transcript);
      };

      recognitionInstance.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech Recognition Error:', event.error);
      };

      recognitionInstance.onend = () => {
        // Hide animation when recognition stops
        setShowAnimation(false);
      };

      recognitionInstance.start();
      setRecognition(recognitionInstance);
    } else {
      recognition?.stop();
      setRecognition(null);
      setShowAnimation(false); // Hide animation when stopping the recording
    }

    setIsRecording(!isRecording);
  };

  // 📋 Copy Text to Clipboard
  const handleCopyText = () => {
    if (transcribedText) {
      navigator.clipboard.writeText(transcribedText);
    }
  };

  return (
    <div className="min-h-screen text-black dark:text-white flex flex-col items-start justify-start p-8">
      {/* Heading Component */}
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

      {/* Lottie Animation (outside the capsule) */}
      {showAnimation && (
        <Lottie
          animationData={animationData}
          className="w-40 h-40 absolute bottom-32 left-1/2 transform -translate-x-1/2"
        />
      )}

      {/* Capsule with Gradient Border and Mic/Copy Buttons */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex gap-6 px-8 py-3 rounded-full bg-transparent shadow-lg mb-2 items-center border-4 border-transparent bg-clip-border border-image-gradient-to-r from-blue-500 to-green-500">
        {/* 🎤 Mic Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleMicClick}
          className={isRecording ? 'text-red-500' : 'text-blue-500'}
        >
          <Mic className="w-6 h-6" />
        </Button>

        {/* 📋 Copy Button */}
        <Button variant="outline" size="icon" onClick={handleCopyText}>
          <Copy className="w-6 h-6 text-blue-500" />
        </Button>
      </div>
    </div>
  );
};

export default SpeechToText;
