import { Newable } from '~/typings/Newable';
import { OnlyFunctions } from '~/typings/OnlyFunctions';

export class Utils {
  static executeFromPrototype<
    C,
    K extends keyof OnlyFunctions<C>,
    F extends (...args: any[]) => any = (...args: any[]) => any
  >(parent: Newable<C>, child: C, key: K, args: Parameters<F>): void {
    const parentValue = parent.prototype[key] as unknown as Function;

    if (typeof parentValue !== 'function') return;

    parentValue.call(child, ...args);

    const childValue = child[key] as unknown as Function;

    if (typeof childValue !== 'function') return;

    if (parentValue !== childValue) {
      childValue.call(child, ...args);
    }
  }
}
