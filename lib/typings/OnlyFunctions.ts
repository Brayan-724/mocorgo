export type OnlyFunctions<P extends {}> = {
  [K in keyof P]: P[K] extends Function ? K : never;
};
