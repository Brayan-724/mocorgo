import { CircleComposite } from '@composite/Circle';
import { RectangleComposite } from '@composite/Rectangle';
import { Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class CapsuleBody extends Body<
  [RectangleComposite, CircleComposite, CircleComposite]
> {
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
    this.composite = [
      new RectangleComposite(recV1, recV2, 2 * r),
      circle1,
      circle2,
    ];

    this._pos = this.composite[0].pos.clone;
    this.mass = m;
    this.inertia =
      (this.mass *
        ((2 * this.composite[0].width) ** 2 +
          (this.composite[0].length + 2 * this.composite[0].width) ** 2)) /
      12;
  }

  setPosition(pos: Vector2Like, a = this.angle) {
    this.pos.from(pos);
    this.angle = a;
    this.composite[0].pos = this.pos;
    this.composite[0].getVertices(this.angle + this.angVel);
    this.composite[1].pos = this.composite[0].pos.clone.add(
      this.composite[0].dir.clone.scale(-this.composite[0].length / 2)
    );
    this.composite[2].pos = this.composite[0].pos.clone.add(
      this.composite[0].dir.clone.scale(this.composite[0].length / 2)
    );
    this.angle += this.angVel;
  }

  reposition() {
    super.reposition();
    this.setPosition(this.pos.add(this.vel));
  }
}
