export const ALL_FUNCTIONS = {
  "-": (...[a, b]: [number, number]) => a - b,
  "*": (...[a, b]: [number, number]) => a * b,
  "**": (...[a, b]: [number, number]) => a ** b,
  "/": (...[a, b]: [number, number]) => a / b,
  "%": (...[a, b]: [number, number]) => a % b,
  "+": (...[a, b]: [number, number]) => a + b,
  "<": (...[a, b]: [number, number]) => a < b,
  "=": (...[a, b]: [number, number]) => a === b,
  ">": (...[a, b]: [number, number]) => a > b,
  biasedRandomInt(...[min, max]: [number, number]) {
    const r = Math.random();
    const biased = r ** 2;
    const value = min + Math.floor(biased * (max - min + 1));
    return value;
  },
  concat: (...strings: string[]) => strings.join(""),
  factorial: (...[n]: [number]): number =>
    n <= 0 ? 1 : n * ALL_FUNCTIONS.factorial(n - 1),
  getIndex: (...[arr, i]: [number[], number]) => arr[i],
  randomInt: (...[min, max]: [number, number]) =>
    Math.floor(Math.random() * (max - min + 1)) + min,
  randomFromList: <T>(...[list]: [T[]]) => {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  },
} as const;
