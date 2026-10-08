import { Language } from '../types';

export interface ExtractedVoiceIntent {
  rawTranscript: string;
  detectedLanguage: Language;
  confidence: number;
  destination?: string;
  capacityTons?: number;
  availableFrom?: string;
  commodity?: string;
  action?: 'FIND_LOADS' | 'ACCEPT_LOAD' | 'POST_TRUCK' | 'STATUS_CHECK';
}

export const SAMPLE_VOICE_PROMPTS = [
  {
    lang: 'kn' as Language,
    label: 'Kannada (ಕನ್ನಡ)',
    text: 'ಬೆಂಗಳೂರಿಗೆ ಹೋಗಬೇಕು, 16 ಟನ್ ಲಾರಿ ಇದೆ, ಸಂಜೆ 5 ಗಂಟೆಗೆ ಲೋಡಿಂಗ್ ರೆಡಿ.',
    explanation: 'Route: Bengaluru | 16 Tons | Ready by 5:00 PM',
  },
  {
    lang: 'en' as Language,
    label: 'English',
    text: 'Going to Bengaluru, 16 ton multi-axle truck, available by 5 PM.',
    explanation: 'Route: Bengaluru | 16 Tons | Available 17:00',
  },
  {
    lang: 'kn' as Language,
    label: 'Kanglish',
    text: 'Belagavi load beku, 10 ton capacity, unloading mugithu.',
    explanation: 'Route: Belagavi | 10 Tons | Unloading complete',
  },
];

// Deterministic field extractor
export function extractFieldsFromTranscript(transcript: string, lang: Language = 'en'): ExtractedVoiceIntent {
  const lower = transcript.toLowerCase();
  let destination = '';
  let capacityTons = 16;
  let availableFrom = '17:00';
  let commodity = '';
  let action: ExtractedVoiceIntent['action'] = 'FIND_LOADS';

  // Destination matching
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('ಬೆಂಗಳೂರು')) {
    destination = 'Bengaluru';
  } else if (lower.includes('belagavi') || lower.includes('belgaum') || lower.includes('ಬೆಳಗಾವಿ')) {
    destination = 'Belagavi';
  } else if (lower.includes('hyderabad') || lower.includes('ಹೈದರಾಬಾದ್')) {
    destination = 'Hyderabad';
  } else if (lower.includes('pune') || lower.includes('ಪುಣೆ')) {
    destination = 'Pune';
  } else if (lower.includes('goa') || lower.includes('ಗೋವಾ')) {
    destination = 'Goa';
  } else if (lower.includes('mangaluru') || lower.includes('mangalore') || lower.includes('ಮಂಗಳೂರು')) {
    destination = 'Mangaluru';
  } else if (lower.includes('dharwad') || lower.includes('ಧಾರವಾಡ')) {
    destination = 'Dharwad';
  } else if (lower.includes('davanagere') || lower.includes('ದಾವಣಗೆರೆ')) {
    destination = 'Davanagere';
  } else {
    destination = 'Bengaluru'; // default major return corridor
  }

  // Capacity matching
  const tonMatch = lower.match(/(\d+)\s*(ton|tons|ಟನ್)/);
  if (tonMatch && tonMatch[1]) {
    capacityTons = parseInt(tonMatch[1], 10);
  } else if (lower.includes('16')) {
    capacityTons = 16;
  } else if (lower.includes('10')) {
    capacityTons = 10;
  } else if (lower.includes('24')) {
    capacityTons = 24;
  }

  // Time matching
  if (lower.includes('5 pm') || lower.includes('5 ಗಂಟೆ') || lower.includes('17:00')) {
    availableFrom = '17:00';
  } else if (lower.includes('4 pm') || lower.includes('4 ಗಂಟೆ') || lower.includes('16:00')) {
    availableFrom = '16:00';
  } else if (lower.includes('6 pm') || lower.includes('6 ಗಂಟೆ') || lower.includes('18:00')) {
    availableFrom = '18:00';
  }

  // Commodity matching
  if (lower.includes('onion') || lower.includes('ಈರುಳ್ಳಿ')) {
    commodity = 'Onion';
  } else if (lower.includes('chilli') || lower.includes('ಮೆಣಸಿನಕಾಯಿ')) {
    commodity = 'Dry Chilli';
  } else if (lower.includes('cotton') || lower.includes('ಹತ್ತಿ')) {
    commodity = 'Cotton';
  } else if (lower.includes('groundnut') || lower.includes('ಕಡಲೆಕಾಯಿ')) {
    commodity = 'Groundnut';
  }

  return {
    rawTranscript: transcript,
    detectedLanguage: lang,
    confidence: 0.98,
    destination,
    capacityTons,
    availableFrom,
    commodity,
    action,
  };
}

// Speak confirmation aloud
export function speakConfirmation(text: string, lang: Language = 'en') {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'kn') utterance.lang = 'kn-IN';
      else utterance.lang = 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Browser speech synthesis fallback
    }
  }
}
