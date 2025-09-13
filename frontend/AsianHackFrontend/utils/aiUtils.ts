// utils/aiUtils.ts

/**
 * Sends audio and/or text to the backend and returns the AI's response.
 * @param audioBlob Optional recorded audio.
 * @param text Optional typed text.
 * @param apiUrl Backend API endpoint.
 * @param videoContext Video context information.
 * @param videoId Video ID.
 *
 */
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_API_URL = `${BASE_URL}/api/transcribe-and-reply-2/`;
export async function sendToBackend(
  audioBlob?: Blob,
  text?: string,
  apiUrl: string = DEFAULT_API_URL,
  videoContext?: any,
  videoId?: number
) {
  const formData = new FormData();

  if (audioBlob) {
    formData.append("audio", audioBlob, "recorded_audio.webm");
  }
  if (text) {
    formData.append("text", text);
  }

  if (videoContext) {
    formData.append("videoContext", videoContext);
  }
  
  if (videoId) {
    formData.append("videoId", videoId.toString());
  }

  // try {
  //   const response = await fetch(apiUrl, {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (!response.ok) {
  //     throw new Error(`Backend returned ${response.status}`);
  //   }

  //   return await response.json();
  // } catch (err) {
  //   console.error("Backend request failed:", err);
  //   throw err;
  // }
  try{
    const response = await axiosWithCsrf.post("/api/transcribe-and-reply-2/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // sends cookies for cross-origin requests
    });
    return response.data; 
  }
  catch (err) {
    console.error("Backend request failed:", err);
    throw err;
  }
}
/**
 * Speaks the given text aloud in Hindi (if available) or default language.
 * @param text Text to speak.
 */
export function speakText(text: string) {
  if (!window.speechSynthesis) {
    alert("Sorry, your browser does not support Speech Synthesis");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = voices.find(
    (voice) => voice.lang === "hi-GB" || voice.lang.startsWith("hi")
  );
  if (hindiVoice) utterance.voice = hindiVoice;
  utterance.lang = hindiVoice ? "hi-GB" : "en-US";

  window.speechSynthesis.speak(utterance);
}
