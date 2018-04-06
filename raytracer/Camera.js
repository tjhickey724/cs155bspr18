
class Camera {
  constructor(){
    //this.position = new Vector3(0,0,0)
    this.transform = new Transform()
    this.up = new Vector3(0,1,0)
  }

  translate(q){
    this.transform = this.transform.translate(q)
    //this.position.z += k
  }

  translateZ(k){
    this.transform = this.transform.translate(new Vector3(0,0,k))
  }

  get position(){
    const p = this.transform.transformVec3(new Vector3(0,0,0))
    return p
  }

  lookAt(pos){
    // this isn't working yet.....
    // I have to think about it some more...
    const thispos = this.position
    const zaxis = thispos.subtract(pos).normalize()
    let xaxis = this.up.cross(zaxis).normalize()
    if (xaxis.length()<0.0001) {
      // handle the case of looking straight up or down
      const tempup = new Vector3(0,0,-1)
      xaxis = tempup.cross(zaxis).normalize()
    }
    const yaxis = zaxis.cross(xaxis)

    //console.dir(['xyz axes',xaxis,yaxis,zaxis])
    const trans0 = new Matrix(4,4,
     [[xaxis.x,yaxis.x,zaxis.x,   thispos.x],
      [xaxis.y,yaxis.y,zaxis.y,   thispos.y],
      [xaxis.z,yaxis.z,zaxis.z,   thispos.z],
      [      0,      0,      0,   1]]
     )
    const negthispos = thispos.scale(-1)
    const trans1 = new Matrix(4,4,
    [[xaxis.x,xaxis.y,xaxis.z,   xaxis.dot(negthispos)],
     [yaxis.x,yaxis.y,yaxis.z,   yaxis.dot(negthispos)],
     [zaxis.x,zaxis.y,zaxis.z,   zaxis.dot(negthispos)],
     [      0,      0,      0,   1]]
    )
    const transform = new Transform()
    transform.mat = trans0
    transform.inv = trans1
    //console.dir(['transform',transform])
    this.transform = transform

  }

  createRay(x,y){
    // this creates a ray looking in the negative z direction
    //var p = new Vector3(0,0,0); //this.position;
    var p = new Vector3(0,0,0)
    var d = new Vector3(x,y,-1)
    var r = new Ray3(p,d);
    return r.applyTransform(this.transform);
  }
}
