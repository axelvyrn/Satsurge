// Random utility functions

export function randInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randFloatInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randBool(probability: number = 0.5): boolean {
  return Math.random() < probability;
}