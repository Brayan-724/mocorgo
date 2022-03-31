import { Vector2, Vector2Like } from '@utils/Vector2';
import { Body } from '@bodies/Body';

export abstract class Composite {
  pos: Vector2;
  color: string;
  vertex: Vector2[];
  body: Body | null = null;

  constructor(pos: Vector2Like) {
    this.pos = new Vector2(pos);
    this.color = '';
    this.vertex = [];
  }
}
