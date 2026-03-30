'use client';

import { useState, useRef, useCallback } from 'react';
import { transcribeAudio } from '@/lib/groqClient';

export function useVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise<string>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        resolve('');
        return;
      }

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        try {
          const text = await transcribeAudio(blob);
          resolve(text);
        } catch (err) {
          console.error('Transcription error:', err);
          resolve('');
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  }, []);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  };
}
