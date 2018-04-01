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
					const mat = obj.material

					const e = camera.position.subtract(p).normalize()
					// now we need to do the lighting calculations
					// this involves the point p, the normal n, and the lights
					const theColor = scene.calculateColor(p,n,e,mat)

          this.drawPixel(i,j,theColor.to255())
				//	console.dir(intersection); return
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

	calculateColor(point, normal, eye, mat){
		let theColor= new Color(0,0,0)
		for(let light of this.lights){
			const ambient = light.ambient().times(mat.ambient)
			const diffuse = light.diffuse(point,normal).times(mat.diffuse)
			const specular = light.specular(point, normal, eye, mat.shininess).times(mat.specular)
			theColor = theColor.add(ambient).add(diffuse).add(specular)
		}
		return theColor
	}


}


class Light{
	constructor(position){
		this.position = position
		this.intensity = 1.0
		this.ambientColor = Color.WHITE.scale(0.1)
		this.diffuseColor = Color.WHITE
		this.specularColor = Color.WHITE
	}

	ambient(){
		return this.ambientColor.scale(this.intensity)
	}

	diffuse(point,normal){
		const lightdir = this.position.subtract(point).normalize()
		let diffuse = lightdir.dot(normal)
    if (diffuse < 0) diffuse=0
		return this.diffuseColor.scale(this.intensity*diffuse)
	}

	specular(point,normal,eye, shininess){
		// we need to write this!
    const lightv = this.position.subtract(point).normalize()
    const eyev = eye.subtract(point).normalize()
    const h = lightv.dot(normal)
		const sameSide = (h*lightv.dot(normal)>0) // light and eye on same side of surface
    const lightProj = lightv.subtract(normal.scale(h))
    const lightvprime = lightv.subtract(lightProj.scale(2));
		const specular = lightvprime.dot(eyev)
    let brightness = 0
		if (specular > 0 && sameSide)
			brightness =  Math.pow(specular,shininess);
    return this.specularColor.scale(this.intensity*brightness)
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
