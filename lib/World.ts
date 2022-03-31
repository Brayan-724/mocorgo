import { Body } from '@bodies/Body';
import { Vector2 } from '@utils/Vector2';
import { CollData } from './internal/CollData';
import { Engine } from './internal/Engine';
import { Utils } from './utils/Utils';

export interface IBodiesList {
  [key: string]: Body;
}

export interface IWorldOptions {
  gravity: Vector2;
}

export class World {
  bodies: Body[] = [];
  bodiesList: IBodiesList = {};
  collisions: CollData[] = [];

  gravity: Vector2;

  engine: Engine = new Engine();

  constructor();
  constructor(options: IWorldOptions);
  constructor(options?: IWorldOptions) {
    const options_ = Object.assign({}, { gravity: Vector2.zero }, options);

    this.gravity = options_.gravity;
  }

  addBody(body: Body) {
    this.bodies.push(body);
    this.bodiesList[body.id] = body;
  }

  removeBody(body: Body) {
    const index = this.bodies.indexOf(body);

    if (index > -1) {
      this.bodies.splice(index, 1);
      delete this.bodiesList[body.id];
      Utils.executeFromPrototype(Body, body, 'onRemove', [this]);
    }
  }

  step() {
    this.collisions.length = 0;

    this.bodies.forEach(b => {
      b.reposition();
    });

    this.bodies.forEach((body, index) => {
      for (
        let bodyPairIndex = index + 1;
        bodyPairIndex < this.bodies.length;
        bodyPairIndex++
      ) {
        const bodyPair = this.bodies[bodyPairIndex];
        if (this.engine.collisionHandlingCondition(body, bodyPair)) {
          let bestSat = this.engine.collide(body, bodyPair);
          if (bestSat) {
            this.collisions.push(
              new CollData(
                body,
                bodyPair,
                bestSat.axis,
                bestSat.pen,
                bestSat.vertex
              )
            );
          }
        }
      }
    });

    this.collisions.forEach(c => {
      c.penRes();
      c.collRes();
    });
  }
}
