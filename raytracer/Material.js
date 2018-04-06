

class Material{
  constructor(ambient, diffuse, specular, shininess){
    this.ambient = ambient
    this.diffuse = diffuse
    this.specular = specular
    this.shininess = shininess
    this.texture='none'
    this.textureWeight=0
    this.reflectivity=0
    this.nolighting = false
  }

  getColor(light){
    const a1 = this.ambient.times(light.ambient)
    const d1 = this.diffuse.times(light.diffuse)
    const s1 = this.specular.times(light.specular)
    const c = a1.plus(d1.plus(s1))
    return c
  }

  static get WHITEMAT() {return whiteMaterial}

  static standard(){
    return new Material(Color.BLACK, new Color(1,1,1), new Color(1,1,1), 256)
  }

}


const whiteMaterial = new Material(Color.BLACK, Color.WHITE, Color.WHITE, 255)





function clamp(x,a,b){
  if (x<a) return a
  if (x>b) return b
  return x
}
