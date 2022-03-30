import { Body } from './bodies/Body';
import { WallBody } from './bodies/Wall';
import { CircleComposite } from './composite/Circle';
import { Composite } from './composite/Composite';
import { LineComposite } from './composite/Line';
import { RectangleComposite } from './composite/Rectangle';
import { TriangleComposite } from './composite/Triangle';
import { CollData } from './internal/CollData';
import { Vector2 } from './utils/Vector2';

const COLLISIONS: CollData[] = [];

//Collision manifold, consisting the data for collision handling
//Manifolds are collected in an array for every frame


// Returns with a number rounded to <precision> decimals
export function round(number: number, precision: number) {
  return parseFloat(number.toFixed(precision));
}

// Returns with a random integer
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Takes a vector and a line
// Returns with the vector of the lines closest point to the given vector
export function closestPointOnLS(p: Vector2, w1: WallBody): Vector2 {
  let ballToWallStart = w1.start.clone.subtract(p);
  if (Vector2.dot(w1.dir, ballToWallStart) > 0) {
    return w1.start;
  }

  let wallEndToBall = p.clone.subtract(w1.end);
  if (Vector2.dot(w1.dir, wallEndToBall) > 0) {
    return w1.end;
  }

  let closestDist = Vector2.dot(w1.dir, ballToWallStart);
  let closestVect = w1.dir.clone.scale(closestDist);
  return w1.start.clone.subtract(closestVect);
}

// Takes 2 endpoints of 2 line segments (aka 4 vectors)
// Returns with the intersection vector or false if there is no intersection
export function lineSegmentIntersection(
  p1: Vector2,
  p2: Vector2,
  q1: Vector2,
  q2: Vector2
): false | Vector2 {
  let resultVector = new Vector2(0, 0);
  let r = p2.clone.subtract(p1);
  let s = q2.clone.subtract(q1);
  let qp = q1.clone.subtract(p1);
  let denom = Vector2.cross(r, s);

  let u = Vector2.cross(qp, r) / denom;
  let t = Vector2.cross(qp, s) / denom;

  // Case 1: two line segments are parallel and non-intersecting
  if (denom === 0 && Vector2.cross(qp, r) !== 0) {
    return false;
  }
  // Case 2: two line segments are collinear
  if (denom === 0 && Vector2.cross(qp, r) === 0) {
    // True: overlapping, false: disjoint
    if (
      q1.x - p1.x < 0 &&
      q1.x - p2.x < 0 &&
      q2.x - p1.x < 0 &&
      q2.x - p2.x < 0 &&
      q1.y - p1.y < 0 &&
      q1.y - p2.y < 0 &&
      q2.y - p1.y < 0 &&
      q2.y - p2.y < 0
    ) {
      return false;
    } else {
      resultVector = p2; // fix...
      return resultVector;
    }
  }
  // Case 3: If 0<=t<=1 and 0<=u<=1, they have an intersection, otherwise nope
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    resultVector = p1.clone.add(r.scale(t));
    return resultVector;
  } else {
    return false;
  }
}

//Separating axis theorem on two objects
//Returns with the details of the Minimum Translation Vector (or false if no collision)
export function sat(
  o1: Composite,
  o2: Composite
): false | { pen: number; axis: Vector2; vertex: Vector2 } {
  let minOverlap: number | null = null;
  let smallestAxis: Vector2 = new Vector2(0, 0);
  let vertexObj: Composite = o1;

  const axes = findAxes(o1, o2);
  let proj1;
  let proj2;
  const firstShapeAxes = getShapeAxes(o1);

  for (let i = 0; i < axes.length; i++) {
    proj1 = projShapeOntoAxis(axes[i], o1);
    proj2 = projShapeOntoAxis(axes[i], o2);
    let overlap =
      Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
    if (overlap < 0) {
      return false;
    }

    if (
      (proj1.max > proj2.max && proj1.min < proj2.min) ||
      (proj1.max < proj2.max && proj1.min > proj2.min)
    ) {
      let mins = Math.abs(proj1.min - proj2.min);
      let maxs = Math.abs(proj1.max - proj2.max);
      if (mins < maxs) {
        overlap += mins;
      } else {
        overlap += maxs;
        axes[i] = axes[i].scale(-1);
      }
    }

    if (minOverlap === null || overlap < minOverlap) {
      minOverlap = overlap;
      smallestAxis = axes[i];
      if (i < firstShapeAxes) {
        vertexObj = o2;
        if (proj1.max > proj2.max) {
          smallestAxis = axes[i].scale(-1);
        }
      } else {
        vertexObj = o1;
        if (proj1.max < proj2.max) {
          smallestAxis = axes[i].scale(-1);
        }
      }
    }
  }

  let contactVertex = projShapeOntoAxis(smallestAxis, vertexObj).collVertex;
  //smallestAxis.drawVec(contactVertex.x, contactVertex.y, minOverlap, "blue");

  if (vertexObj === o2) {
    smallestAxis = smallestAxis.scale(-1);
  }

  return {
    pen: minOverlap ?? 0,
    axis: smallestAxis,
    vertex: contactVertex,
  };
}

//Helping export functions for the SAT below
//returns the min and max projection values of a shape onto an axis
export function projShapeOntoAxis(axis: Vector2, obj: Composite) {
  setBallVerticesAlongAxis(obj, axis);
  let min = Vector2.dot(axis, obj.vertex[0]);
  let max = min;
  let collVertex = obj.vertex[0];
  for (let i = 0; i < obj.vertex.length; i++) {
    let p = Vector2.dot(axis, obj.vertex[i]);
    if (p < min) {
      min = p;
      collVertex = obj.vertex[i];
    }
    if (p > max) {
      max = p;
    }
  }
  return {
    min: min,
    max: max,
    collVertex: collVertex,
  };
}

