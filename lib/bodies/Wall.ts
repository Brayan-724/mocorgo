import { LineComposite } from '@composite/Line';
import { Vector2, Vector2Like } from '@utils/Vector2';
import { Body } from './Body';

export class WallBody extends Body<[LineComposite]> {

  start: Vector2;
  end: Vector2;
  dir: Vector2;

  constructor(pos0: Vector2Like, pos1: Vector2Like) {
    super(pos0);
    this.start = new Vector2(pos0);
    this.end = new Vector2(pos1);
    this.composite = [new LineComposite(pos0, pos1)];
    this.dir = this.end.clone.subtract(this.start).unit();
    this._pos = new Vector2(
      (this.start.x + this.end.x) / 2,
      (this.start.y + this.end.y) / 2
    );
  }
}
