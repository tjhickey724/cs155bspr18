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

}
