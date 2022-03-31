import { CircleComposite } from '@composite/Circle';
import { Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class BallBody extends Body<[CircleComposite]> {
  constructor(pos: Vector2Like, r: number, m: number) {
    super(pos);
    this._composite = [new CircleComposite(pos, r)];
    this.mass = m;
  }

  setPosition(pos: Vector2Like, _a = this.angle) {
    this._pos.from(pos);
    this._composite[0].pos = this.pos;
  }

  reposition() {
    super.reposition();
    this.setPosition(this.pos.clone.add(this.vel));
  }
}
