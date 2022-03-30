import { TriangleComposite } from '@composite/Triangle';
import { Vector2, Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class StarBody extends Body {
  comp: [TriangleComposite, TriangleComposite];
  radius: number;

  constructor(pos: Vector2Like, r: number, m: number) {
    super(pos);
    this.radius = r;
    const center = new Vector2(pos);
    const upDir = new Vector2(0, -1);

    const upDirScaled = upDir.clone.scale(r / 2);
    const upDirScaledNeg = upDir.clone.scale(-r / 2);
    const upDirNormal = upDir.clone.normal();
    const sqrt3 = Math.sqrt(3);
    const upDirNormalScaled = upDirNormal.clone.scale((r * sqrt3) / 2);
    const upDirNormalScaledNeg = upDirNormal.clone.scale((-r * sqrt3) / 2);

    const triangle1Pos1 = center.add(upDir.clone.scale(r));
    const triangle1Pos2 = center.add(upDirScaledNeg).add(upDirNormalScaledNeg);
    const triangle1Pos3 = center.add(upDirScaledNeg).add(upDirNormalScaled);

    const triangle2Pos1 = center.add(upDir.clone.scale(-r));
    const triangle2Pos2 = center.add(upDirScaled).add(upDirNormalScaledNeg);
    const triangle2Pos3 = center.add(upDirScaled).add(upDirNormalScaled);

    this.comp = [
      new TriangleComposite(triangle1Pos1, triangle1Pos2, triangle1Pos3),
      new TriangleComposite(triangle2Pos1, triangle2Pos2, triangle2Pos3),
    ];
    this.pos = this.comp[0].pos;

    this.m = m;
    if (this.m === 0) {
      this.inv_m = 0;
    } else {
      this.inv_m = 1 / this.m;
    }
    this.inertia = (this.m * (2 * this.radius) ** 2) / 12;
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
    this.comp[1].pos = this.pos;
    this.comp[0].getVertices(this.angle + this.angVel);
    this.comp[1].getVertices(this.angle + this.angVel);
    this.angle += this.angVel;
  }

  reposition() {
    super.reposition();
    this.setPosition(this.pos.add(this.vel));
  }
}
