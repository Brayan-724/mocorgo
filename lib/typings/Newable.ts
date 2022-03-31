export interface Newable<C extends {}> {
  new (...args: any[]): C;
  prototype: C;
  name: string;
}
