import { getFlagEmoji, toMMSS } from "@/utils";
import { listAllEmogis, listEmogis, totalEmogiAmount } from "@/redis/commands";
import { useEffect, useState } from "react";

function MoodList({
  cooldownSecs,
  currentMood,
}: {
  cooldownSecs: number;
  currentMood: string;
}) {
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
    <div className="flex min-h-screen w-full items-end flex-col">
      <div className="flex justify-between w-full h-[40vh] p-10 overflow-visible">
        <div className="text-3xl flex flex-col gap-y-2 h-8 hover:h-full overflow-hidden transition-all">
          {percentages &&
            Object.keys(percentages || {}).map((emogi, index) => {
              return (
                <div key={index}>
                  {emogi} %{percentages[emogi]}
                </div>
              );
            })}
        </div>
        <div className="flex flex-col items-center w-32 text-xl">
          <span className="font-bold text-coolOrange text-5xl align-middle">
            {currentMood}
          </span>
          FOR
          <span className="font-bold text-coolOrange text-4xl align-middle">
            {toMMSS(cooldownSecs)}
          </span>
        </div>
      </div>
      <div className="relative flex gap-y-8 flex-col mb-16 mx-auto">
        {moods.map((mood, index) => (
          <div
            key={index}
            className={`uppercase text-3xl bg-darkGray rounded-xl px-8 py-6 border border-transparent hover:border-coolOrange transition-all ${
              index === 0 && "scale-110"
            } ${index === 1 && "scale-105"}`}
          >
            Someone in{" "}
            <span className="text-5xl align-middle mx-2">
              {getFlagEmoji(mood.country)}
            </span>{" "}
            feels{" "}
            <span className="text-5xl align-middle mx-2">{mood.mood}</span>
          </div>
        ))}
        {totalEmogis > 16 && (
          <div className="uppercase text-center text-2xl bg-darkGray bg-opacity-40 rounded-xl px-8 py-6 border-2 border-darkGray border-dashed hover:border-coolOrange transition-all">
            <span className="text-green-800">{totalEmogis - 16}</span> more
            people feel alive
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodList;
