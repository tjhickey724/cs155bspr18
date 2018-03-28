/*
This file contains the definition of the following classes
Vector3
Ray3
Renderer
Sphere
RayIntersection
Camera
Scene

*/

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
    return this.scale(1/this.length())
  }
  toString(){
  return "Vector3("+this.x+","+this.y+","+this.z+")";
  }
}





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

    toString(){
  return "Ray3("+this.p+","+this.d+")";
    }
}





class Renderer {
  constructor(w,h){
    this.width = w
    this.height = h
  }

  drawPixel(i,j,c){
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d')
      ctx.fillStyle = c;
      var w = canvas.width
      var h = canvas.height
      var wp = w/this.width
      var hp = h/this.height
      ctx.fillRect(i*wp,(this.height-j-1)*hp,wp,hp);
    }
  }

  render(scene,camera){
    for(let i=0;i<this.width;i++){
      for(let j=0; j<this.height; j++){
        const x = 2*i/this.width-1 // x goes from -1 to 1 in this.width steps
        const y = 2*j/this.height-1 // y goes from -1 to 1 in this.height steps
        const r = camera.createRay(x,y) // this creates the ray for pixel (i,j)
        const intersection = scene.intersect(r)
        if (intersection.isEmpty()){
          this.drawPixel(i,j,'rgb(0,0,0)')
        }
        else {
          const obj = intersection.object
          const p = intersection.point
					const n = intersection.normal
          const c = obj.color(p)
					// now we need to do the lighting calculations
					// this involves the point p, the normal n, and the lights
					const b = scene.calculateDiffuseIntensity(p,n)
					const color = c.scale(b).to255()
					const theColor = Color.average(0.1,new Color(1,1,1),c.scale(b))

          this.drawPixel(i,j,theColor.to255())
        }
      }
    }
  }
}







class Camera {
  constructor(){
    this.position = new Vector3(0,0,0);
  }

  translateZ(k){
    this.position.z += k
  }

  createRay(x,y){
    // this creates a ray looking in the negative z direction
    var p = this.position;
    var d = new Vector3(x,y,-1)
    var r = new Ray3(p,d);
    return r;
  }
}



class Scene {
  constructor(name){
    this.name=name
    this.objects=[]
    this.lights=[]
  }

  addObject(x){
    this.objects.push(x)
  }

  addLight(x){
    this.lights.push(x)
  }

  intersect(ray){
    // intersect the ray with each object
    let z = this.objects.map(
      function(x){
        return x.intersect(ray)});
    // throw out the non-intersections
    z = z.filter(
      function(x){
        return x.object!= null})
    // if the ray didn't intersect any objects, return a non-intersection object
    if (z.length==0)
      return RayIntersection.none()

    // now we know it did intersect an object so lets find the closest one
    let mindist=z[0].distance
    let minIntersection=z[0]
    for(let x of z){
      if (x.distance < mindist) {
        mindist = x.distance
        minIntersection = x
      }
    }
    return minIntersection

  }

	calculateDiffuseIntensity(point, normal){
		let brightness = 0
		for(let light of this.lights){
			const diffuse = light.diffuse(point,normal)
			if (diffuse>0)
				brightness += diffuse
		}
		if (brightness > 1.0){
			brightness = 1.0
		}
		return brightness


	}
}



class Light{
	constructor(position){
		this.position = position
		this.color = new Color(1,1,1)
	}

	setColor(r,g,b){
		this.color = new Color(r,g,b)
	}

	diffuse(point,normal){
		const lightdir = this.position.subtract(point).normalize()
		const diffuse = lightdir.dot(normal)
		return diffuse
	}

	specular(point,normal,eye){
		// we need to write this!
	}
}


class Color {
	// colors are rgb with values between 0.0 and 1.0
	// c.to255()  converts this color into a Javascript 255-based color
	// e.g.  rgb(200,255,0)

	constructor(r,g,b){
		this.r=r
		this.g=g
		this.b=b
	}

	scale(k){
		return new Color(this.r*k, this.g*k, this.b*k)
	}

	add(c){
		return new Color(this.r+c.r,this.g+c.g,this.b+c.b)
	}

	static average(w,c1,c2){
		// this forms the weighted average of the two colors c1,c2
		return c1.scale(w).add(c2.scale(1-w))
	}

	to255(){
		const r = Math.floor(255*(this.r%1))
		const g = Math.floor(255*(this.g%1))
		const b = Math.floor(255*(this.b%1))
		const s = "rgb("+r+","+g+","+b+")"
		return s
	}
}




class RayIntersection{
  constructor(object, point, distance, normal){
    this.object=object
    this.point = point
    this.distance=distance
    this.normal = normal
  }

  static none(){
    return new RayIntersection(null, null, -1, null);
  }

  isEmpty(){
    return this.object==null
  }
}




class Sphere {
  constructor(c,r){
    this.center = c
    this.radius = r
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
		return  new Color(z.u, 0.5, z.v)

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
  }

  intersect(ray){
    const t = this.position.subtract(ray.p).dot(this.normal)/
              ray.d.dot(this.normal)
    if (t>0){
      const point = ray.atTime(t)
			const distance = point.subtract(ray.p).length()
      return new RayIntersection(this,point, distance, this.normal)
    } else {
      return RayIntersection.none()
    }

  }

  color(p){
    // here we create a computed texture for the plane
    const r = Math.abs(p.dot(this.u)%1)
    const g = Math.abs(p.dot(this.v)%1)
    return new Color(r,g,1-r-g)
  }
}
