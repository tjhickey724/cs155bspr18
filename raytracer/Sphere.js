/*
This file contains the definition of the following classes
Sphere
Plane
and it relies on the Vector3 and Ray3 classes
*/


class Sphere extends Object3D{
  constructor(){
    super()
    this.center = new Vector3(0,0,0)
    this.radius = 1
    this.material = new Material(Color.WHITE, Color.WHITE, Color.WHITE, 255)
    this.transform = new Transform()
  }

  intersect(r){
    // intersect the ray r with the sphere
    const a = (r.d).dot(r.d)
    const pc = r.p.subtract(this.center)
    const b = 2*(r.d.dot(pc))
    const c = pc.dot(pc) - this.radius*this.radius
    const d = b*b-4*a*c
    if (d<0) return RayIntersection.none()
    const t1 = (-b - Math.sqrt(d))/(2*a)
    const t2 = (-b + Math.sqrt(d))/(2*a)
    const p1 = r.atTime(t1);
    const p2 = r.atTime(t2);

    if (d==0)
      if (t1>0) {
        let normal1 = p1.subtract(this.center).normalize();
        if (normal1.dot(r.d)>0) normal1 = normal1.scale(-1)
          return new RayIntersection(this, p1,  normal1, this.uv(p1))
      } else
          return RayIntersection.none()

    if (t1>0) {
      let normal1 = p1.subtract(this.center).normalize();
      if (normal1.dot(r.d)>0) normal1 = normal1.scale(-1)
      return new RayIntersection(this, p1,  normal1, this.uv(p1))
    }else if (t2>0){
      let normal2 = p2.subtract(this.center).normalize();
      if (normal2.dot(r.d)>0) normal2 = normal2.scale(-1)
      return new RayIntersection(this, p2, normal2, this.uv(p2))
    }else
      return RayIntersection.none()
  }

  uv(p){
    // returns a uv coordinate for the point in [0,1]x[0,1]
    // similar to latitude and longitude
    const pc = p.subtract(this.center)
    const phi = Math.asin(pc.y/this.radius)
    const theta = Math.atan2(pc.z,pc.x)
    return {u:1-(0.5*theta/Math.PI+0.5), v:(phi/Math.PI+0.5)}
  }

}
