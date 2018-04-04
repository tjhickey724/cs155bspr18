

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
			document.getElementById('status').innerHTML= ""+i+"/"+this.width
			if (i%1==0) console.log('rendered '+i+' of '+this.width)
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
					const uv = intersection.uv
					const mat = obj.material


					const e = camera.position.subtract(p).normalize()
					// now we need to do the lighting calculations
					// this involves the point p, the normal n, and the lights






					let textureColor = new Color(1,1,1)
					if (mat.textureWeight>0){
						//console.dir([intersection,obj,mat,uv])
						textureColor = mat.texture.pixel(uv.u,uv.v)
					}
					let theColor = scene.calculateColor(p,n,e,mat,textureColor)
					//theColor =Color.average(mat.textureWeight,textureColor,theColor)

					/*
						insert the code here to get the color associated to
						intersection.object.uv(intersection.point)
						the average that with the basic material color
					*/

          this.drawPixel(i,j,theColor.to255())
				//	console.dir(intersection); return
        }
      }
    }
  }
}
