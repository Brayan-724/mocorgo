export class Vector2 {
  static get zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static get one(): Vector2 {
    return new Vector2(1, 1);
  }

  private _x: number;
  private _y: number;
  private _mag: number;

  constructor();
  constructor(x: number, y?: number);
  constructor(vec: Vector2Like);
  constructor(vecOrX?: number | Vector2Like, y?: number) {
    this._x = 0;
    this._y = 0;
    this._mag = 0;

    if (typeof vecOrX !== 'undefined') {
      this.from(vecOrX, y);
    }
  }

  private _calcutateMag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get x(): number {
    return this._x;
  }

  set x(x: number) {
    this._x = x;
    this._mag = this._calcutateMag();
  }

  get y(): number {
    return this._y;
  }

  set y(y: number) {
    this._y = y;
    this._mag = this._calcutateMag();
  }

  get mag(): number {
    return this._mag;
  }

  get clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /****** OPERATORS *******/

  add(vec: Vector2): this {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  subtract(vec: Vector2): this {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  multiply(vec: Vector2): this {
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  }

  divide(vec: Vector2): this {
    if (vec.x !== 0 && this.x !== 0) this.x /= vec.x;
    if (vec.y !== 0 && this.y !== 0) this.y /= vec.y;
    return this;
  }

  scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  normal(): this {
    this.y = -this.y;

    this.unit();

    return this;
  }

  unit(): this {
    const mag = this.mag;

    if (mag !== 0) {
      this.scale(1 / mag);
    }

    return this;
  }

  distance(vec: Vector2): number {
    return Vector2.distance(this, vec);
  }

  dot(vec: Vector2): number {
    return Vector2.dot(this, vec);
  }

  cross(vec: Vector2): number {
    return Vector2.cross(this, vec);
  }

  from(vecOrX: Vector2Like | number, y?: number): this {
    if (typeof vecOrX === 'number') this.fromArray([vecOrX, y ?? 0]);
    else if (Vector2.isVector(vecOrX)) this.fromVector(vecOrX);
    else if (Array.isArray(vecOrX)) this.fromArray(vecOrX);

    return this;
  }

  fromVector(vec: Vector2): this {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }

  fromArray(arr: [number, number] | number[]): this {
    this.x = arr[0] ?? this.x;
    this.y = arr[1] ?? this.y;
    return this;
  }

  toArray(): [number, number] {
    return [this.x, this.y];
  }

  static distance(vec1: Vector2, vec2: Vector2): number {
    return vec1.clone.subtract(vec2).mag;
  }

  static dot(vec1: Vector2, vec2: Vector2): number {
    return vec1.x * vec2.x + vec1.y * vec2.y;
  }

  static cross(vec1: Vector2, vec2: Vector2): number {
    return vec1.x * vec2.y - vec1.y * vec2.x;
  }

  static isVector(vec: any): vec is Vector2 {
    return vec instanceof Vector2;
  }
}

export type Vector2Like = Vector2 | [number, number] | number[];
