import { SupportedLanguage } from '../types';

// Map supported language codes to BCP 47 locale codes
const localeMap: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
};

/**
 * Reads aloud the given text using the browser's SpeechSynthesis API
 */
export function speakText(text: string, lang: SupportedLanguage = 'en', onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const targetLocale = localeMap[lang] || 'en-IN';
  utterance.lang = targetLocale;
  utterance.rate = 0.95; // Slightly slower for clear regional comprehension
  utterance.pitch = 1.0;

  // Attempt to select an Indian regional voice if available in the browser
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(targetLocale) || v.lang.includes('IN'));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Browser SpeechRecognition interface
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

/**
 * Initializes and starts a speech recognition session
 */
export function startListening(
  lang: SupportedLanguage = 'en',
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { stop: () => void } | null {
  const win = window as unknown as IWindow;
  const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = localeMap[lang] || 'en-IN';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      onError(event.error || 'Voice input error');
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (err: any) {
    onError(err?.message || 'Failed to start microphone');
    return null;
  }
}
