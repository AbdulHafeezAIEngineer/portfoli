"use client";

import { useEffect, useRef, useState } from "react";
import { botContent } from "@/data/bots";

type RecognitionResult = { resultIndex: number; results: { length: number; [index: number]: { isFinal: boolean; [index: number]: { transcript: string } } } };
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((event: RecognitionResult) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null; onstart: (() => void) | null;
  start(): void; stop(): void; abort(): void;
};
type VoiceWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export function useVoice(enabled: boolean, onTranscript: (text: string) => void) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [playbackSupported, setPlaybackSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");
  const recognition = useRef<Recognition | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const callback = useRef(onTranscript);
  callback.current = onTranscript;
  const copy = botContent.chat.voice;

  useEffect(() => {
    if (!enabled) return;
    const browser = window as VoiceWindow;
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    setSupported(Boolean(Constructor && window.isSecureContext));
    setPlaybackSupported(typeof window.speechSynthesis?.speak === "function" && typeof window.SpeechSynthesisUtterance === "function");
    if (Constructor && window.isSecureContext) {
      const instance = new Constructor();
      instance.lang = "en-US";
      instance.continuous = false;
      instance.interimResults = false;
      instance.onstart = () => setListening(true);
      instance.onend = () => setListening(false);
      instance.onerror = (event) => {
        setListening(false);
        if (event.error !== "aborted") setError(event.error === "not-allowed" || event.error === "service-not-allowed" ? copy.denied : event.error === "no-speech" ? copy.noSpeech : copy.failed);
      };
      instance.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i].isFinal) transcript += `${event.results[i][0].transcript} `;
        if (transcript.trim()) callback.current(transcript.trim());
      };
      recognition.current = instance;
    }
    return () => {
      const instance = recognition.current;
      if (instance) {
        instance.onresult = null; instance.onerror = null; instance.onend = null; instance.onstart = null;
        instance.abort(); recognition.current = null;
      }
      if (utterance.current) {
        utterance.current.onend = null; utterance.current.onerror = null;
        window.speechSynthesis?.cancel(); utterance.current = null;
      }
    };
  }, [enabled, copy]);

  function stopSpeaking() {
    if (utterance.current) {
      utterance.current.onend = null; utterance.current.onerror = null;
      window.speechSynthesis.cancel(); utterance.current = null;
    }
    setSpeaking(false);
  }
  function start() {
    if (!recognition.current || listening) return;
    stopSpeaking(); setError("");
    try { recognition.current.start(); } catch { setError(copy.failed); }
  }
  function stop() { recognition.current?.stop(); setListening(false); }
  function speak(text: string) {
    if (!playbackSupported) return;
    stopSpeaking();
    const message = new SpeechSynthesisUtterance(text);
    message.lang = "en-US"; message.rate = 1;
    message.onend = () => { setSpeaking(false); utterance.current = null; };
    message.onerror = (event) => {
      setSpeaking(false); utterance.current = null;
      if (event.error !== "canceled" && event.error !== "interrupted") setError(copy.playbackError);
    };
    utterance.current = message; setSpeaking(true); setError("");
    window.speechSynthesis.speak(message);
  }
  return { supported, playbackSupported, listening, speaking, error, start, stop, speak, stopSpeaking };
}
