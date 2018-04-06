class Transform {
  constructor(){
    this.mat = Matrix.identity(4)
    this.inv = this.mat
  }

  // transform a point in affine coordinates
  // this combines rotations, translations, and scalings
  transformVec3(vec3){
    const m4x1 = new Matrix(4,1,[[vec3.x],[vec3.y],[vec3.z],[1]])
    const newm4x1 = this.mat.multiply(m4x1)
    const x = newm4x1.vals[0][0]
    const y = newm4x1.vals[1][0]
    const z = newm4x1.vals[2][0]
    const w = newm4x1.vals[3][0]
    return new Vector3(x/w, y/w, z/w)
  }

  // transform a direction, ignoring the translations ...
  transformVec3a(vec3){
    const m4x1 = new Matrix(4,1,[[vec3.x],[vec3.y],[vec3.z],[0]])
    const newm4x1 = this.mat.multiply(m4x1)
    const x = newm4x1.vals[0][0]
    const y = newm4x1.vals[1][0]
    const z = newm4x1.vals[2][0]
    return new Vector3(x, y, z)
  }

  translate(vec3){
    let t = new Transform();
    t.mat = this.mat.multiply(Matrix.translation(vec3))
    t.inv = Matrix.translation(vec3.scale(-1)).multiply(this.inv)
    return t
  }

  preTranslate(vec3){
    let t = new Transform();
    t.mat = Matrix.translation(vec3).multiply(this.mat)
    t.inv = this.inv.multiply(Matrix.translation(vec3.scale(-1)))
    return t
  }

  rotateX(angle){
    let t = new Transform();
    t.mat = this.mat.multiply(Matrix.rotateX(angle))
    t.inv = Matrix.rotateX(-angle).multiply(this.inv)
    return t
  }

  rotateY(angle){
    let t = new Transform();
    t.mat = this.mat.multiply(Matrix.rotateY(angle))
    t.inv = Matrix.rotateY(-angle).multiply(this.inv)
    return t
  }

  rotateZ(angle){
    let t = new Transform();
    t.mat = this.mat.multiply(Matrix.rotateZ(angle))
    t.inv = Matrix.rotateZ(-angle).multiply(this.inv)
    return t
  }

  scale(vec3){
    let t = new Transform();
    t.mat = this.mat.multiply(Matrix.scale(vec3))
    const vec3inv = new Vector3(1/vec3.x,1/vec3.y,1/vec3.z)
    t.inv = Matrix.scale(vec3inv).multiply(this.inv)
    return t
  }

  inverse(){
    let t = new Transform();
    t.mat = this.inv
    t.inv = this.mat
    return t
  }

  transpose(){
    let t = new Transform();
    t.mat = this.mat.transpose()
    t.inv = this.inv.transpose()
    return t
  }

  toString(){
    return "Transform({mat:"+this.mat.toString()+",\n inv:"+this.inv.toString()+"})"
  }

}
