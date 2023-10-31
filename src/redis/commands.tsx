"use server";

import Redis from "ioredis";
const redis = new Redis(process.env.KV_URL);

export async function submitEmogi(
  location: { ip: string; country: string },
  mood: string,
) {
  redis.lpush("emogis", `${mood}:${location.country}`);
  redis.set(
    `cooldown:${location.ip}`,
    mood,
    "EX",
    process.env.NEXT_PUBLIC_COOLDOWN_MINS * 60,
  );
}

export async function listEmogis() {
  return redis.lrange("emogis", 0, 15);
}

export async function listAllEmogis() {
  return redis.lrange("emogis", 0, -1);
}

export async function totalEmogiAmount() {
  return redis.llen("emogis");
}

export async function getCurrentMood(ip: string) {
  return redis.get(`cooldown:${ip}`);
}

export async function getRemainingCooldown(ip: string) {
  const cooldown = await redis.ttl(`cooldown:${ip}`);
  return cooldown || 0;
}

export async function subscribe() {
  redis.subscribe("new_emogis");
}
