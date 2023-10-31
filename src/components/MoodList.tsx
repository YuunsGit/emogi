import { getFlagEmoji, toMMSS } from "@/utils";
import { listAllEmogis, listEmogis, totalEmogiAmount } from "@/redis/commands";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Me from "../app/me.png";

function MoodList({
  cooldownSecs,
  currentMood,
}: {
  cooldownSecs: number;
  currentMood: string;
}) {
  const [hoverPercentages, setHoverPercentages] = useState(false);
  const [moods, setMoods] = useState<{ country: string; mood: string }[]>([]);
  const [totalEmogis, setTotalEmogis] = useState(0);
  const [percentages, setPercentages] = useState<{ [emogi: string]: number }>();

  useEffect(() => {
    (async function () {
      const emogis = await listEmogis();
      const parsedEmogis = emogis.map((emogi) => {
        return {
          mood: emogi.split(":")[0],
          country: emogi.split(":")[1],
        };
      });
      setMoods(parsedEmogis);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const amount = await totalEmogiAmount();
      setTotalEmogis(amount);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const allEmogis = await listAllEmogis();
      const emogiCounts: { [emogi: string]: number } = {};
      for (const emogi of allEmogis) {
        const emogiText = emogi.split(":")[0];
        if (!emogiCounts[emogiText]) emogiCounts[emogiText] = 1;
        else emogiCounts[emogiText]++;
      }
      const emogiPercentages: { [emogi: string]: number } = {};
      for (const [emogi, count] of Object.entries(emogiCounts)) {
        emogiPercentages[emogi] =
          Math.round(((count * 100) / allEmogis.length) * 10) / 10;
      }
      setPercentages(emogiPercentages);
    })();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex justify-between w-full h-[40vh] p-10 overflow-visible">
        {percentages && (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            transition={{ ease: "easeOut" }}
            onHoverStart={() => setHoverPercentages(true)}
            onHoverEnd={() => setHoverPercentages(false)}
            className="text-3xl flex flex-col gap-y-2 ml-0"
          >
            {Object.keys(percentages || {}).map((emogi, index) => {
              return (
                <motion.div
                  animate={{
                    opacity: index === 0 ? 1 : hoverPercentages ? 1 : 0,
                    x: index === 0 ? 0 : hoverPercentages ? 0 : -20,
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  transition={{
                    ease: "easeOut",
                    delay:
                      (!hoverPercentages
                        ? Object.keys(percentages || {}).length - index
                        : index) * 0.05,
                  }}
                  key={index}
                >
                  {emogi} %{percentages[emogi]}
                </motion.div>
              );
            })}
          </motion.div>
        )}
        {cooldownSecs && (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ ease: "easeOut" }}
            className="flex flex-col gap-y-2 items-center w-32 text-xl ml-auto"
          >
            <span className="text-5xl align-middle">{currentMood}</span>
            <span className="font-bold text-4xl align-middle">
              {toMMSS(cooldownSecs)}
            </span>
          </motion.div>
        )}
      </div>
      <div className="relative min-h-screen flex gap-y-8 flex-col mb-16 mx-auto">
        {moods.map((mood, index) => (
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: index / 10 }}
            key={index}
            className={`uppercase text-2xl bg-lightGray dark:bg-darkGray rounded-xl px-8 py-6 border border-transparent hover:border-coolOrange transition-all ${
              index === 0 && "scale-110"
            } ${index === 1 && "scale-105"}`}
          >
            Someone in{" "}
            <span className="text-5xl align-middle mx-2">
              {getFlagEmoji(mood.country)}
            </span>{" "}
            feels{" "}
            <span className="text-5xl align-middle mx-2">{mood.mood}</span>
          </motion.div>
        ))}
        {totalEmogis > 16 && (
          <div className="uppercase text-center text-2xl bg-lightGray dark:bg-darkGray bg-opacity-40 rounded-xl px-8 py-6 border-2 border-darkGray border-dashed hover:border-coolOrange transition-all">
            <span className="text-green-800">{totalEmogis - 16}</span> more
            people feel alive
          </div>
        )}
      </div>
      <footer className="flex justify-center p-10">
        <a
          href="https://www.yunusemre.dev"
          rel="noreferrer noopener"
          target="_blank"
          className="relative before:content-[''] before:w-full before:h-full before:translate-y-6 before:rounded-full before:bg-lightGray dark:before:bg-darkGray before:absolute before:-z-10 hover:before:translate-y-0 hover:before:scale-125 before:transition-all"
        >
          <Image
            src={Me}
            alt="Yunus Emre Kepenek"
            height={64}
            width={64}
            className="rounded-full"
          />
        </a>
      </footer>
    </div>
  );
}

export default MoodList;
