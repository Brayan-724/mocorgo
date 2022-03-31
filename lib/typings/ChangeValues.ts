export type ChangeValues<O, K extends keyof O, V> = {
  [P in keyof O]: P extends K ? V : O[P];
};
