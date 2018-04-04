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
				const normal1 = p1.subtract(this.center).normalize();
			    return new RayIntersection(this, p1,  normal1, this.uv(p1))
			} else
          return RayIntersection.none()

    if (t1>0) {
			const normal1 = p1.subtract(this.center).normalize();
      return new RayIntersection(this, p1,  normal1, this.uv(p1))
    }else if (t2>0){
			const normal2 = p2.subtract(this.center).normalize();
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



class Plane extends Object3D {
  constructor(){
		super()
    this.u=new Vector3(1,0,0)
    this.v=new Vector3(0,1,0)
    this.normal = this.u.cross(this.v).normalize()
		this.material = new Material(Color.WHITE, Color.WHITE, Color.WHITE, 255)

  }

  intersect(ray){
		let n = this.normal
		if (ray.d.dot(n)>0)
		  n = n.scale(-1)  // can look at both sides of a plane
    const t = this.position.subtract(ray.p).dot(n)/
              ray.d.dot(n)

    if (t>0){
      const point = ray.atTime(t)
			//console.dir(['in Plane',this,point,this.uv(point)])
      const ri = new RayIntersection(this, point, this.normal, this.uv(point))
			//console.dir(ri)
			return ri
    } else {
      return RayIntersection.none()
    }

  }

  uv(p){
    // here we generate uv coordinates for the plane
		// these map every point to a (u,v) value in [0,1]x[0,1]
    const u = (1 + p.dot(this.u)%1) %1
    const v = (1 + p.dot(this.v)%1) %1
    return {u:u, v:v};
  }
}

class Square extends Plane {
	constructor(){
		super()
	}

	intersect(ray){
		const ri = super.intersect(ray)
		const p = ri.point
		if (p==null) return ri
		const pu = p.dot(this.u)
		const pv = p.dot(this.v)
		if (pu<0 || pu>1 || pv<0 || pv>1){
		 return RayIntersection.none()
	  }
		else {
			//console.dir(['in Square',p,this.uv(p)])
			//console.log(nothing)
			return ri
		}
	 }
}
