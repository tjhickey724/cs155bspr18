

class Scene {
  constructor(name){
    this.name=name
    this.objects=[]
    this.lights=[]
		this.globalAmbient = Color.BLACK //new Color(0.1,0.1,0.1)
  }

  addObject(x){
    this.objects.push(x)
  }

  addLight(x){
    this.lights.push(x)
  }

	getColorForRay(ray,depth){
		const intersection = this.intersect(ray)
		//if (Math.random()<0.001) console.dir([ray,intersection])
		if (intersection.isEmpty()){
			return(Color.BLACK)
		} else {
			const obj = intersection.object
			const p = intersection.point
			const n = intersection.normal
			const uv = intersection.uv
			const mat = obj.material
			const e = ray.p.subtract(p).normalize()

			let textureColor = new Color(1,1,1)
			if (mat.texture!='none'){
				textureColor = mat.texture.pixel(uv.u,uv.v)
			}
			let theColor = this.calculateColor(p,n,e,mat,textureColor)

			if (depth > 1 && mat.reflectivity >0) {
				const ray1 = this.reflectionRay(ray,n,p)
				//console.dir(['ray1',ray1,ray,n,p])
				//console.log(unknown)
				let color2 = this.getColorForRay(ray1,depth-1)
				//console.dir(['gCFR',mat.reflectivity,theColor,color2])

				theColor = Color.average(mat.reflectivity,color2,theColor)
			}
			return theColor
		}
	}

	reflectionRay(ray,n,p) {
		let alpha = n.scale(n.dot(ray.d))
		let d1 = ray.d.subtract(alpha.scale(2)).normalize()
		let p1 = p.add(d1.scale(0.001))
		return new Ray3(p1,d1)
	}


	intersect(ray) {
		return Scene.intersectObjects(ray,this.objects)
	}

  static intersectObjects(ray,objects){
    // intersect the ray with each object
    let z = objects.map(
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


	reaches(light,point){
		const lightdir = point.subtract(light.position);
		const lightray = new Ray3(light.position,lightdir)
		const ri = this.intersect(lightray);
		if (ri.point== null) return false
		return (ri.point.subtract(point).length()<0.01)
	}

	calculateColor(point, normal, eye, mat, textureColor){
		if (mat.nolighting) return textureColor
		let theColor= this.globalAmbient
		for(let light of this.lights){
			if (this.reaches(light, point)){
				const ambient = light.ambient().times(mat.ambient)
				const diffuse = light.diffuse(point,normal).times(mat.diffuse).times(textureColor)
				const specular = light.specular(point, normal, eye, mat.shininess).times(mat.specular)
				theColor =
				   theColor
						 .add(ambient)
						 .add(diffuse)
						 .add(specular)
    	}
		}
		return theColor
	}


}
