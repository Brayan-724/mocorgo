import { Vector2, Vector2Like } from "@utils/Vector2";
import { Composite } from "./Composite";

export class CircleComposite extends Composite {
  color: string;
  vertex: Vector2[];
  pos: Vector2;
  radius: number;

  constructor(pos: Vector2Like, r: number) {
    super(pos);
    this.color = '';
    this.vertex = [];
    this.pos = new Vector2(pos);
    this.radius = r;
  }
}