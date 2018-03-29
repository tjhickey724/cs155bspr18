

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(900,900)
	const scene = new Scene('demo1')
	const camera = new Camera()
	camera.translateZ(40)

	const s1 = new Sphere(new Vector3(-2,0,-80),20)
	const s2 = new Sphere(new Vector3(-50,0,-80),10)
	const p1 = new Plane(new Vector3(0,0,-100),new Vector3(100,0,0), new Vector3(0,100,0))
	const p2 = new Plane(new Vector3(60,0,0),new Vector3(0,0,100), new Vector3(0,100,0))
	const light1 = new Light(new Vector3(50,50,-90))
	const light2 = new Light(new Vector3(-50,50,-90))
	light1.intensity = 0.2
	light2.intensity = 0.5
	light2.shininess = 10
	light1.ambientLight=0
	light2.ambientLight=0

	scene.addObject(s1)
	scene.addObject(s2)
	scene.addObject(p1)
	scene.addObject(p2)
	scene.addLight(light1)
	scene.addLight(light2)

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
