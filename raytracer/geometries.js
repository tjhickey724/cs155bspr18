/*
This file contains the definition of the following classes
Sphere
Plane
and it relies on the Vector3 and Ray3 classes
*/


class RayIntersection{
  constructor(object, point, normal){
    this.object=object
    this.point = point
    this.normal = normal
  }

  static none(){
    return new RayIntersection(null, null, null);
  }

	empty(){
		return this.object==null
	}

	applyTransform(t){
		const point1 = t.transformVec3(this.point)
		const normal = t.inverse().transpose().transformVec3a(this.normal).normalize()
		return new RayIntersection(this.object,point1,normal)
	}

  isEmpty(){
    return this.object==null
  }
}


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
			    return new RayIntersection(this, p1,  normal1)
			} else
          return RayIntersection.none()

    if (t1>0) {
			const normal1 = p1.subtract(this.center).normalize();
      return new RayIntersection(this, p1,  normal1)
    }else if (t2>0){
			const normal2 = p2.subtract(this.center).normalize();
      return new RayIntersection(this, p2, normal2)
    }else
      return RayIntersection.none()
  }

	uv(p){
		// returns a uv coordinate for the point in [0,1]x[0,1]
		// similar to latitude and longitude
		const pc = p.subtract(this.center)
		const phi = Math.asin(pc.y/this.radius)
		const theta = Math.atan2(pc.z,pc.x)
		return {u:0.5*theta/Math.PI+0.5, v:phi/Math.PI+0.5}
	}

}



class Plane extends Object3D {
  constructor(q,u,v){
		super()
    this.position = q
    this.u=u;
    this.v=v;
    this.normal = u.cross(v).normalize()
		this.material = new Material(Color.WHITE, Color.WHITE, Color.WHITE, 255)

  }

  intersect(ray){
    const t = this.position.subtract(ray.p).dot(this.normal)/
              ray.d.dot(this.normal)

    if (t>0){
      const point = ray.atTime(t)
      return new RayIntersection(this, point, this.normal)
    } else {
      return RayIntersection.none()
    }

  }

  uv(p){
    // here we generate uv coordinates for the plane
    const u = Math.abs(p.dot(this.u)%1)
    const v = Math.abs(p.dot(this.v)%1)
    return {u:u, v:v};
  }
}
