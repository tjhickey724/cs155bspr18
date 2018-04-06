

texture0 = new Texture('/images/grass.png')
texture1 = new Texture('/images/sky.jpg')
texture2 = new Texture('/images/earth.jpg')

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(300,300)
	const scene = new Scene('demo1c')

	const mat0 = Material.standard()
	mat0.texture = texture0
	mat0.textureWeight = 0.5
	mat0.texture.repeatU=1
	mat0.texture.repeatV=1

	const mat1 = Material.standard()
	mat1.texture = texture1
	mat1.textureWeight = 0.5
	mat1.texture.repeatU=2
	mat1.texture.repeatV=2

	const mat2 = Material.standard()
	mat2.texture = texture2
	mat2.textureWeight = 0.5
	mat2.texture.repeatU=1
	mat2.texture.repeatV=1




	//const s1 = new Sphere(new Vector3(-2,0,-80),20)
	//const s2 = new Sphere(new Vector3(-50,0,-80),10)
	const s0 = new Sphere()
	s0.material = mat2
	//s0.translate(new Vector3(25,5,25)).scale(new Vector3(3,3,3))
	//scene.addObject(s0)

	const w = 2
	const h = 2
	const d = 2
	const g = 4

	const ground = new Rectangle(g,g)
	ground.material = mat0
	ground
	  .rotateX(0.5*Math.PI)

		//.scale(new Vector3(g,g,g))
	console.dir(ground)
	scene.addObject(ground)

	const back = new Square()
	back.material=mat1
	back.scale(new Vector3(w,h,1))
	scene.addObject(back)

	const p1 = new Square()
	p1.material = mat1
	p1.translate(new Vector3(0,0,0))
	  .rotateY(-0.5*Math.PI)
		.scale(new Vector3(d,h,1))
	scene.addObject(p1)

	const p1a = new Square()
	p1a.material = mat1
	p1a.translate(new Vector3(w,0,0))
	   .rotateY(-0.5*Math.PI)
		 .scale(new Vector3(d,h,1))

		//.scale(new Vector3(100,100,1))
	scene.addObject(p1a)

	const p2 = new Square()
	p2.material = mat1
	p2.translate(new Vector3(1,0,0))
	  .rotateY(0.25*Math.PI)
		.scale(new Vector3(100,100,1))
	//scene.addObject(p2)

	const p3 = new Square()
	p3.material = mat1
	p3
		.rotateX(Math.PI/2)
		//.translate(new Vector3(-0.5,0,-0.5))
		//.scale(new Vector3(4,4,4))
		//.translate(new Vector3(0,-0.1,0))
	//scene.addObject(p3)


	const light1 = new Light(new Vector3(-10,10,10))
	light1.intensity = 1
	light1.diffuseColor = Color.WHITE
	light1.specularColor = Color.RED
	scene.addLight(light1)

	const light2 = new Light(new Vector3(2,2,2))
	light2.intensity = 1
	light2.diffuseColor = Color.WHITE
	light2.specularColor = Color.BLUE
	scene.addLight(light2)

	const camera = new Camera()
	camera.translate(new Vector3(0.1,3,5))
	camera.lookAt(new Vector3(0,2,0))

	const light3 = new Light(camera.position)
	light3.intensity = 1
	light3.diffuseColor = Color.WHITE
	light3.specularColor = Color.BLUE
	scene.addLight(light3)

	renderer.render(scene,camera)
}

setTimeout(runTest, 1000)
