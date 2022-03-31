import { TriangleComposite } from '@composite/Triangle';
import { Vector2, Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class StarBody extends Body<[TriangleComposite, TriangleComposite]> {
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

    this.composite = [
      new TriangleComposite(triangle1Pos1, triangle1Pos2, triangle1Pos3),
      new TriangleComposite(triangle2Pos1, triangle2Pos2, triangle2Pos3),
    ];
    this._pos = this.composite[0].pos;

    this.mass = m;
    this.inertia = (this.mass * (2 * this.radius) ** 2) / 12;
  }

  setPosition(pos: Vector2Like, a = this.angle) {
    this.pos.from(pos);
    this.angle = a;
    this.composite[0].pos = this.pos;
    this.composite[1].pos = this.pos;
    this.composite[0].getVertices(this.angle + this.angVel);
    this.composite[1].getVertices(this.angle + this.angVel);
    this.angle += this.angVel;
  }

  reposition() {
    super.reposition();
    this.setPosition(this.pos.add(this.vel));
  }
}
