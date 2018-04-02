
class Camera {
  constructor(){
    this.position = new Vector3(0,0,0)
		this.transform = new Transform()
		this.up = new Vector3(0,1,0)
  }

  translateZ(k){
    this.position.z += k
  }

	lookAt(pos){
		// this isn't working yet.....
		// I have to think about it some more...
		const zaxis = this.position.subtract(pos).normalize()
		const xaxis = this.up.cross(zaxis).normalize()
		const yaxis = zaxis.cross(xaxis)
		console.dir(['xyz axes',xaxis,yaxis,zaxis])
		const trans0 = new Matrix(4,4,
		 [[xaxis.x,yaxis.x,zaxis.x,   0],
		  [xaxis.y,yaxis.y,zaxis.y,   0],
		  [xaxis.z,yaxis.z,zaxis.z,   0],
		  [      0,      0,      0,   1]]
		 )
		console.dir(['trans0',trans0])
		const trans0inv =trans0.transpose()
		const trans1 = new Matrix(4,4,
		 [[1, 0, 0, xaxis.dot(this.position)],
		  [0, 1, 0, yaxis.dot(this.position)],
			[0, 0, 1, zaxis.dot(this.position)],
			[0, 0, 0, 1]]
		)
		console.dir(['trans1',trans1])
		const trans1inv = new Matrix(4,4,
		 [[1, 0, 0, -xaxis.dot(this.position)],
		  [0, 1, 0, -yaxis.dot(this.position)],
			[0, 0, 1, -zaxis.dot(this.position)],
			[0, 0, 0, 1]]
		)
		const transA = trans1.multiply(trans0)
		console.dir(['transA',transA])
		const transAinv = trans0inv.multiply(trans1inv)
		console.dir(['transAinv',transAinv])
		const transform = new Transform()
		transform.mat = transA
		transform.inv = transAinv
		console.dir(['transform',transform])
		this.transform = transform

	}

  createRay(x,y){
    // this creates a ray looking in the negative z direction
    var p = this.position;
    var d = new Vector3(x,y,-1)
    var r = new Ray3(p,d);
    return r.applyTransform(this.transform);
  }
}
