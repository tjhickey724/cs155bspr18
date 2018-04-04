

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
