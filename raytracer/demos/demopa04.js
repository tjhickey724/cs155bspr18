

function runTest(){
	canvas.width=900
	canvas.height=900
	const renderer = new Renderer(900,900)
	const scene = new Scene('demopa04')



	const s1 = new Sphere()
	s1.material = new Material(Color.WHITE,Color.WHITE,Color.WHITE)
	s1.material.shininess = 100
	s1.translate(new Vector3(0,1,0))
	scene.addObject(s1)

	s2 = new Rectangle(10,10)
	s2.material = new Material(Color.WHITE,Color.GREEN,Color.WHITE)
	s2.material.shininess = 100
  s2.material.reflectivity = 0.5
	scene.addObject(s2)

  const ground = new Square()
  ground.material = s2.material
  ground
    .scale(new Vector3(10,1,10))
    .rotateX(0.5*Math.PI)
    .translate(new Vector3(0,-1,0))
  scene.addObject(ground)


	const camera = new Camera()
	camera.translate(new Vector3(-10,5,10))
	//camera.transform = camera.transform.rotateX(-30*Math.PI/180)
	//camera.position = new Vector3(0,20,10)
	camera.lookAt(s1.position)

	const light1 = new Light(new Vector3(0,20,0))
	light1.ambientColor = Color.WHITE.scale(0.1)
	light1.diffuseColor = Color.WHITE
	light1.specularColor = Color.RED
	light1.intensity = 1.0
	scene.addLight(light1)

  renderer.render(scene,camera)





}
console.log("just read in demopa04.js")
runTest()
