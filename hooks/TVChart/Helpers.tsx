import isCharLetter from "@/utils/isCharLetter";

// Makes requests to CryptoCompare API
export async function makeApiRequest(path: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}${path}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    return response.json();
  } catch (error: any) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}

// Generates a symbol ID from a pair of the coins
export function generateSymbol(
  exchange: string,
  fromSymbol: string,
  toSymbol: string
) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol: string) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  };
}

export function resolutionToSeconds(resolution: string) {
	const MINUTE = 60;
  const DAY = MINUTE * 60 * 24;
  const WEEK = DAY * 7;
  const MONTH = DAY * 30;

  let str = resolution.slice(-1)[0];
  let num;

  isCharLetter(str)
    ? (num = parseInt(resolution.slice(0, resolution.length - 1)))
    : (num = parseInt(resolution));

  switch(str) {
    case 'S':
      return num;
    case 'D':
      return num * DAY;
    case 'W':
      return num * WEEK;
    case 'M':
      return num * MONTH;
    default:
      return num * MINUTE;
  }
}
