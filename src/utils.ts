function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function toMMSS(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${(mins < 10 ? "0" : "") + mins}:${(secs < 10 ? "0" : "") + secs}`;
}

export { getFlagEmoji, toMMSS };
