
class Vector3 {
  // this is the class of 3 dimensional vectors

  constructor(x,y,z){
    this.x=x; this.y=y; this.z=z;
  }

  static dot(u,v) {
    return u.x*v.x + u.y*v.y + u.z*v.z
  }
  static add(u,v){
    return new Vector3(u.x+v.x, u.y+v.y, u.z+v.z)
  }
  static subtract(u,v){
    return new Vector3(u.x-v.x, u.y-v.y, u.z-v.z)
  }
  static scale(u,k){
    return new Vector3(u.x*k, u.y*k, u.z*k)
  }
  static cross(u,v){
    return new Vector3(u.y*v.z-u.z*v.y, u.z*v.x-u.x*v.z, u.x*v.y-u.y*v.x)
  }

  dot(v){
    return Vector3.dot(this,v)
  }
  cross(v){
    return Vector3.cross(this,v)
  }
  add(v){
    return Vector3.add(this,v)
  }
  subtract(v){
    return Vector3.subtract(this,v)
  }
  scale(k){
    return Vector3.scale(this,k)
  }

  length(){
    return Math.sqrt(this.dot(this))
  }
  normalize(){
    const len = this.length()
    if (len==0)
      return this.scale(1)
    else
      return this.scale(1/this.length())
  }
  toString(){
  return "Vector3("+this.x+","+this.y+","+this.z+")";
  }

  equals(that){
    return this.subtract(that).length() < 0.0000001
  }
}
