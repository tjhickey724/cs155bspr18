

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(300,300)
	const scene = new Scene('demo1')
	const camera = new Camera()


	const s1 = new Sphere()
  s1.rotateZ(Math.PI/4)
	  .scale(new Vector3(5,10,1))
    .translate(new Vector3(0,2,-10))
	scene.addObject(s1)

	const s2 = new Sphere()
	s2.scale(new Vector3(5,5,5))
    .translate(new Vector3(5,0,0))
	scene.addObject(s2)

	const p1 = new Square()
	p1.scale(new Vector3(10,5,1))
	p1.translate(new Vector3(0,0,0))
	scene.addObject(p1)

	const p1a = new Square()
	p1a.scale(new Vector3(10,5,1))
	p1a.translate(new Vector3(0,-1.1,0))
	scene.addObject(p1a)

	const p2 = new Square()
	p2.scale(new Vector3(5,10,1))
	//p2.rotateY(Math.PI/4)
	p2.material.diffuse = new Color(1,1,0)
	p2.translate(new Vector3(-1,1,0))
	scene.addObject(p2)


	const light1 = new Light(new Vector3(0,0,20))
	const light2 = new Light(new Vector3(-50,50,50))
	light1.intensity = 0.9
	light2.intensity = 0.9
	light1.diffuseColor = Color.GREEN
	light1.specularColor = Color.RED
	light2.diffuseColor = Color.BLUE
	light2.specularColor = Color.WHITE


	scene.addLight(light1)
	scene.addLight(light2)
	camera.translate(new Vector3(0,10,30))
	camera.lookAt(new Vector3(0,0,0))

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
