"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion } from "motion/react";

export default function Intro({ onDone }: { onDone: () => void }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const videoTextRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // estado inicial — tudo invisível
    gsap.set([welcomeRef.current, toRef.current, videoTextRef.current], {
      opacity: 0,
      y: 40,
    });

    // fase 1: "welcome"
    tl.to(welcomeRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    });
    tl.to(
      welcomeRef.current,
      { opacity: 0, y: -40, duration: 0.5, ease: "power3.in" },
      "+=0.6",
    );

    // fase 2: "to"
    tl.to(toRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    });
    tl.to(
      toRef.current,
      { opacity: 0, y: -40, duration: 0.5, ease: "power3.in" },
      "+=0.6",
    );

    // fase 3: video text pjbank + counter
    tl.to(videoTextRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    });

    // counter começa junto com o video text
    tl.call(() => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 2,
        ease: "power1.inOut",
        onUpdate() {
          if (counterRef.current)
            counterRef.current.textContent = Math.floor(counter.val).toString();
        },
        onComplete() {
          // saída: fade out tudo + curtain wipe
          const exit = gsap.timeline({ onComplete: onDone });
          exit.to(videoTextRef.current, { opacity: 0, duration: 0.5 });
          exit.to(counterRef.current, { opacity: 0, duration: 0.3 }, "<");
          exit.to(
            curtainRef.current,
            {
              scaleY: 0,
              transformOrigin: "bottom",
              duration: 1,
              ease: "power4.inOut",
            },
            "<0.2",
          );
        },
      });
    });
  }, []);

  return (
    <div
      ref={curtainRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
    >
      {/* fase 1 */}
      <div
        ref={welcomeRef}
        className="absolute uppercase  text-white text-7xl font-bold tracking-tight"
      >
        welcome
      </div>

      {/* fase 2 */}
      <div
        ref={toRef}
        className="absolute uppercase text-white text-7xl font-bold tracking-tight"
      >
        to
      </div>

      {/* fase 3 */}

      <div
        ref={videoTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{fontSize: 163}}
          className="mt-8 bg-linear-to-bl font-chillax from-orange-300 to-yellow-500 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          PJ<span className="text-white">BANK</span>
        </motion.h1>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 3.7,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="inset-auto z-50 h-0.5 w-[30rem] ml-1/2 bg-yellow-400 "
        ></motion.div>
      </div>

      {/* counter */}
      <span
        ref={counterRef}
        className="absolute bottom-6 right-8 text-6xl font-medium text-white/20 tabular-nums"
      >
        0
      </span>
    </div>
  );
}

import React from "react";
import { LampContainer } from "./ui/lamp";

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("intro-seen")) {
      setShowIntro(true);
    }
  }, []);

  return (
    <>
      <Intro
        onDone={() => {
          sessionStorage.setItem("intro-seen", "1");
          setShowIntro(false);
        }}
      />

      {children}
    </>
  );
}
