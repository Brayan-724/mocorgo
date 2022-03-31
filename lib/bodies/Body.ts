import { Composite } from '@composite/Composite';
import { Vector2, Vector2Like } from '@utils/Vector2';
import { type World } from '~/World';

export class Body<C extends Array<Composite> = Array<Composite>> {
  static maxId = 0;
  id: number = -1;
  world: World | null = null;

  protected _composite!: C;
  protected _pos: Vector2;
  private _mass: number = 0;
  private _inv_mass: number = 0;
  private _inertia: number = 0;
  private _inv_inertia: number = 0;
  elasticity: number = 1;

  friction: number = 0;
  angFriction: number = 0;
  maxSpeed: number = 0;
  layer: number = 0;

  vel: Vector2;
  acc: Vector2;
  angKeyForce: number = 0.1;
  angle: number = 0;
  angVel: number = 0;
  player: boolean;

  constructor(pos: Vector2Like) {
    this.id = Body.maxId++;
    this._pos = new Vector2(pos);
    this.mass = 0;

    this.friction = 0;
    this.angFriction = 0;
    this.maxSpeed = 0;
    this.layer = 0;

    this.vel = Vector2.zero;
    this.acc = Vector2.zero;
    this.player = false;
  }

  reposition() {
    this.acc = this.acc.unit().scale(1);
    this.vel = this.vel.add(this.acc);
    this.vel = this.vel.scale(1 - this.friction);
    if (this.maxSpeed !== 0 && this.vel.mag > this.maxSpeed) {
      this.vel = this.vel.unit().scale(this.maxSpeed);
    }
    this.angVel *= 1 - this.angFriction;
  }

  keyControl() {}

  setColor(color: string) {
    this.composite.forEach(comp => {
      comp.color = color;
    });
  }

  onRemove() {
    this.composite.forEach(comp => {
      comp.body = null;
    });
  }

  remove() {
    if (this.world) {
      this.world.removeBody(this);
      this.world = null;
    }
  }

  get pos(): Vector2 {
    return this._pos;
  }

  get composite(): C {
    return this._composite;
  }

  protected set composite(composite: C) {
    this._composite = composite;
    this._composite.forEach(comp => {
      if (typeof comp.body !== 'undefined') {
        console.warn('Composite already has a body');
      }

      comp.body = this;
    });
  }

  get mass(): number {
    return this._mass;
  }

  set mass(mass: number) {
    this._mass = mass;
    if (mass === 0) {
      this._inv_mass = 0;
    } else {
      this._inv_mass = 1 / mass;
    }
  }

  get inv_mass(): number {
    return this._inv_mass;
  }

  get inertia(): number {
    return this._inertia;
  }

  set inertia(inertia: number) {
    this._inertia = inertia;
    if (inertia === 0) {
      this._inv_inertia = 0;
    } else {
      this._inv_inertia = 1 / inertia;
    }
  }

  get inv_inertia(): number {
    return this._inv_inertia;
  }
}
