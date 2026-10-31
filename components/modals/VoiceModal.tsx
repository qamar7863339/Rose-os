'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Mic, MicOff, X, Volume2, PhoneCall, Send } from 'lucide-react';

const RECEPTIONIST_SCENARIOS = [
  'Hi, I want to book a showing for the Floor 42 Penthouse at Aura Dynamics tomorrow at 2 PM.',
  'We are looking to lease 6,000 sq ft of commercial office space with a $30,000 monthly budget.',
  'Create a new qualified lead for Sophia Lindqvist at Nordic Ventures worth $28,500.',
];

export default function VoiceModal() {
  const { voiceModalOpen, setVoiceModalOpen, sendMessage, executeToolCall } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [receptionistReply, setReceptionistReply] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!voiceModalOpen) return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [voiceModalOpen]);

  if (!voiceModalOpen) return null;

  const startBrowserSpeechRecognition = () => {
    setIsListening(true);
    setReceptionistReply('');
    // Attempt Web Speech API if available in browser
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as unknown as Record<string, unknown>).SpeechRecognition ||
          (window as unknown as Record<string, unknown>).webkitSpeechRecognition
        : null;

    if (SpeechRecognition && typeof SpeechRecognition === 'function') {
      try {
        const recognition = new (SpeechRecognition as new () => {
          lang: string;
          interimResults: boolean;
          onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
        })();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.onresult = (event) => {
          const text = event.results[0]?.[0]?.transcript || '';
          if (text) setTranscribedText(text);
          setIsListening(false);
        };
        recognition.onerror = () => {
          setIsListening(false);
        };
        recognition.onend = () => {
          setIsListening(false);
        };
        recognition.start();
        return;
      } catch {
        // Fallback below
      }
    }

    setTimeout(() => {
      const sample = RECEPTIONIST_SCENARIOS[Math.floor(Math.random() * RECEPTIONIST_SCENARIOS.length)];
      setTranscribedText(sample);
      setIsListening(false);
    }, 1800);
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsListening(false);
    setTranscribedText('');
    setReceptionistReply('');
    setTimer(0);
    setVoiceModalOpen(false);
  };

  const handleSimulateReceptionistCall = async () => {
    if (!transcribedText.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: transcribedText }],
          selectedModel: 'ROSE Autonomous v4',
          userRole: 'super_admin',
          systemOverride: `You are "Aura FrontDesk AI", the live 24/7 Voice AI Receptionist for Aura Dynamics inside ROSE AI OS.
Speak naturally and concisely (2-3 sentences max) as if on a live phone call.
Floor 42 Penthouse is $28,500/month NNN (36-month minimum).
If the caller wants to book a showing or is a new prospect, invoke create_crm_lead or calendar_create_event if appropriate and confirm their details warmly.`,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.functionCalls)) {
        for (const fc of data.functionCalls) {
          await executeToolCall(fc.name, fc.args || {}, false, 'Aura FrontDesk AI (Voice)');
        }
      }
      const reply =
        data.text ||
        'Thank you for calling Aura Dynamics. I have logged your inquiry and reserved your showing slot.';
      setReceptionistReply(reply);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.rate = 1.02;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setReceptionistReply(
        'Thank you for calling Aura Dynamics! I have qualified your inquiry and scheduled your showing.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendToMainChat = () => {
    if (transcribedText.trim()) {
      sendMessage(transcribedText);
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 flex flex-col items-center text-center space-y-4">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            <PhoneCall className="w-4 h-4 text-neutral-400" />
            <span>AI Receptionist &amp; Live Voice Simulator</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pulsing Voice Sphere */}
        <div className="relative my-2 flex items-center justify-center">
          {(isListening || isProcessing) && (
            <div className="absolute w-24 h-24 rounded-full border border-neutral-400/40 animate-ping" />
          )}
          <button
            onClick={startBrowserSpeechRecognition}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="Click to speak or capture voice"
          >
            {isListening ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
          </button>
        </div>

        <div className="text-xs font-mono text-neutral-400">
          Session 00:{timer < 10 ? `0${timer}` : timer} ·{' '}
          {isListening
            ? 'Listening...'
            : isProcessing
            ? 'AI Receptionist responding...'
            : 'Click mic or choose a caller scenario below'}
        </div>

        {/* Quick Caller Test Scenarios */}
        <div className="w-full flex flex-wrap gap-1.5 justify-center">
          {RECEPTIONIST_SCENARIOS.map((sc, i) => (
            <button
              key={i}
              onClick={() => setTranscribedText(sc)}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors text-left"
            >
              &ldquo;{sc.slice(0, 54)}...&rdquo;
            </button>
          ))}
        </div>

        {/* Editable Caller Transcript */}
        <div className="w-full space-y-2 text-left">
          <label className="text-[11px] font-mono text-neutral-400">Caller / Voice Input:</label>
          <textarea
            rows={2}
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            placeholder="Speak into microphone or type caller statement..."
            className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 outline-none"
          />
        </div>

        {/* AI Receptionist Spoken Response */}
        {receptionistReply && (
          <div className="w-full p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100/70 dark:bg-neutral-900 text-left space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-900 dark:text-neutral-100">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Aura FrontDesk AI (Spoken Reply):</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {receptionistReply}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleClose}
            className="px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateReceptionistCall}
              disabled={!transcribedText.trim() || isProcessing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Receptionist Voice</span>
            </button>
            <button
              onClick={handleSendToMainChat}
              disabled={!transcribedText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
