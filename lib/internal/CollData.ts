import { Body } from '@bodies/Body';
import { Vector2 } from '@utils/Vector2';

/**
 * Collision manifold, consisting the data for collision handling.
 * Manifolds are collected in an array for every frame
 */
export class CollData {
  body1: Body;
  body2: Body;
  normal: Vector2;
  penetration: number;
  contactPoint: Vector2;

  constructor(o1: Body, o2: Body, normal: Vector2, pen: number, cp: Vector2) {
    this.body1 = o1;
    this.body2 = o2;
    this.normal = normal;
    this.penetration = pen;
    this.contactPoint = cp;
  }

  penRes() {
    let penResolution = this.normal.clone.scale(
      this.penetration / (this.body1.inv_mass + this.body2.inv_mass)
    );

    this.body1.pos.add(penResolution.clone.scale(this.body1.inv_mass));
    this.body2.pos.add(penResolution.scale(-this.body2.inv_mass));
  }

  collRes() {
    //1. Closing velocity
    let collArm1 = this.contactPoint.clone.subtract(
      this.body1.composite[0].pos
    );
    let rotVel1 = new Vector2(
      -this.body1.angVel * collArm1.y,
      this.body1.angVel * collArm1.x
    );
    let closVel1 = this.body1.vel.add(rotVel1);
    let collArm2 = this.contactPoint.clone.subtract(
      this.body2.composite[0].pos
    );
    let rotVel2 = new Vector2(
      -this.body2.angVel * collArm2.y,
      this.body2.angVel * collArm2.x
    );
    let closVel2 = this.body2.vel.add(rotVel2);

    //2. Impulse augmentation
    let impAug1 = Vector2.cross(collArm1, this.normal);
    impAug1 = impAug1 * this.body1.inv_inertia * impAug1;
    let impAug2 = Vector2.cross(collArm2, this.normal);
    impAug2 = impAug2 * this.body2.inv_inertia * impAug2;

    let relVel = closVel1.subtract(closVel2);
    let sepVel = Vector2.dot(relVel, this.normal);
    let new_sepVel =
      -sepVel * Math.min(this.body1.elasticity, this.body2.elasticity);
    let vsep_diff = new_sepVel - sepVel;

    let impulse =
      vsep_diff /
      (this.body1.inv_mass + this.body2.inv_mass + impAug1 + impAug2);
    let impulseVec = this.normal.clone.scale(impulse);

    //3. Changing the velocities
    this.body1.vel.add(impulseVec.clone.scale(this.body1.inv_mass));
    this.body2.vel.add(impulseVec.scale(-this.body2.inv_mass));

    this.body1.angVel +=
      this.body1.inv_inertia * Vector2.cross(collArm1, impulseVec);
    this.body2.angVel -=
      this.body2.inv_inertia * Vector2.cross(collArm2, impulseVec);
  }
}
