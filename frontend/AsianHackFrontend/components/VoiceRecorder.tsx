"use client";

import React, { useState, useRef } from "react";

const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiReason, setAiReason] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recorded_audio.webm");

        // 🔹 Send to backend for transcription + AI + voice
        const response = await fetch(
          "http://localhost:8000/api/transcribe-and-reply/",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setUserText(data.user_text);
        setAiText(data.ai_text);
        setAiReason(data.ai_reasoning);

        // Play AI voice
        const audio = new Audio(`data:audio/mpeg;base64,${data.ai_audio}`);
        audio.play();
        // speakText(data.ai_text);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Mic access denied or error: ", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Sorry, your browser does not support Speech Synthesis");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Select a Hindi (India) voice if available
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(
      (voice) => voice.lang === "hi-IN" || voice.lang.startsWith("hi")
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    utterance.lang = "hi-IN"; // fallback lang setting
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={recording ? stopRecording : startRecording}
        style={{
          backgroundColor: recording ? "#ff4d4d" : "#4caf50",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {recording ? "🛑 Stop Recording" : "🎙️ Start Recording"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>🗣️ You said:</h3>
        <p>{userText || "No input yet..."}</p>

        {/* <h3>AI Reasoning:</h3>
        <p>{aiReason || "No reasoning yet..."}</p> */}

        <h3 className="mt-4">🤖 AI replied:</h3>
        <p>{aiText || "No reply yet..."}</p>
      </div>
    </div>
  );
};

export default VoiceRecorder;

// "use client";

// import React, { useState, useRef } from "react";

// const VoiceRecorder: React.FC = () => {
//   const [recording, setRecording] = useState<boolean>(false);
//   const [transcript, setTranscript] = useState<string>("");
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunks = useRef<Blob[]>([]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//       mediaRecorderRef.current = new MediaRecorder(stream);
//       audioChunks.current = [];

//       mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
//         audioChunks.current.push(event.data);
//       };

//       mediaRecorderRef.current.onstop = async () => {
//         const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
//         const formData = new FormData();
//         formData.append("audio", audioBlob, "recorded_audio.webm");

//         const response = await fetch("http://localhost:8000/api/transcribe/", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();
//         setTranscript(data.text);
//       };

//       mediaRecorderRef.current.start();
//       setRecording(true);
//     } catch (err) {
//       console.error("Mic access denied or error: ", err);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && recording) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <button
//         onClick={recording ? stopRecording : startRecording}
//         style={{
//           backgroundColor: recording ? "#ff4d4d" : "#4caf50",
//           color: "#fff",
//           padding: "10px 20px",
//           border: "none",
//           borderRadius: "8px",
//           cursor: "pointer",
//         }}
//       >
//         {recording ? "🛑 Stop Recording" : "🎙️ Start Recording"}
//       </button>

//       <div style={{ marginTop: "20px" }}>
//         <h3>📜 Transcribed Text:</h3>
//         <p>{transcript || "No transcript yet..."}</p>
//       </div>
//     </div>
//   );
// };

// export default VoiceRecorder;
