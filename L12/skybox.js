
/*
Practice Quiz 1 solution
*/





	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, camera, renderer;  // all threejs programs need these
	var cylinderMesh, planeMesh; // we have some mesh objects
	var light1,light2,cameraLight;  // we have two lights

	init(); // initialize these 9 variables
	animate();  // start the animation loop!



	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
			initScene();
			initRenderer();
			initLight1();
			initLight2();
			initCamera();
			initCameraLight();
			//setCam1(1000,1000,1000);

			initCylinderMesh();  // create the skybox
			initPlaneMesh();  // create the ground


	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		scene = new THREE.Scene();
	}

	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}

	/*
		We use a perspective camera raised 4 units and set back 20, looking at (0,0,0)
	*/
	function initCamera(){
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
		camera.position.z = 20;
		camera.position.y=10;
		camera.lookAt(0,10,0);
	}

	function initCameraLight(){
		cameraLight = new THREE.PointLight( 0xaaaaff,3);
		scene.add( cameraLight );
	}

	function setCam1(x,y,z){
		camera.position.set(x,y,z);
		camera.lookAt(0,0,0);
		cameraLight.position.set(x,y,z);
	}

	function initLight1(){
		light1 = new THREE.PointLight( 0xaaaaff);
		light1.position.set( 0, 40, 0 );
		light1.castShadow = true;
		//Set up shadow properties for the light
		light1.shadow.mapSize.width = 2048;  // default
		light1.shadow.mapSize.height = 2048; // default
		light1.shadow.camera.near = 0.5;       // default
		light1.shadow.camera.far = 500      // default
		// add it to the scenes
		scene.add( light1 );
	}


	function initLight2(){
		var light2 = new THREE.PointLight( 0xffaaaa);
		light2.position.set( -10, 10, 10 );
		light2.castShadow = true;
		//Set up shadow properties for the light
		light2.shadow.mapSize.width = 2048;  // default
		light2.shadow.mapSize.height = 2048; // default
		light2.shadow.camera.near = 0.5;       // default
		light2.shadow.camera.far = 500      // default
		// add it to the scene
		scene.add( light2 );
	}




	function initCylinderMesh(){
		//var cubeGeometry = new THREE.BoxGeometry( 100, 100, 100 );
		var cubeGeometry = new THREE.CylinderGeometry( 400, 400, 1000, 128 );
		var texture = new THREE.TextureLoader().load( '../images/sky.jpg' );
		//texture.wrapS = THREE.RepeatWrapping;
		//texture.wrapT = THREE.RepeatWrapping;
		//texture.repeat.set( 4, 4 );
		var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xaaaaaa,  map: texture ,side:THREE.DoubleSide} );

		//var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
		cylinderMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
		cylinderMesh.position.x = 0;
		cylinderMesh.position.y = 0;
		cylinderMesh.position.z = 0;
		scene.add( cylinderMesh );
	}


		function initPlaneMesh(){
			// creating a textured plane which receives shadows
			var geometry = new THREE.PlaneGeometry( 800, 800, 128 );
			var texture = new THREE.TextureLoader().load( '../images/pebbles.jpg' );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 30, 30 );
			var material = new THREE.MeshLambertMaterial( { color: 0xaaaaaa,  map: texture ,side:THREE.DoubleSide} );
			planeMesh = new THREE.Mesh( geometry, material );
			planeMesh.position.y = -50;
			scene.add(planeMesh);
			// we need to rotate the mesh 90 degrees to make it horizontal not vertical
			planeMesh.rotation.x = -Math.PI/2;
			planeMesh.receiveShadow = true;
			planeMesh.castShadow = true;
		}








	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}
