/*
This file contains the definition of the following classes

Renderer
RayIntersection
Camera
Scene
Light
*/





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
        return x.intersectRay(ray)});
    // throw out the non-intersections
    z = z.filter(
      function(x){
        return x.object!= null})
    // if the ray didn't intersect any objects, return a non-intersection object
    if (z.length==0)
      return RayIntersection.none()

    // now we know it did intersect an object so lets find the closest one
		//let mindist=z[0].distance
    let minIntersection=z[0]
		let mindist = minIntersection.point.subtract(ray.p).length()
    for(let x of z){
			const distance = x.point.subtract(ray.p).length()
      if (distance < mindist) {
        mindist = distance
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
