
class Ray3 {
  constructor(p,d){
    // s and d are Vector3 objects
    // this represents a ray starting at s moving in direction d
    this.p = p
    this.d = d
    this.len = d.length()
  }

  atTime(t){
    return this.p.add(this.d.scale(t))
  }

  applyTransform(t){
    //const q = this.p.add(this.d)
    const pt = t.transformVec3(this.p)
    //const qt = t.transformVec3(q)
    //const dt = qt.subtract(pt)
    const d1 = t.transformVec3a(this.d)
    return new Ray3(pt,d1)
  }

  toString(){
    return "Ray3("+this.p+","+this.d+")";
  }
}
