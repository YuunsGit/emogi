"use client";

import { submitEmogi } from "@/redis/commands";
import { Dispatch, SetStateAction } from "react";

function PickMood({
  location,
  setInCooldown,
  setCooldownSecs,
  setCurrentMood,
}: {
  location: { ip: string; country: string } | null;
  setInCooldown: Dispatch<SetStateAction<boolean | null>>;
  setCooldownSecs: Dispatch<SetStateAction<number>>;
  setCurrentMood: Dispatch<SetStateAction<string | null>>;
}) {
  const handleMood = (mood: string) => {
    if (location)
      submitEmogi(location, mood).then(() => {
        setInCooldown(true);
        setCurrentMood(mood);
        setCooldownSecs(process.env.NEXT_PUBLIC_COOLDOWN_MINS * 60);
      });
  };

  return (
    <>
      <h1 className="text-7xl">Mood?</h1>
      <div className="text-6xl flex gap-x-2 mt-12">
        <button
          disabled={!location}
          className="rounded-xl border border-transparent p-4 bg-darkGray hover:border-coolOrange focus:ring-2 focus-visible:ring-2 ring-coolOrange transition-all disabled:animate-pulse"
          onClick={() => handleMood("😃")}
        >
          😃
        </button>
        <button
          disabled={!location}
          className="rounded-xl border border-transparent p-4 bg-darkGray hover:border-coolOrange focus:ring-2 focus-visible:ring-2 ring-coolOrange transition-all disabled:animate-pulse"
          onClick={() => handleMood("😳")}
        >
          😳
        </button>
        <button
          disabled={!location}
          className="rounded-xl border border-transparent p-4 bg-darkGray hover:border-coolOrange focus:ring-2 focus-visible:ring-2 ring-coolOrange transition-all disabled:animate-pulse"
          onClick={() => handleMood("😭")}
        >
          😭
        </button>
        <button
          disabled={!location}
          className="rounded-xl border border-transparent p-4 bg-darkGray hover:border-coolOrange focus:ring-2 focus-visible:ring-2 ring-coolOrange transition-all disabled:animate-pulse"
          onClick={() => handleMood("🤢")}
        >
          🤢
        </button>
        <button
          disabled={!location}
          className="rounded-xl border border-transparent p-4 bg-darkGray hover:border-coolOrange focus:ring-2 focus-visible:ring-2 ring-coolOrange transition-all disabled:animate-pulse"
          onClick={() => handleMood("😡")}
        >
          😡
        </button>
      </div>
    </>
  );
}

export default PickMood;
