class Texture {
  constructor(url){
    const img = new Image()
    img.src = url
    this.context = 'none'
    this.imageData=[]
    this.repeatU=1
    this.repeatV=1
    //const canvas = document.getElementById('draw')\
    //const img = document.getElementById(imageId)
    let texture = this;
    img.onload = function(){
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      context.drawImage(img,0,0)
      //console.dir(context)
      texture.context = context
      texture.img = img
      texture.imageData = context.getImageData(0,0,img.width,img.height)

      //console.dir(['in loading',texture,this])

    }
  }

  pixel(i,j){
    j = 1-j
    i = Math.floor(i*this.img.width*this.repeatU) % this.img.width
    j = Math.floor(j*this.img.height*this.repeatV) % this.img.height

    //console.log('ij='+i+","+j)
    //this.context = texture1.context
    //this.img = texture1.img
    if (!this.context)  {
      console.dir(['in pixel1',this,this.context,!this.context])
      //console.log(nothing)
      return new Color(1,0.5,0.5)
    }
    if (!this.img) {
      console.dir(['in pixel2',this,this.img,!this.img]);
      //console.log(nothing)
      return new Color(0.5,1,0.5)
    }
    const image = this.imageData //this.context.getImageData(0,0,this.img.width,this.img.height)
    const pos = this.img.width*4*j + 4*i
    if (image==[]) return new Color(0,0,0)
    //console.log('pos='+pos)
    const r = image.data[pos]
    const g = image.data[pos+1]
    const b = image.data[pos+2]
    //console.log(r+" "+g+" "+b)
    const theColor = new Color(r/256.0,g/256.0,b/256.0)
    //console.log(theColor.to255())
    //console.dir([i,j,pos,this.img.width,this.img.height,r,g,b])
    return theColor
  }
}
