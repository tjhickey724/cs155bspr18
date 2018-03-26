class Vector3 {
	constructor(x,y,z){
		this.x=x; this.y=y; this.z=z;
	}

	static dot(u,v) {
		return u.x*v.x + u.y*v.y + u.z*v.z
	}

	dot(v){
		return Vector3.dot(this,v)
	}
  // add two vectors
  static add(u,v){
    return new Vector3(u.x+v.x, u.y+v.y, u.z+v.z)
  }

  add(v){
    // add this to v and return result
    return Vector3.add(this,v)
  }

  // subtract


  // scale, i.e. multiply a vector by a number r    u.scale(r)
  // if u = (1,2,2)  u.scale(5) would return (5,10,10)

  static cross(u,v){
    return new Vector3(u.y*v.z-u.z*v.y, u.z*v.x-u.x*v.z, u.x*v.y-u.y*v.x);
  }

  cross(v) {
    return Vector3.cross(this,v);
  }

}
