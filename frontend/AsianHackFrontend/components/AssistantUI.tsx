"use client";

import React, { useState } from "react";
import TriggerButton from "./AssistantTriger";
import Assistant from "./AssistantComponent";

export default function AssistantWrapper({ children }: { children: React.ReactNode }) {
  const [assistantActive, setAssistantActive] = useState(false);

  const toggleAssistant = () => {
    let audio = new Audio("/audios/L1.mp3");
    audio.play();
    setAssistantActive((prev) => !prev);
  };
  

  return (
    <>
      {children}

      <TriggerButton onTrigger={toggleAssistant} isActive={assistantActive} />
      <Assistant isActive={assistantActive} onFinish={() => setAssistantActive(false)} />
    </>
  );
}
