/**
 * Converts a number to its word representation in Nigerian Naira.
 * e.g. 1249666 → "One Million, Two Hundred and Forty-Nine Thousand, Six Hundred and Sixty-Six Naira Only."
 */

const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

function convertChunk(n: number): string {
  if (n === 0) return "";

  let result = "";

  if (n >= 100) {
    result += ones[Math.floor(n / 100)] + " Hundred";
    n %= 100;
    if (n > 0) result += " and ";
  }

  if (n >= 20) {
    result += tens[Math.floor(n / 10)];
    n %= 10;
    if (n > 0) result += "-" + ones[n];
  } else if (n > 0) {
    result += ones[n];
  }

  return result;
}

function numberToWordsRaw(num: number): string {
  if (num === 0) return "Zero";

  const chunks: number[] = [];
  let remaining = Math.floor(num);

  while (remaining > 0) {
    chunks.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const parts: string[] = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i] === 0) continue;
    const chunkWord = convertChunk(chunks[i]);
    const scale = scales[i] || "";
    parts.push(chunkWord + (scale ? " " + scale : ""));
  }

  return parts.join(", ");
}

export function amountToWords(amount: number): string {
  const naira = Math.floor(amount);
  const kobo = Math.round((amount - naira) * 100);

  let result = numberToWordsRaw(naira) + " Naira";

  if (kobo > 0) {
    result += " and " + numberToWordsRaw(kobo) + " Kobo";
  }

  result += " Only.";
  return result;
}
