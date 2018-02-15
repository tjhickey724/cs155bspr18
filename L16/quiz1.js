
/*
Quiz 1
*/

	// these are needed for the FlyController
  var controls,clock;

	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, camera, renderer;  // all threejs programs need these
	var light1,light2;  // we have two lights
  var ring2;

	init(); // initialize these 9 variables
	animate();  // start the animation loop!



	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
		  // these calls define the following global variables
			//     scene, camera, renderer, light1, light2

			initScene();
			initRenderer();
			camera = addCamera();
			initControls(camera);



			var light1 = addLight(0xffffff);
			light1.position.set(5,100,-40)


			var light2 = addLight(0xffffff);
			light2.position.set(10,40,30)
			//initLight2();

			var ambient = new THREE.AmbientLight(0xffffff,0.5);
			scene.add(ambient);



			//camera.position.set(0,20,50);  camera.lookAt(0,10,0); // from in front
			//camera.position.set(0,100,500);  camera.lookAt(0,100,0); // from far in front
			//camera.position.set(0,100,0);  camera.lookAt(0,10,0); // from above
			//camera.position.set(5,100,-40);  camera.lookAt(0,10,0); // from light2
			//camera.position.set(10,40,30);  camera.lookAt(0,10,0); // from light 1



			// next we make the floor and walls
			var floor = addPlaneMesh(3,3,'/images/tile.jpg');
			floor.scale.set(150,60,1);
			floor.rotateX(Math.PI/2);
			floor.translateY(-10);

			var sky = addPlaneMesh(1,1,'/images/sky.jpg');
			sky.scale.set(600,600,1);
			sky.position.set(0,100,-100);
			sky.receiveShadow=false;


			var ring1 = addTorusMesh(0x0000ff);
			ring1.scale.set(6,6,6);
			ring1.position.set(-4,8,0);

		  ring2 = addTorusMesh(0xff0000);
			ring2.scale.set(6,6,6);
			ring2.position.set(4,8,0);
			ring2.rotateX(Math.PI/2);

			var box1 = addBoxMesh(0x00aa00);
			box1.scale.set(4,20,4);
			box1.position.set(-30,10,0);

			var box2 = addBoxMesh(0x00aa00);
			box2.scale.set(4,20,4);
			box2.position.set(30,10,0);

			var box3 = addBoxMesh(0xffff00);
			box3.scale.set(56,4,4);
			box3.position.set(0,18,0);



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
	function addCamera(){
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.z=50;
		camera.position.y=30;
		camera.position.x=20;

		camera.lookAt(0,10,0);
		return camera;
	}

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
  }

	function keydown(event){
		console.log("Keydown:"+event);
		console.dir(event.key);
		switch (event.key){
			case "w": camera.translateZ(-1); break;
			case "s": camera.translateZ(1); break;
      case "a": camera.position.x -= 1; break;
      case "d": camera.position.x += 1; break;
			case "ArrowRight": ring2.rotateX(-0.1); break;
			case "ArrowLeft": ring2.rotateX(0.1); break;

		}

	}

	function addLight(color){
		var light = new THREE.PointLight(color);
		light.position.set(20, 20, 0 );
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		// add it to the scenes
		scene.add( light );
		return light;
	}

	function addAmbientLight(color,intensity){
		var light = new THREE.AmbientLight(color);
		// add it to the scenes
		scene.add( light );
		return light;
	}


	function initLight2(){
		light2 = new THREE.PointLight( 0xffffff);
		light2.position.set( 0, 20, 20 );
		light2.castShadow = true;
		//Set up shadow properties for the light
		light2.shadow.mapSize.width = 2048;  // default
		light2.shadow.mapSize.height = 2048; // default
		light2.shadow.camera.near = 0.5;       // default
		light2.shadow.camera.far = 500      // default
		// add it to the scene
		scene.add( light2 );
	}


		function addBoxMesh(color){
			var geometry = new THREE.BoxGeometry( 1,1,1);
			var material = new THREE.MeshLambertMaterial( { color: color} );
			mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}

		function addConeMesh(color){
			var geometry = new THREE.ConeGeometry( 1, 1, 32);
			var material = new THREE.MeshLambertMaterial( { color: color} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}

		function addCylinderMesh(color){
			var geometry = new THREE.CylinderGeometry( 1, 1, 10, 128 );
			var material = new THREE.MeshLambertMaterial( { color: color} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}

		function addSphereMesh(color){
			var geometry = new THREE.SphereGeometry( 1, 20, 20);
			var material = new THREE.MeshLambertMaterial( { color: color} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}

		function addPlaneMesh(s,t,image){
			"create a plane mesh with the image repeated in an sxt grid"
			// creating a textured plane which receives shadows

			var geometry = new THREE.PlaneGeometry( 1,1, 128 );
			var texture = new THREE.TextureLoader().load(image );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( s, t );
			var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
			var mesh = new THREE.Mesh( geometry, material );
			scene.add(mesh);
			mesh.receiveShadow = true;
			return mesh
			// we need to rotate the mesh 90 degrees to make it horizontal not vertical
		}

		function addTorusMesh(color){
			var geometry = new THREE.TorusGeometry( 1,0.2,32,32);
			var material = new THREE.MeshLambertMaterial( { color: color} );
			mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			mesh.castShadow = true;
			return mesh;
		}












	function animate() {
		requestAnimationFrame( animate );


		var delta = clock.getDelta();
		//controls.movementSpeed = 10; controls.update( delta );


		renderer.render( scene, camera );
	}
