import { RectangleComposite } from '@composite/Rectangle';
import { Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class BoxBody extends Body {
  comp: [RectangleComposite];
  constructor(pos0: Vector2Like, pos1: Vector2Like, w: number, m: number) {
    super(pos0);
    this.comp = [new RectangleComposite(pos0, pos1, w)];
    this.pos = this.comp[0].pos;
    this.m = m;
    if (this.m === 0) {
      this.inv_m = 0;
    } else {
      this.inv_m = 1 / this.m;
    }
    this.inertia =
      (this.m * (this.comp[0].width ** 2 + this.comp[0].length ** 2)) / 12;
    if (this.m === 0) {
      this.inv_inertia = 0;
    } else {
      this.inv_inertia = 1 / this.inertia;
    }
  }

  keyControl() {
    if (this.up) {
      this.acc = this.comp[0].dir.scale(-this.keyForce);
    }
    if (this.down) {
      this.acc = this.comp[0].dir.scale(this.keyForce);
    }
    if (this.left) {
      this.angVel = -this.angKeyForce;
    }
    if (this.right) {
      this.angVel = this.angKeyForce;
    }
    if (!this.up && !this.down) {
      this.acc.from(0, 0);
    }
  }

  setPosition(pos: Vector2Like, a = this.angle) {
    this.pos.from(pos);
    this.angle = a;
    this.comp[0].pos = this.pos;
    this.comp[0].getVertices(this.angle + this.angVel);
    this.angle += this.angVel;
  }

  reposition() {
    super.reposition();
    this.setPosition(this.pos.add(this.vel));
  }
}
