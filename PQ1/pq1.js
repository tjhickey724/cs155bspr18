
/*
Practice Quiz 1 solution
*/





	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, camera, renderer;  // all threejs programs need these
	var light1,light2;  // we have two lights

	init(); // initialize these 9 variables
	animate();  // start the animation loop!



	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
		  // these calls define the following global variables
			//     scene, camera, renderer, light1, light2

			initScene();  // sets value of scene
			initRenderer();
			initLight1();
			initLight2();
			initCamera();

			// first we place the camera and lights
			camera.position.set(0,30,50);
			camera.lookAt(0,20,0);
			light1.position.set(35,10,0);  // put a light above the camera!
			light2.position.set(-20,20,50);

			// next we make the floor and walls
			var floor = addFloorMesh();
      floor.rotateX(Math.PI/2);

			var skyB = addSkyMesh();
			var skyL = addSkyMesh();
			var skyR = addSkyMesh();
			skyB.translateZ(-10);
			skyR.translateX(40);
			skyR.rotateY(Math.PI/2);
			skyL.translateX(-40);
			skyL.rotateY(-Math.PI/2);




			// now we add the two balls, box, and cone one on top of the other
			var ball1 = addSphereMesh();
			ball1.position.set(0,4,0);
			ball1.scale.set(4,4,4);
      var ball2 = addSphereMesh();
      ball2.position.set(0,12,0);
      ball2.scale.set(4,4,4);

      var box = addBoxMesh();
      box.scale.set(8,0.5,8);
      box.position.set(0,16,0);

      var cone = addConeMesh();
      cone.position.set(0,18,0);

/*
			var ball2 = addSphereMesh();
			ball2.position.set(0,12,0);
			ball2.scale.set(4,4,4);

			var box1 = addBoxMesh();
			box1.scale.set(8,1,8);
			box1.position.set(0,16,0);

			var cone = addConeMesh();
			cone.position.set(0,18,0);
*/

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
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		//camera.position.z=50;
		//camera.position.y=30;
		//camera.position.x=20;
    camera.position.set(20,30,50);

		camera.lookAt(0,10,0);
	}

	function initLight1(){
		light1 = new THREE.PointLight( 0xffffff);
		light1.position.set(20, 20, 0 );
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


		function addBoxMesh(){
			var geometry = new THREE.BoxGeometry( 1,1,1);
			var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
			mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}

		function addConeMesh(){
			var geometry = new THREE.ConeGeometry( 4, 5, 32);
			var material = new THREE.MeshLambertMaterial( { color: 0x00ff00} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}

		function addCylinderMesh(){
			var geometry = new THREE.CylinderGeometry( 1, 1, 10, 128 );
			var material = new THREE.MeshLambertMaterial( { color: 0x0000ff} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}

		function addSphereMesh(){
			var geometry = new THREE.SphereGeometry( 1, 20, 20);
			var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}


		function addFloorMesh(){
			// creating a textured plane which receives shadows
			var geometry = new THREE.PlaneGeometry( 80, 80, 128 );
			var texture = new THREE.TextureLoader().load( '../images/pebbles.jpg' );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 3, 3 );
			var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
			var mesh = new THREE.Mesh( geometry, material );
			scene.add(mesh);
			mesh.receiveShadow = true;
			return mesh
			// we need to rotate the mesh 90 degrees to make it horizontal not vertical


		}

		function addSkyMesh(){
			// creating a textured plane which receives shadows
			var geometry = new THREE.PlaneGeometry( 80, 80, 128 );
			var texture = new THREE.TextureLoader().load( '../images/sky.jpg' );
			//texture.wrapS = THREE.RepeatWrapping;
			//texture.wrapT = THREE.RepeatWrapping;
			//texture.repeat.set( 3, 3 );
			var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
			var mesh = new THREE.Mesh( geometry, material );
			scene.add(mesh);
			mesh.receiveShadow = true;
			return mesh
			// we need to rotate the mesh 90 degrees to make it horizontal not vertical


		}







  // this approach might speed up your computer
  // by having it do the rendering only every 100 frames...
  var counter =0;
  var frames = 100;

	function animate() {
		requestAnimationFrame( animate );
    if (counter >= frames){
		    renderer.render( scene, camera );
        counter = 0;
        console.log("counting");
    } else {
      counter ++;
    }
	}
