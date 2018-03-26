

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(900,900)
	const scene = new Scene('demo0')
	const camera = new Camera()
	camera.translateZ(10)
	const s1 = new Sphere(new Vector3(-2,0,-8),2)
	scene.addObject(s1)
	const s2 = new Sphere(new Vector3(2,0,-9),3)
	scene.addObject(s2)
	renderer.render(scene,camera)
}

runTest()