//finds the projection axes for the two objects
export function findAxes(o1: Composite, o2: Composite): Vector2[] {
  let axes: Vector2[] = [];
  if (o1 instanceof CircleComposite && o2 instanceof CircleComposite) {
    if (o2.pos.clone.subtract(o1.pos).mag > 0) {
      axes.push(o2.pos.clone.subtract(o1.pos).unit());
    } else {
      axes.push(new Vector2(Math.random(), Math.random()).unit());
    }
    return axes;
  }
  if (o1 instanceof CircleComposite) {
    axes.push(closestVertexToPoint(o2, o1.pos).subtract(o1.pos).unit());
  }
  if (o1 instanceof LineComposite) {
    axes.push(o1.dir.normal());
  }
  if (o1 instanceof RectangleComposite) {
    axes.push(o1.dir.normal());
    axes.push(o1.dir);
  }
  if (o1 instanceof TriangleComposite) {
    axes.push(o1.vertex[1].clone.subtract(o1.vertex[0]).normal());
    axes.push(o1.vertex[2].clone.subtract(o1.vertex[1]).normal());
    axes.push(o1.vertex[0].clone.subtract(o1.vertex[2]).normal());
  }
  if (o2 instanceof CircleComposite) {
    axes.push(closestVertexToPoint(o1, o2.pos).subtract(o2.pos).unit());
  }
  if (o2 instanceof LineComposite) {
    axes.push(o2.dir.normal());
  }
  if (o2 instanceof RectangleComposite) {
    axes.push(o2.dir.normal());
    axes.push(o2.dir);
  }
  if (o2 instanceof TriangleComposite) {
    axes.push(o2.vertex[1].clone.subtract(o2.vertex[0]).normal());
    axes.push(o2.vertex[2].clone.subtract(o2.vertex[1]).normal());
    axes.push(o2.vertex[0].clone.subtract(o2.vertex[2]).normal());
  }
  return axes;
}

//iterates through an objects vertices and returns the one that is the closest to the given point
export function closestVertexToPoint(obj: Composite, p: Vector2): Vector2 {
  let closestVertex: Vector2 = obj.vertex[0];
  let minDist = null;
  for (let i = 0; i < obj.vertex.length; i++) {
    if (minDist === null || p.clone.subtract(obj.vertex[i]).mag < minDist) {
      closestVertex = obj.vertex[i];
      minDist = p.clone.subtract(obj.vertex[i]).mag;
    }
  }
  return closestVertex.clone;
}

//returns the number of the axes that belong to an object
export function getShapeAxes(obj: Composite): number {
  if (obj instanceof CircleComposite || obj instanceof LineComposite) {
    return 1;
  }
  if (obj instanceof RectangleComposite) {
    return 2;
  }
  if (obj instanceof TriangleComposite) {
    return 3;
  }

  return 0;
}

//the ball vertices always need to be recalculated based on the current projection axis direction
export function setBallVerticesAlongAxis(obj: Composite, axis: Vector2): void {
  if (obj instanceof CircleComposite) {
    axis = axis.clone.unit();
    obj.vertex[0] = obj.pos.clone.add(axis.clone.scale(-obj.radius));
    obj.vertex[1] = obj.pos.clone.add(axis.scale(obj.radius));
  }
}
//Thats it for the SAT and its support export functions

//Collision is handled based on the body layer
//Layer -1: collision handling with layer 0 bodies ONLY
//Layer -2: no collision handling with any other body
export function collisionHandlingCondition(body1: Body, body2: Body): boolean {
  return (
    (body1.layer === body2.layer &&
      !(body1.layer === -1 || body1.layer === -2)) ||
    (body1.layer === 0 && body2.layer !== -2) ||
    (body2.layer === 0 && body1.layer !== -2)
  );
}

export function collide(
  o1: Body,
  o2: Body
):
  | false
  | {
      pen: number;
      axis: Vector2;
      vertex: Vector2;
    } {
  let bestSat:
    | {
        pen: number;
        axis: Vector2;
        vertex: Vector2;
      }
    | {
        pen: null;
        axis: null;
        vertex: null;
      } = {
    pen: null,
    axis: null,
    vertex: null,
  };
  for (let o1comp = 0; o1comp < o1.comp.length; o1comp++) {
    for (let o2comp = 0; o2comp < o2.comp.length; o2comp++) {
      const axis = sat(o1.comp[o1comp], o2.comp[o2comp]);
      if (axis && bestSat.pen && axis.pen > bestSat.pen) {
        bestSat = axis;
      }
    }
  }
  if (bestSat.pen !== null) {
    return bestSat;
  } else {
    return false;
  }
}

export function userInteraction() {
  Body.BODIES.forEach(b => {
    b.keyControl();
  });
}

export function gameLogic() {}

export function physicsLoop() {
  COLLISIONS.length = 0;

  Body.BODIES.forEach(b => {
    b.reposition();
  });

  Body.BODIES.forEach((body, index) => {
    for (let bodyPairIndex = index + 1; bodyPairIndex < Body.BODIES.length; bodyPairIndex++) {
      const bodyPair = Body.BODIES[bodyPairIndex];
      if (collisionHandlingCondition(body, bodyPair)) {
        let bestSat = collide(body, bodyPair);
        if (bestSat) {
          COLLISIONS.push(
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

  COLLISIONS.forEach(c => {
    c.penRes();
    c.collRes();
  });
}
