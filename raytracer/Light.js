
class Light{
  constructor(position){
    this.position = position
    this.intensity = 1.0
    this.ambientColor = Color.BLACK
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

  specularBlinnPhong2(point,normal,eye,shininess){
    const lightv = this.position.subtract(point).normalize()
    const eyev = eye.subtract(point).normalize()
    const h = eyev.add(lightv).normalize()
    const bp = h.dot(normal)
    if (bp>0) return Math.pow(bp,shininess)
    else return 0
  }



  specularBlinnPhong(point,normal,eye, shininess){
    // we need to write this!
    const lightv = this.position.subtract(point).normalize()
    const eyev = eye.subtract(point).normalize()
    const lh = lightv.add(eyev).normalize();
    const specular = lh.dot(normal)
    let brightness=0
    if (specular > 0)
      brightness =  Math.pow(specular,shininess);
    return this.specularColor.scale(this.intensity*brightness)
  }

  specularPhong(point,normal,eye, shininess){
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

  specular(point,normal,eye, shininess){
    return this.specularBlinnPhong(point,normal,eye, shininess)
  }
}
