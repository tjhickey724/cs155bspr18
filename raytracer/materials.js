
class Color {
	// colors are rgb with values between 0.0 and 1.0
	// c.to255()  converts this color into a Javascript 255-based color
	// e.g.  rgb(200,255,0)

	constructor(r,g,b){
		this.r=r
		this.g=g
		this.b=b
	}

	scale(k){
		return new Color(this.r*k, this.g*k, this.b*k)
	}

	add(c){
		return new Color(this.r+c.r,this.g+c.g,this.b+c.b)
	}

	times(c){
		return new Color(this.r*c.r, this.g*c.g, this.b*c.b)
	}

	static average(w,c1,c2){
		// this forms the weighted average of the two colors c1,c2
		return c1.scale(w).add(c2.scale(1-w))
	}

	to255(){
		const r = Math.floor(255*(clamp(this.r,0,1)))
		const g = Math.floor(255*(clamp(this.g,0,1)))
		const b = Math.floor(255*(clamp(this.b,0,1)))
		const s = "rgb("+r+","+g+","+b+")"
		return s
	}

	static grey(t){
		return new Color(t,t,t)
	}

	static get WHITE(){return white	}
	static get RED(){return red	}
	static get GREEN(){return green	}
	static get BLUE(){return blue	}
}

const white =    new Color(1,1,1)
const red =      new Color(1,0,0)
const green =    new Color(0,1,0)
const blue =     new Color(0,0,1)

class Material{
	constructor(ambient, diffuse, specular, shininess){
		this.ambient = ambient
		this.diffuse = diffuse
		this.specular = specular
		this.shininess = shininess
		this.texture='none'
		this.textureWeight=0
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
		return new Material(new Color(0.1,0.1,0.1), new Color(1,1,1), new Color(1,1,1), 256)
	}

}

const whiteMaterial = new Material(Color.WHITE, Color.WHITE, Color.WHITE, 255)




function clamp(x,a,b){
	if (x<a) return a
	if (x>b) return b
	return x
}
