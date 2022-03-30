import { Vector2 } from "./Vector2";

export class Matrix {
  data: number[][];

  constructor(public readonly rows: number, public readonly cols: number) {
    this.data = [];

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }

  multiplyVec(vec: Vector2): Vector2 {
    let result = new Vector2(0, 0);
    result.x = this.data[0][0] * vec.x + this.data[0][1] * vec.y;
    result.y = this.data[1][0] * vec.x + this.data[1][1] * vec.y;
    return result;
  }

  rotMx22(angle: number): this {
    this.data[0][0] = Math.cos(angle);
    this.data[0][1] = -Math.sin(angle);
    this.data[1][0] = Math.sin(angle);
    this.data[1][1] = Math.cos(angle);

    return this;
  }
}