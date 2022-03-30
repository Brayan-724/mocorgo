import { Vector2, Vector2Like } from "@utils/Vector2";
import { Composite } from "./Composite";

export class LineComposite extends Composite {
  color: string;
  dir: Vector2;
  mag: number;
  pos: Vector2;

  constructor(pos0: Vector2Like, pos1: Vector2Like) {
    super(pos0);
    this.color = '';
    this.vertex = [];
    this.vertex[0] = new Vector2(pos0);
    this.vertex[1] = new Vector2(pos1);
    this.dir = this.vertex[1].clone.subtract(this.vertex[0]).unit();
    this.mag = this.vertex[1].distance(this.vertex[0]);
    this.pos = new Vector2(
      (this.vertex[0].x + this.vertex[1].x) / 2,
      (this.vertex[0].y + this.vertex[1].y) / 2
    );
  }
}