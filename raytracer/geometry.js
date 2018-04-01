/*
This file contains the definition of the following classes
Sphere
Plane
and it relies on the Vector3 and Ray3 classes
*/
class Object3D {

	constructor(){
		this.position = new Vector3(0,0,0)
		this.material = Material.WHITEMAT
	}


	intersect(ray){
		const tinv = transform.inverse();
		const rayIntersection = this.intersect0(ray.applyTransform(tinv))
		const intersection = rayIntersection.applyTransform(transform)
	}
}

class Sphere extends Object3D{
  constructor(c,r){
		super()
    this.center = c
    this.radius = r
		this.material = new Material(Color.WHITE, Color.WHITE, Color.WHITE, 255)

  }

  intersect(r){
    // intersect the ray r with the sphere
    const a = (r.d).dot(r.d)
    const pc = r.p.subtract(this.center)
    const b = 2*(r.d.dot(pc))
    const c = pc.dot(pc) - this.radius*this.radius
    const d = b*b-4*a*c
    if (d<0) return []
    const t1 = (-b - Math.sqrt(d))/(2*a)
    const t2 = (-b + Math.sqrt(d))/(2*a)
    const p1 = r.atTime(t1);
    const p2 = r.atTime(t2);

    if (d==0)
			if (t1>0) {
				const normal1 = p1.subtract(this.center).normalize();
				const distance1 = p1.subtract(r.p).length();
			    return new RayIntersection(this, p1, distance1, normal1)
			} else
          return RayIntersection.none()

    if (t1>0) {
			const normal1 = p1.subtract(this.center).normalize();
			const distance1 = p1.subtract(r.p).length();
      return new RayIntersection(this, p1, distance1, normal1)
    }else if (t2>0){
			const normal2 = p2.subtract(this.center).normalize();
			const distance2 = p2.subtract(r.p).length();
      return new RayIntersection(this, p2, distance2, normal2)
    }else
      return RayIntersection.none()
  }


	color(p){
		// for now we use the uv coordinates to set the color
		const z = this.uv(p)
		return  new Color(1,1,1) //z.u, 0.5, z.v)

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



class Plane {
  constructor(q,u,v){
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
			const distance = point.subtract(ray.p).length()
      return new RayIntersection(this, point, distance, this.normal)
    } else {
      return RayIntersection.none()
    }

  }

  color(p){
    // here we create a computed texture for the plane
    const r = Math.abs(p.dot(this.u)%1)
    const g = Math.abs(p.dot(this.v)%1)
    return new Color(1,1,1); //r,g,1-r-g)
  }
}
