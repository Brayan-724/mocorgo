import { CircleComposite } from '@composite/Circle';
import { RectangleComposite } from '@composite/Rectangle';
import { Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class CapsuleBody extends Body {
  comp: [RectangleComposite, CircleComposite, CircleComposite];

  constructor(pos0: Vector2Like, pos1: Vector2Like, r: number, m: number) {
    super(pos0);

    const circle1 = new CircleComposite(pos0, r);
    const circle2 = new CircleComposite(pos1, r);

    const normalScaled = circle2.pos.clone
      .subtract(circle1.pos)
      .unit()
      .normal()
      .scale(r);
    let recV1 = circle2.pos.clone.add(normalScaled);
    let recV2 = circle1.pos.clone.add(normalScaled);
    this.comp = [new RectangleComposite(recV1, recV2, 2 * r), circle1, circle2];

    this.pos = this.comp[0].pos.clone;
    this.m = m;
    if (this.m === 0) {
      this.inv_m = 0;
    } else {
      this.inv_m = 1 / this.m;
    }
    this.inertia =
      (this.m *
        ((2 * this.comp[0].width) ** 2 +
          (this.comp[0].length + 2 * this.comp[0].width) ** 2)) /
      12;
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
    this.comp[1].pos = this.comp[0].pos.clone.add(
      this.comp[0].dir.clone.scale(-this.comp[0].length / 2)
    );
    this.comp[2].pos = this.comp[0].pos.clone.add(
      this.comp[0].dir.clone.scale(this.comp[0].length / 2)
    );
    this.angle += this.angVel;
  }

  reposition() {
    super.reposition();
    this.setPosition(this.pos.add(this.vel));
  }
}
