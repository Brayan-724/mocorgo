import { CircleComposite } from '@composite/Circle';
import { Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class BallBody extends Body {
  constructor(pos: Vector2Like, r: number, m: number) {
    super(pos);
    this.comp = [new CircleComposite(pos, r)];
    this.m = m;
    if (this.m === 0) {
      this.inv_m = 0;
    } else {
      this.inv_m = 1 / this.m;
    }
  }

  setPosition(pos: Vector2Like, a = this.angle) {
    this.pos.from(pos);
    this.comp[0].pos = this.pos;
  }

  reposition() {
    super.reposition();
    this.setPosition(this.pos.clone.add(this.vel));
  }

  keyControl() {
    this.acc.x = 0;
    this.acc.y = 0;
    if (this.left) {
      this.acc.x -= this.keyForce;
    }
    if (this.up) {
      this.acc.y -= this.keyForce;
    }
    if (this.right) {
      this.acc.x += this.keyForce;
    }
    if (this.down) {
      this.acc.y += this.keyForce;
    }
  }
}
