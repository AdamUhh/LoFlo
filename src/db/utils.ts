// ? source: https://www.answeroverflow.com/m/1187104019945099286#solution-1187114081631621130
export function isTuple<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0;
}
