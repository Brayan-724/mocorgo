import { Matrix } from '@utils/Matrix';
import { Vector2, Vector2Like } from '@utils/Vector2';
import { Composite } from './Composite';

export class RectangleComposite extends Composite {
  color: string;
  vertex: Vector2[];
  dir: Vector2;
  refDir: Vector2;
  length: number;
  width: number;
  pos: Vector2;
  angle: number;
  rotMat: Matrix;

  constructor(pos0: Vector2Like, pos1: Vector2Like, width: number) {
    super(pos0);
    this.color = '';
    this.vertex = [];
    this.vertex[0] = new Vector2(pos0);
    this.vertex[1] = new Vector2(pos1);
    this.dir = this.vertex[1].clone.subtract(this.vertex[0]).unit();
    this.refDir = this.vertex[1].clone.subtract(this.vertex[0]).unit();
    this.length = this.vertex[1].clone.subtract(this.vertex[0]).mag;
    this.width = width;
    this.vertex[2] = this.vertex[1].clone.add(
      this.dir.clone.normal().scale(this.width)
    );
    this.vertex[3] = this.vertex[2].clone.add(
      this.dir.clone.scale(-this.length)
    );
    this.pos = this.vertex[0].clone
      .add(this.dir.clone.scale(this.length / 2))
      .add(this.dir.clone.normal().scale(this.width / 2));
    this.angle = 0;
    this.rotMat = new Matrix(2, 2);
  }

  getVertices(angle: number) {
    this.rotMat.rotMx22(angle);
    this.dir = this.rotMat.multiplyVec(this.refDir);
    const dirNormal = this.dir.clone.normal();

    this.vertex[0] = this.pos.clone
      .add(this.dir.clone.scale(-this.length / 2))
      .add(dirNormal.clone.scale(this.width / 2));

    this.vertex[1] = this.pos.clone
      .add(this.dir.clone.scale(-this.length / 2))
      .add(dirNormal.clone.scale(-this.width / 2));

    this.vertex[2] = this.pos.clone
      .add(this.dir.clone.scale(this.length / 2))
      .add(dirNormal.clone.scale(-this.width / 2));

    this.vertex[3] = this.pos.clone
      .add(this.dir.clone.scale(this.length / 2))
      .add(dirNormal.clone.scale(this.width / 2));
  }
}
