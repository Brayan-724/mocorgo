import { Composite } from '@composite/Composite';
import { Vector2, Vector2Like } from '@utils/Vector2';

export class Body {
  static BODIES: Body[] = [];

  comp: Array<Composite>;
  pos: Vector2;
  m: number;
  inv_m: number;
  inertia: number;
  inv_inertia: number;
  elasticity: number;

  friction: number;
  angFriction: number;
  maxSpeed: number;
  layer: number;
  color: string;

  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  action: boolean;

  vel: Vector2;
  acc: Vector2;
  keyForce: number;
  angKeyForce: number;
  angle: number;
  angVel: number;
  player: boolean;

  constructor(pos: Vector2Like) {
    this.comp = [];
    this.pos = new Vector2(pos);
    this.m = 0;
    this.inv_m = 0;
    this.inertia = 0;
    this.inv_inertia = 0;
    this.elasticity = 1;

    this.friction = 0;
    this.angFriction = 0;
    this.maxSpeed = 0;
    this.layer = 0;
    this.color = '';

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.action = false;

    this.vel = Vector2.zero;
    this.acc = Vector2.zero;
    this.keyForce = 1;
    this.angKeyForce = 0.1;
    this.angle = 0;
    this.angVel = 0;
    this.player = false;
    Body.BODIES.push(this);
  }

  render() {
    if (this.color) {
      this.setColor(this.color);
    }
  }
  reposition() {
    this.acc = this.acc.unit().scale(this.keyForce);
    this.vel = this.vel.add(this.acc);
    this.vel = this.vel.scale(1 - this.friction);
    if (this.vel.mag > this.maxSpeed && this.maxSpeed !== 0) {
      this.vel = this.vel.unit().scale(this.maxSpeed);
    }
    this.angVel *= 1 - this.angFriction;
  }
  keyControl() {}
  setColor(color: string) {
    this.comp.forEach(comp => {
      comp.color = color;
    });
  }
  remove() {
    if (Body.BODIES.indexOf(this) !== -1) {
      Body.BODIES.splice(Body.BODIES.indexOf(this), 1);
    }
  }
}
