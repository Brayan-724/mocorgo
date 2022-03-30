import { Vector2, Vector2Like } from '@utils/Vector2';

export abstract class Composite {
  pos: Vector2;
  color: string;
  vertex: Vector2[];

  constructor(pos: Vector2Like) {
    this.pos = new Vector2(pos);
    this.color = '';
    this.vertex = [];
  }
}
