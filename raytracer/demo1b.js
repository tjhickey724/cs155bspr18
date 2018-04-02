

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(300,300)
	const scene = new Scene('demo1')
	const camera = new Camera()
	camera.translateZ(120)

	const s1 = new Sphere(new Vector3(0,0,0),1)
	const s2 = new Sphere(new Vector3(0,0,0),1)
	const p1 = new Plane(new Vector3(0,0,-100),new Vector3(100,0,0), new Vector3(0,100,0))
	const p2 = new Plane(new Vector3(60,0,0),new Vector3(0,0,100), new Vector3(0,100,0))
	const light1 = new Light(new Vector3(0,70,-20))
	const light2 = new Light(new Vector3(-50,50,-50))
	light1.intensity = 0.9
	light2.intensity = 0.9
	light1.diffuseColor = Color.WHITE.scale(0.4)
	light1.specularColor = Color.RED
	light2.diffuseColor = Color.BLUE.scale(0.2)
	light2.specularColor = Color.BLUE

	scene.addObject(s1)
	scene.addObject(s2)
	scene.addObject(p1)
	scene.addObject(p2)
	scene.addLight(light1)
	scene.addLight(light2)

	s1.transform =
		 s1.transform
				.translate(new Vector3(-2,0,-80))
				.rotateZ(Math.PI/4)
				.rotateX(Math.PI/3)
				.scale(new Vector3(40,5,10))

	s2.transform =
		s2.transform
			.translate(new Vector3(-50,0,-80))
			.scale(new Vector3(20,20,10))


	for(let i=0; i<0;i++){
		const a = randNumInRange(-50,50)
		const b = randNumInRange(-50,50)
		const c = randNumInRange(-100,-50)
		scene.addObject(new Sphere(new Vector3(a,b,c),randNumInRange(10,10)))
		console.log("adding"+JSON.stringify([a,b,-c]));
	}

	renderer.render(scene,camera)
}

function randNumInRange(a,b){
	// generates a random number in the range [a,b]
	const d = b-a
	const r = Math.random()*d + a
	return r
}

runTest()
