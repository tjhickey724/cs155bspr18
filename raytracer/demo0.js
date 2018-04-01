

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(900,900)
	const scene = new Scene('demo0')
	const camera = new Camera()
	camera.translateZ(10)

	const s1 = new Sphere(new Vector3(-2,0,-8),2)
	s1.material = new Material(Color.WHITE,Color.RED,Color.WHITE)
	s1.material.shininess = 100
	scene.addObject(s1)

	s2 = new Sphere(new Vector3(2,2,-12),3)
	s2.material = new Material(Color.WHITE,Color.GREEN,Color.WHITE)
	s2.material.shininess = 500
	scene.addObject(s2)

	s3 = new Sphere(new Vector3(-10,5,-12),3)
	s3.material = new Material(Color.WHITE,Color.WHITE,Color.WHITE)
	s3.material.shininess = 5
	scene.addObject(s3)

	const light1 = new Light(new Vector3(10,10,-10))
	light1.ambientColor = Color.WHITE.scale(0.1)
	light1.diffuseColor = Color.WHITE
	light1.specularColor = Color.WHITE
	light1.intensity = 0.5
	scene.addLight(light1)

	const light2 = new Light(new Vector3(-10,10,0))
	light2.intensity = 0.5
	light2.ambientColor = Color.WHITE.scale(0.1)
	light2.diffuseColor = Color.RED
	light2.specularColor = Color.BLUE
	scene.addLight(light2)

	renderer.render(scene,camera)
}

runTest()
