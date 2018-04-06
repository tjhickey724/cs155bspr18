class Matrix{
  constructor(r,c,vals){
    this.r=r
    this.c=c
    this.vals = vals //a list of r rows, each of which is a list of c columns of numbers
  }

  transpose(){
    let trans=[]
    for(let i=0; i<this.c; i++){
      trans[i]=[]
      for(let j=0 ;j<this.r; j++){
        trans[i][j] = this.vals[j][i]
      }
    }
    return new Matrix(this.c,this.r,trans)
  }

  multiply(that){
    const that_trans = that.transpose()
    let product=[]
    for(let r=0; r<this.r; r++){
      product[r]=[]
      for(let c=0; c<that.c; c++){
        product[r][c] = dotprod(this.vals[r], that_trans.vals[c])
      }
    }
    return new Matrix(this.r,that.c,product)
  }

  add(that){
    let sum=[]
    for(let r =0; r<this.r; r++){
      sum[r]=[]
      for(let c=0; c<this.c; c++){
        sum[r][c] = this.vals[r][c]+that.vals[r][c]
      }
    }
    return new Matrix(this.r, this.c,sum)
  }

  subtract(that){
    let sum=[]
    for(let r =0; r<this.r; r++){
      sum[r]=[]
      for(let c=0; c<this.c; c++){
        sum[r][c] = this.vals[r][c]-that.vals[r][c]
      }
    }
    return new Matrix(this.r, this.c, sum)
  }

  scale(k){
    let matrix=[]
    for(let r =0; r<this.r; r++){
      matrix[r]=[]
      for(let c=0; c<this.c; c++){
        matrix[r][c] = this.vals[r][c]*k
      }
    }
    return new Matrix(this.r, this.c, matrix)
  }

  static test(){
    return new Matrix(2,3,[[1,2,3],[4,5,6]])
  }

  toString(){
    let result="["
    for(let r=0; r<this.r; r++){
      result += "["
      for(let c=0; c<this.c; c++){
        result += " "+this.vals[r][c]
      }
      result += "] "
    }
    result += "]"
    return result
  }

  // here are the 4x4 transformation matrices in projective coodrinates

  static translation(vec3){
    return new Matrix(4,4,
    [[1,0,0,vec3.x],
     [0,1,0,vec3.y],
     [0,0,1,vec3.z],
     [0,0,0,1]])
  }

  static rotateX(angle){
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return new Matrix(4,4,
    [[1, 0, 0, 0],
     [0, c,-s, 0],
     [0, s, c, 0],
     [0, 0, 0, 1]])
  }

  static rotateY(angle){
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return new Matrix(4,4,
    [[ c, 0, s, 0],
     [ 0, 1, 0, 0],
     [-s, 0, c, 0],
     [ 0, 0, 0, 1]])
  }

  static rotateZ(angle){
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return new Matrix(4,4,
    [[c,-s, 0, 0],
     [s, c, 0, 0],
     [0, 0, 1, 0],
     [0, 0, 0, 1]])
  }

  static rotation(vec3){
    const x = Matrix.rotateX(vec3.x)
    const y = Matrix.rotateY(vec3.y)
    const z = Matrix.rotateZ(vec3.z)
    return x.multiply(y.multiply(z))
  }

  static scale(vec3){
    const x=vec3.x
    const y=vec3.y
    const z=vec3.z
    return new Matrix(4,4,
    [[x, 0, 0, 0],
     [0, y, 0, 0],
     [0, 0, z, 0],
     [0, 0, 0, 1]])
  }

  static identity(k){
    let id=[]
    for(let r=0; r<k; r++){
      id[r]=[]
      for(let c=0; c<k; c++){
        if (r==c)
          id[r][c] = 1
        else {
          id[r][c] = 0
        }
      }
    }
    return new Matrix(k,k,id)
  }

}

function dotprod(as,bs){
  let sum=0;
  for(let i=0; i<as.length; i++){
    sum += as[i]*bs[i]
  }
  return sum
}
