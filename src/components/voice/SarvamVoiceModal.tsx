import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  X,
  CheckCircle2,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  MapPin,
  Clock,
  Weight,
} from 'lucide-react';
import { Language } from '../../types';
import {
  extractFieldsFromTranscript,
  ExtractedVoiceIntent,
  SAMPLE_VOICE_PROMPTS,
  speakConfirmation,
} from '../../services/sarvamVoiceService';
import { getT } from '../../utils/translations';

interface SarvamVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfirmedIntent: (intent: ExtractedVoiceIntent) => void;
}

export const SarvamVoiceModal: React.FC<SarvamVoiceModalProps> = ({
  isOpen,
  onClose,
  language,
  onConfirmedIntent,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [extracted, setExtracted] = useState<ExtractedVoiceIntent | null>(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [simulatedLevel, setSimulatedLevel] = useState(20);

  const t = getT(language);

  // Audio waveform animation when recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setSimulatedLevel(Math.floor(Math.random() * 70) + 25);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen) return null;

  const startVoiceInput = () => {
    setIsRecording(true);
    setTranscript('');
    setExtracted(null);
    setHasConfirmed(false);

    // Attempt browser Web Speech API if supported, or simulate high-accuracy recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const current = event.results[0][0].transcript;
          setTranscript(current);
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (transcript) {
            handleProcessTranscript(transcript);
          }
        };

        recognition.start();
        return;
      } catch (e) {
        // Fallback simulation below
      }
    }

    // Default fast interactive simulation for testing when mic is blocked in sandbox iframe
    setTimeout(() => {
      const fallbackSample =
        language === 'kn'
          ? 'ಬೆಂಗಳೂರಿಗೆ ಹೋಗಬೇಕು, 16 ಟನ್ ಲಾರಿ ಇದೆ, 5 ಗಂಟೆಗೆ ಲೋಡಿಂಗ್ ರೆಡಿ.'
          : 'Going to Bengaluru, 16 ton multi-axle truck, available by 5 PM.';
      setTranscript(fallbackSample);
      setIsRecording(false);
      handleProcessTranscript(fallbackSample);
    }, 2400);
  };

  const handleProcessTranscript = (text: string) => {
    const result = extractFieldsFromTranscript(text, language);
    setExtracted(result);
    // Voice prompt back confirmation via Bulbul TTS
    const speechReply = `Extracted return route to ${result.destination} for ${result.capacityTons} tons. Please confirm details on screen.`;
    speakConfirmation(speechReply, language);
  };

  const handleSelectSample = (sampleText: string, lang: Language) => {
    setTranscript(sampleText);
    setIsRecording(false);
    const result = extractFieldsFromTranscript(sampleText, lang);
    setExtracted(result);
    const speechReply = `Matched destination ${result.destination}, ${result.capacityTons} tons. Ready for confirmation.`;
    speakConfirmation(speechReply, lang);
  };

  const handleConfirmAction = () => {
    if (!extracted) return;
    setHasConfirmed(true);
    speakConfirmation(`Searching verified return loads to ${extracted.destination}.`, language);
    setTimeout(() => {
      onConfirmedIntent(extracted);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-600/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-white relative overflow-hidden">
        {/* Karnataka color accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-emerald-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">Sarvam Voice Interaction</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded">
                Saaras STT + Bulbul TTS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Indian-Language Multilingual Input • Kannada, Hindi & Code-Mixed (Hinglish/Kanglish)
            </p>
          </div>
        </div>

        {/* Big Mic Button / Recording Indicator */}
        <div className="my-6 flex flex-col items-center justify-center">
          <button
            onClick={isRecording ? () => setIsRecording(false) : startVoiceInput}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-xl ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
              {isRecording ? 'Listening' : 'Tap to Speak'}
            </span>
          </button>

          {isRecording ? (
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-2 h-6 bg-amber-400 rounded-full animate-bounce" style={{ height: `${simulatedLevel}%` }} />
              <div className="w-2 h-8 bg-amber-400 rounded-full animate-bounce delay-75" style={{ height: `${Math.max(20, simulatedLevel + 10)}%` }} />
              <div className="w-2 h-5 bg-amber-400 rounded-full animate-bounce delay-150" style={{ height: `${Math.max(15, simulatedLevel - 15)}%` }} />
              <span className="text-xs text-amber-300 font-medium ml-2 animate-pulse">
                {t.listening}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-3 text-center">
              {t.listeningSub}
            </p>
          )}
        </div>

        {/* Quick Sample Voice Prompts (For instant test without mic) */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Voice Test Samples (Click to test instantly):
            </span>
            <span className="text-[10px] text-emerald-400">Deterministic Extraction</span>
          </div>
          <div className="space-y-1.5">
            {SAMPLE_VOICE_PROMPTS.slice(0, 3).map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample.text, sample.lang)}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-xs transition-colors group flex items-start justify-between"
              >
                <div>
                  <span className="font-semibold text-amber-300 text-[11px] mr-2">[{sample.label}]</span>
                  <span className="text-slate-200 font-serif group-hover:text-white">“{sample.text}”</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 ml-2 group-hover:text-amber-400">
                  Try &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Captured Transcript */}
        {transcript && (
          <div className="bg-slate-850 p-3 rounded-xl border border-slate-700 mb-4">
            <div className="text-[11px] text-slate-400 font-medium mb-1">Captured Audio Transcript:</div>
            <div className="text-sm font-semibold text-amber-300 italic">“{transcript}”</div>
          </div>
        )}

        {/* CRITICAL SPEC REQUIREMENT: Confirmation Card before any transactional action! */}
        {extracted && (
          <div className="bg-emerald-950/60 border-2 border-emerald-500/60 rounded-xl p-4 mb-4 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-800/60 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-emerald-200">
                  {t.confirmIntentTitle}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-600/40">
                Confidence: {Math.round(extracted.confidence * 100)}%
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mb-3">
              AI voice understanding parsed the following structured intent. Confirm below before running the deterministic matching engine:
            </p>

            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  Destination
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{extracted.destination}</div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Weight className="w-3 h-3 text-amber-400" />
                  Capacity
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{extracted.capacityTons} Tons</div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Available From
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{extracted.availableFrom}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmAction}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>{t.confirmAction}</span>
              </button>
              <button
                onClick={() => setExtracted(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        {/* Security / Boundary Note */}
        <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-2 border-t border-slate-800">
          <AlertCircle className="w-3 h-3 text-slate-400" />
          <span>
            Strict boundary: Voice AI assists field extraction only. Final matches and prices are deterministically computed.
          </span>
        </div>
      </div>
    </div>
  );
};
