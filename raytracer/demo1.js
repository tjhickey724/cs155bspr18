

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(900,900)
	const scene = new Scene('demo1')
	const camera = new Camera()
	camera.translateZ(100)
	const s1 = new Sphere(new Vector3(-2,0,-8),2)
	const s2 = new Sphere(new Vector3(2,0,-8),2)
	const p1 = new Plane(new Vector3(0,-20,-100),new Vector3(100,0,0), new Vector3(0,100,0))
	const p2 = new Plane(new Vector3(20,0,-100),new Vector3(0,0,100), new Vector3(0,100,0))

	scene.addObject(s1)
	scene.addObject(s2)
	scene.addLight(new Light(new Vector3(-50,200,50)))
	scene.addObject(p1)
	scene.addObject(p2)
	for(let i=0; i<10;i++){
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
