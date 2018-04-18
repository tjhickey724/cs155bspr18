

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


  reachesSoft(light,point){
    let count=0
    let limit = 10
    for(let i=0; i<limit; i++){
      if (this.reachesRand(light,point)){
        count++
      }
    }
    return count/limit
  }



  reachesRand(light,point){
    const dx = Math.random()-0.5;
    const dy = Math.random()-0.5;
    const dz = Math.random()-0.5;
    const dp = new Vector3(dx,dy,dz)
    const r = 5
    const rayStart = light.position.add(dp.normalize().scale(r))

    //const lightdir = point.subtract(light.position);
    //const lightray = new Ray3(light.position,lightdir)
    const lightdir = point.subtract(rayStart);
    const lightray = new Ray3(rayStart,lightdir)
    const ri = this.intersect(lightray);
    if (ri.point== null) return false
    return (ri.point.subtract(point).length()<0.01)
  }

  reaches(light,point){
    const lightdir = point.subtract(light.position);
    const lightray = new Ray3(light.position,lightdir)
    const ri = this.intersect(lightray);
    if (ri.point== null) return false
    return (ri.point.subtract(point).length()<0.01)
  }

  // by changing this method you can change the algorithm
  // used to calculate shadows.. 
  calculateColor(point, normal, eye, mat, textureColor){
    return this.calculateColor2(point, normal, eye, mat, textureColor)
  }

  // this is the original method without soft shadows
  calculateColor0(point, normal, eye, mat, textureColor){
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

  // this one estimates how much of the light reaches the point
  calculateColor1(point, normal, eye, mat, textureColor){
    if (mat.nolighting) return textureColor
    let theColor= this.globalAmbient
    for(let light of this.lights){
      let softShadow = this.reachesSoft(light,point)
      if (softShadow > 0){
        const ambient = light.ambient().times(mat.ambient)
        const diffuse = light.diffuse(point,normal).times(mat.diffuse).times(textureColor)
        const specular = light.specular(point, normal, eye, mat.shininess).times(mat.specular)
        let softColor = ambient.add(diffuse).add(specular).scale(softShadow)
        theColor = theColor.add(softColor)
      }
    }
    return theColor
  }

  // this one makes N copies of each light
  // all randomly distributed around the center of the light
  calculateColor2(point, normal, eye, mat, textureColor){
    if (mat.nolighting) return textureColor
    let theColor= this.globalAmbient

    for(let light of this.lights){
      let softDist=light.softDist
      let softN = light.softN
      for(let i=0; i<softN;i++){
        let softPoint = softPoints[i]
        let light0 = light.clone().translate(softPoint.scale(softDist))
        if (this.reaches(light0,point)){
          let lightColor = Color.BLACK
          const ambient = light0.ambient().times(mat.ambient)
          const diffuse = light0.diffuse(point,normal).times(mat.diffuse).times(textureColor)
          const specular = light0.specular(point, normal, eye, mat.shininess).times(mat.specular)
          lightColor = lightColor.add(ambient).add(diffuse).add(specular)
          lightColor = lightColor.scale(1/softN)
          theColor = theColor.add(lightColor)
        }
      }
    }
    //if (Math.random()<0.001) console.dir(theColor.scale(1/softNum))
    return theColor
  }





}

function randPoint(){
  const dx = Math.random()-0.5;
  const dy = Math.random()-0.5;
  const dz = Math.random()-0.5;
  const dp = new Vector3(dx,dy,dz).normalize()
  return dp
}

let softPoints = [new Vector3(0,0,0)]
for(let i=0; i<1000; i++) {
  softPoints.push(randPoint())
}
