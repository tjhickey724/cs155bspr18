

class RayIntersection{
  constructor(object, point, normal, uv){
    this.object=object
    this.point = point
    this.normal = normal
    this.uv = uv
    if (object && !uv) {
      console.dir(['badRI',object,point,normal,uv])
      console.log(nothing)
    }
  }

  static none(){
    return new RayIntersection(null, null, null,null);
  }

  empty(){
    return this.object==null
  }

  applyTransform(t){
    const point1 = t.transformVec3(this.point)
    const normal1 = t.inverse().transpose().transformVec3a(this.normal).normalize()
    //if (Math.random()< 0.01) console.dir(['inaT',t,this.normal,normal1])
    return new RayIntersection(this.object,point1,normal1,this.uv)
  }

  isEmpty(){
    return this.object==null
  }
}
