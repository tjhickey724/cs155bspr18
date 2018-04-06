

class Renderer {
  constructor(w,h,id){
    this.width = w
    this.height = h
    this.id = id || 'canvas'
    this.depth = 1
  }

  drawPixel(i,j,c){
    var canvas = document.getElementById(this.id);
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
      //document.getElementById('status').innerHTML= ""+i+"/"+this.width
      if (i%100==0) console.log('rendered '+i+' of '+this.width)
      for(let j=0; j<this.height; j++){
        const x = 2*i/this.width-1 // x goes from -1 to 1 in this.width steps
        const y = 2*j/this.height-1 // y goes from -1 to 1 in this.height steps
        const r = camera.createRay(x,y) // this creates the ray for pixel (i,j)
        const pixelColor = scene.getColorForRay(r,this.depth)
        this.drawPixel(i,j,pixelColor.to255())
      }
    }
  }
}
