"use client";

import { useState, useEffect } from "react";
import type React from "react";

interface TextPart {
  content: string;
  class?: string;
}

export function useTypingEffect() {
  const [displayedText, setDisplayedText] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const text: (string | TextPart)[] = [
      "...ŠIEK TIEK ",
      { content: "SVEIKIAU", class: "text-[#60988E] italic" },
    ];

    let index = 0;
    let partIndex = 0;
    let elements: React.ReactNode[] = [];
    let timeoutId: number | undefined;

    const typeEffect = () => {
      if (partIndex < text.length) {
        const currentPart = text[partIndex];

        if (typeof currentPart === "object") {
          if (index < currentPart.content.length) {
            elements = [
              ...elements,
              <span key={`${partIndex}-${index}`} className={currentPart.class}>
                {currentPart.content[index]}
              </span>,
            ];
            setDisplayedText([...elements]);
            index++;
            timeoutId = window.setTimeout(typeEffect, 50);
          } else {
            partIndex++;
            index = 0;
            timeoutId = window.setTimeout(typeEffect, 300);
          }
        } else {
          if (index < currentPart.length) {
            elements = [
              ...elements,
              <span key={`${partIndex}-${index}`}>{currentPart[index]}</span>,
            ];
            setDisplayedText([...elements]);
            index++;
            timeoutId = window.setTimeout(typeEffect, 50);
          } else {
            partIndex++;
            index = 0;
            timeoutId = window.setTimeout(typeEffect, 300);
          }
        }
      }
    };

    typeEffect();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return displayedText;
}
