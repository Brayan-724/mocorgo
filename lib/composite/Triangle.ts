import { Vector2, Vector2Like } from '@utils/Vector2';
import { Matrix } from '@utils/Matrix';
import { Composite } from './Composite';

export class TriangleComposite extends Composite {
  color: string;
  vertex: Vector2[];
  dir: Vector2;
  refDir: Vector2;
  refDiam: Vector2[];
  pos: Vector2;
  angle: number;
  rotMat: Matrix;

  constructor(pos0: Vector2Like, pos1: Vector2Like, pos2: Vector2Like) {
    super(pos0);
    this.color = '';
    this.vertex = [];
    this.vertex[0] = new Vector2(pos0);
    this.vertex[1] = new Vector2(pos1);
    this.vertex[2] = new Vector2(pos2);
    this.pos = new Vector2(
      (this.vertex[0].x + this.vertex[1].x + this.vertex[2].x) / 3,
      (this.vertex[0].y + this.vertex[1].y + this.vertex[2].y) / 3
    );
    this.dir = this.vertex[0].clone.subtract(this.pos).unit();
    this.refDir = this.dir;
    this.refDiam = [];
    this.refDiam[0] = this.vertex[0].clone.subtract(this.pos);
    this.refDiam[1] = this.vertex[1].clone.subtract(this.pos);
    this.refDiam[2] = this.vertex[2].clone.subtract(this.pos);
    this.angle = 0;
    this.rotMat = new Matrix(2, 2);
  }

  getVertices(angle: number) {
    this.rotMat.rotMx22(angle);
    this.dir = this.rotMat.multiplyVec(this.refDir);
    this.vertex[0] = this.pos.clone.add(
      this.rotMat.multiplyVec(this.refDiam[0])
    );
    this.vertex[1] = this.pos.clone.add(
      this.rotMat.multiplyVec(this.refDiam[1])
    );
    this.vertex[2] = this.pos.clone.add(
      this.rotMat.multiplyVec(this.refDiam[2])
    );
  }
}
