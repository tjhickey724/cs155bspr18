

texture1 = new Texture('/images/wood.jpg')
texture2 = new Texture('/images/earth.jpg')

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(900,900)
	const scene = new Scene('demo1c')

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
	s0.scale(new Vector3(1,1,1))

	scene.addObject(s0)

	const s1 = new Sphere()
	s1.translate(new Vector3(10,2,10))
		.rotateY(-Math.PI*0.5)
	  .scale(new Vector3(5,5,5))
	s1.material=mat2
	scene.addObject(s1)

	const s2 = new Sphere()
	s2.material = mat2
	s2.translate(new Vector3(0,0,5))
	  .scale(new Vector3(1,1,1))

	scene.addObject(s2)

	const p1 = new Square()
	p1.material = mat1
	p1.rotateX(Math.PI/2)
	  .translate(new Vector3(0,-0.05,10))
		.scale(new Vector3(100,100,100))



	scene.addObject(p1)


	const light1 = new Light(new Vector3(5,5,10))
	light1.intensity = 0.5
	light1.diffuseColor = Color.WHITE
	light1.specularColor = Color.RED
	scene.addLight(light1)

	const light2 = new Light(new Vector3(0,50,50))
	light2.intensity = 0.5
	light2.diffuseColor = Color.WHITE
	light2.specularColor = Color.BLUE
	scene.addLight(light2)

	const camera = new Camera()
	camera.translate(new Vector3(-5,2,1))
	camera.lookAt(s1.position)

	renderer.render(scene,camera)
}

setTimeout(runTest, 1000)
