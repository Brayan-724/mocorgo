import { RectangleComposite } from '@composite/Rectangle';
import { Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class BoxBody extends Body<[RectangleComposite]> {
  constructor(pos0: Vector2Like, pos1: Vector2Like, w: number, m: number) {
    super(pos0);
    this.composite = [new RectangleComposite(pos0, pos1, w)];
    this._pos = this.composite[0].pos;
    this.mass = m;
    this.inertia =
      (this.mass *
        (this.composite[0].width ** 2 + this.composite[0].length ** 2)) /
      12;
  }

  setPosition(pos: Vector2Like, a = this.angle) {
    this.pos.from(pos);
    this.angle = a;
    this.composite[0].pos = this.pos;
    this.composite[0].getVertices(this.angle + this.angVel);
    this.angle += this.angVel;
  }

  reposition() {
    super.reposition();
    this.setPosition(this.pos.add(this.vel));
  }
}
