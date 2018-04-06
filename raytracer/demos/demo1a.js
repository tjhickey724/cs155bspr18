

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(300,300)
	const scene = new Scene('demo1')


	//const s1 = new Sphere(new Vector3(-2,0,-80),20)
	//const s2 = new Sphere(new Vector3(-50,0,-80),10)
	const s0 = new Sphere()
	s0.scale(new Vector3(1,1,1))
	  .translate(new Vector3(0,0,0))
	scene.addObject(s0)

	const s1 = new Sphere()
	s1.scale(new Vector3(1,1,1))
	  .translate(new Vector3(5,0,0))
	scene.addObject(s1)

	const s2 = new Sphere()
	s2.scale(new Vector3(1,1,1))
	  .translate(new Vector3(0,5,0))
	scene.addObject(s2)

	const p1 = new Square()
	p1
	  .scale(new Vector3(20,20,1))
	  .rotateX(0.7*Math.PI/2)
		//.translate(new Vector3(1,-5,-5))
		//.scale(new Vector3(20,20,1))
	p1.material.diffuse = new Color(0.9,0.4,0.7)
	scene.addObject(p1)

	const p2 = new Square()
	p2.translate(new Vector3(1,-5,0.1))
		.scale(new Vector3(10,5,1))
	p2.material.diffuse = new Color(0.7,0.4,0.9)
	scene.addObject(p2)

	const light1 = new Light(new Vector3(0,70,20))
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
	camera.translate(new Vector3(40,1,10))
	camera.lookAt(s1.position)

	renderer.render(scene,camera)
}

function randNumInRange(a,b){
	// generates a random number in the range [a,b]
	const d = b-a
	const r = Math.random()*d + a
	return r
}

runTest()
