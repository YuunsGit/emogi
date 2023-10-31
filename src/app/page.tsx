"use client";

import PickMood from "@/components/PickMood";
import { useEffect, useState } from "react";
import { getCurrentMood, getRemainingCooldown } from "@/redis/commands";
import { Spinner } from "@/components/Spinner";
import MoodList from "@/components/MoodList";

export default function Home() {
  const [cooldownSecs, setCooldownSecs] = useState(0);
  const [inCooldown, setInCooldown] = useState<boolean | null>(null);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    ip: string;
    country: string;
  } | null>(null);

  useEffect(() => {
    (async function () {
      const res = await fetch("https://freeipapi.com/api/json");
      const loc = await res.json();
      setLocation({
        country: loc.countryCode,
        ip: loc.ipAddress,
      });
    })();
  }, []);

  useEffect(() => {
    if (location)
      (async function () {
        const mood = await getCurrentMood(location.ip);
        setCurrentMood(mood);
        setInCooldown(mood !== null);
      })();
  }, [location]);

  useEffect(() => {
    if (location && inCooldown)
      (async function () {
        const remaining = await getRemainingCooldown(location.ip);
        setCooldownSecs(remaining);
        const timer = setInterval(
          () =>
            setCooldownSecs((prev) => {
              if (prev === 1) {
                clearInterval(timer);
                setInCooldown(false);
              }
              return prev - 1;
            }),
          1000,
        );
      })();
  }, [inCooldown]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {inCooldown == null ? (
        <Spinner />
      ) : inCooldown && currentMood ? (
        <MoodList cooldownSecs={cooldownSecs} currentMood={currentMood} />
      ) : (
        <PickMood
          location={location}
          setInCooldown={setInCooldown}
          setCooldownSecs={setCooldownSecs}
          setCurrentMood={setCurrentMood}
        />
      )}
    </main>
  );
}
