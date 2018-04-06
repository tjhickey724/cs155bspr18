class Plane extends Object3D {
  constructor(){
    super()
    this.origin = new Vector3(0,0,0)
    this.u=new Vector3(1,0,0)
    this.v=new Vector3(0,1,0)
    this.normal = this.u.cross(this.v).normalize()
    this.material = new Material(Color.WHITE, Color.WHITE, Color.WHITE, 255)
    this.transform = new Transform()
  }

  intersect(ray){
    let n = this.normal
    if (ray.d.dot(n)>0)
      n = n.scale(-1)  // can look at both sides of a plane
    const t = this.origin.subtract(ray.p).dot(n)/
              ray.d.dot(n)

    if (t>0){
      const point = ray.atTime(t)
      //console.dir(['in Plane',this,point,this.uv(point)])
      const ri = new RayIntersection(this, point, n, this.uv(point))
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
    this.transform = new Transform()
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

class Rectangle extends Plane {
  constructor(w,h){
    super()
    this.transform = new Transform()
    this.w=w
    this.h=h
  }

  intersect(ray){
    const ri = super.intersect(ray)
    const p = ri.point
    if (p==null) return ri
    const pu = p.dot(this.u)
    const pv = p.dot(this.v)
    if (pu<0 || pu>this.w || pv<0 || pv>this.h){
     return RayIntersection.none()
    }
    else {
      //console.dir(['in Square',p,this.uv(p)])
      //console.log(nothing)
      return ri
    }
   }

   toString(){
     const pos = this.transform.transformVec3(new Vector3(0,0,0))
     const u = this.transform.transformVec3(new Vector3(1,0,0))
     const v = this.transform.transformVec3(new Vector3(0,1,0))
     const ua = this.transform.transformVec3a(new Vector3(1,0,0))
     const va = this.transform.transformVec3a(new Vector3(0,1,0))
     return {pos,u,v,ua,va}
   }
}
