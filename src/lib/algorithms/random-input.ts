const MIN_LENGTH = 2;
const MAX_LENGTH = 12;
const MIN_VALUE = 1;
const MAX_VALUE = 200;

export function generateRandomArray(): number[] {
  const size = 6 + Math.floor(Math.random() * 5); // 6-10 elements
  return Array.from({ length: size }, () => 1 + Math.floor(Math.random() * 99));
}

export type ParseArrayResult = { values: number[] } | { error: string };

/** Parses a comma/space-separated list of whole numbers, enforcing the
 * same bounds the visualization can actually render sensibly - too few
 * elements isn't interesting, too many stops being legible as bars, and
 * values outside a modest range make the bar heights unreadable. */
export function parseCustomArray(text: string): ParseArrayResult {
  const tokens = text
    .split(/[,\s]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return { error: "Enter at least two numbers, separated by commas." };
  }

  const values: number[] = [];
  for (const token of tokens) {
    const parsed = Number(token);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      return { error: `"${token}" isn't a whole number.` };
    }
    if (parsed < MIN_VALUE || parsed > MAX_VALUE) {
      return { error: `Numbers must be between ${MIN_VALUE} and ${MAX_VALUE}.` };
    }
    values.push(parsed);
  }

  if (values.length < MIN_LENGTH) {
    return { error: `Enter at least ${MIN_LENGTH} numbers.` };
  }
  if (values.length > MAX_LENGTH) {
    return { error: `Enter at most ${MAX_LENGTH} numbers.` };
  }

  return { values };
}
