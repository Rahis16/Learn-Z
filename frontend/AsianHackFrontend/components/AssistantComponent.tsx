"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Assistant: React.FC<{ isActive: boolean; onFinish?: () => void }> = ({
  isActive,
  onFinish,
}) => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const preventRestartRef = useRef(false);

  const [isListening, setIsListening] = useState(false);
  const [assistantPos, setAssistantPos] = useState<
    "left-top" | "right-bottom" | "left-bottom" | "right-top" | "center"
  >("left-top");

  // Delay utility function
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // 🎤 Initialize speech recognition once
  const initializeRecognition = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = handleRecognition;

    recognition.onerror = (event: any) => {
      if (
        event.error === "not-allowed" ||
        event.error === "permission-denied"
      ) {
        alert("Microphone access denied.");
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current && !preventRestartRef.current) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
  };

  // 🗣️ Handle voice commands
  const handleRecognition = async (event: any) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("User said:", transcript);

    if (transcript.includes("stop")) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else if (
      transcript.includes("hello") ||
      transcript.includes("hi") ||
      transcript.includes("hey")
    ) {
      setIsListening(false);
      isListeningRef.current = false;
      await playAudioWithWait("/audios/L_intro1.mp3");
      isListeningRef.current = true;
      setIsListening(true);
    } else if (transcript.includes("hahaha") || transcript.includes("haha")) {
      setIsListening(false);
      isListeningRef.current = false;
      await playAudioWithWait("/audios/laugh.mp3");
      isListeningRef.current = true;
      setIsListening(true);
    } else if (
      transcript.includes("demo") ||
      transcript.includes("presentation") ||
      transcript.includes("present")
    ) {
      setIsListening(false);
      await playAudioWithWait("/audios/L_intro2.mp3");

      await runDemoFlow(); // ✅ call the custom demo function
    } else {
      recognitionRef.current?.start();
    }
  };

  // 🔊 Play audio and wait till it ends
  const playAudioWithWait = (src: string) => {
    return new Promise<void>((resolve) => {
      if (!audioRef.current) return resolve();

      recognitionRef.current?.abort(); // stop mic during audio
      preventRestartRef.current = true;
      setIsListening(false);
      isListeningRef.current = false;

      audioRef.current.src = src;
      audioRef.current.onended = () => {
        preventRestartRef.current = false;
        resolve();
      };
      audioRef.current.play();
    });
  };

  // 🚀 Custom Demo Flow — Fully manual, step-by-step
  const runDemoFlow = async () => {
    try {
      //   Step 1
      setAssistantPos("center");
      await playAudioWithWait("/audios/L11.mp3");

        // Step 2
      router.push("/dashboard");
      await delay(1000);
      setAssistantPos("right-bottom");
      await playAudioWithWait("/audios/L12.mp3");

      router.push("/profile");
      await delay(1000);
      //step 3
      setAssistantPos("right-top");
      await playAudioWithWait("/audios/L13.mp3");
      
      //step 4
      router.push("/find-buddy");
      await delay(1000);
      setAssistantPos("left-top");
      await playAudioWithWait("/audios/L14.mp3");
      

      //step 5
      router.push("/chatpage");
      await delay(1000);
      setAssistantPos("left-top");
      await playAudioWithWait("/audios/L15.mp3");

      //step 6
      setAssistantPos("right-top");
      router.push("/group");
      await delay(1000);
      await playAudioWithWait("/audios/L16.mp3");

      //   step 7
      setAssistantPos("center");
      router.push("/classroom");
      await playAudioWithWait("/audios/L17.mp3");

      // Step 3 (optional)
      // setAssistantPos("left-bottom");
      // router.push("/cart");
      // await playAudioWithWait("/audios/p3.mp3");

      onFinish && onFinish(); // Demo finished
      setIsListening(true);
      isListeningRef.current = true;
    } catch (error) {
      console.error("Demo flow error:", error);
    }
  };

  // 🔁 Recognition lifecycle
  useEffect(() => {
    if (!isActive) return;
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported");
      return;
    }

    if (!recognitionRef.current) {
      initializeRecognition();
    }

    if (isListening) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }

    return () => recognitionRef.current?.stop();
  }, [isActive, isListening]);

  // 🧠 Sync state with ref
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // 🔄 Reset on deactivate
  useEffect(() => {
    if (isActive) {
      setIsListening(true);
    } else {
      setIsListening(false);
      setAssistantPos("left-top");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const baseStyle: React.CSSProperties = {
    position: "fixed",
    transition: "all 0.5s ease-in-out", // 🌀 smooth animation
    zIndex: 9999,
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    "left-top": {
      ...baseStyle,
      left: "20px",
      top: "130px",
      transform: "translate(0, 0)",
    },
    "right-top": {
      ...baseStyle,
      right: "20px",
      top: "130px",
      transform: "translate(0, 0)",
    },
    "left-bottom": {
      ...baseStyle,
      left: "20px",
      bottom: "40px",
      transform: "translate(0, 0)",
    },
    "right-bottom": {
      ...baseStyle,
      right: "20px",
      bottom: "40px",
      transform: "translate(0, 0)",
    },
    center: {
      ...baseStyle,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)", // perfect center
    },
  };

  return (
    <>
      {assistantPos === "center" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 9998,
            transition: "all 0.3s ease-in-out",
          }}
        />
      )}
      {isActive && (
        <div style={{ ...positionStyles[assistantPos], zIndex: 9999 }}>
          <motion.img
            src="/icons/learnz-logo.png"
            alt="Assistant"
            style={{
              width: 160,
              height: 160,
              pointerEvents: "none",
            }}
            animate={{
              rotate: 360, // continuous rotation
              scale: [1, 1.1, 1], // subtle pulsing
              y: [0, -16, 0], // smooth bounce up and down
              filter: [
                "drop-shadow(0 0 5px #0f62fe)",
                "drop-shadow(0 0 15px #0f62fe)",
                "drop-shadow(0 0 5px #0f62fe)",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 10, // overall duration of rotation
              ease: "linear",
              times: [0, 0.5, 1], // for coordinated animation steps
            }}
          />
        </div>
      )}
      <audio ref={audioRef} />
    </>
  );
};

export default Assistant;
