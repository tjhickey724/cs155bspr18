
/*
Practice Quiz 1 solution
*/





	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, camera, renderer;  // all threejs programs need these
	var cylinderMesh, planeMesh; // we have some mesh objects
	var light1,light2;  // we have two lights

	var ball,cone;

  var controls = {move:true, turn:false};

	init(); // initialize these 9 variables
	animate();  // start the animation loop!



	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			initScene();
			initRenderer();
			initLight1();
			initLight2();
			initCamera();

			var cyl1 = addCylinderMesh();

			ball = addSphereMesh();
      ball.__dirtyPosition = true;
      ball.__dirtyRotation = true;
			ball.position.set(0,20,-20);
			ball.setLinearVelocity(new THREE.Vector3(0,0,10));
			//ball.scale.set(0.5,0.5,0.5);

			var box = addBoxMesh();
			box.translateX(0);
			box.translateZ(10);

			cone = addConeMesh();
			cone.translateY(6);
			cone.rotateZ(-Math.PI/2);
      cone.__dirtyPosition = true;
      cone.__dirtyRotation = true;
      cone.setAngularVelocity(new THREE.Vector3(0,10,0));
      cone.setLinearVelocity(new THREE.Vector3(0,0,0));

			var plane = addPlaneMesh();
      plane.__dirtyPosition = true;
      plane.__dirtyRotation = true;
			plane.rotateX(Math.PI/2);
			plane.translateZ(5);

	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    scene = new Physijs.Scene();
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
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
		camera.position.z=20;
		camera.position.y=10;
		camera.position.x=20;

		camera.lookAt(0,0,0);
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
		var light2 = new THREE.PointLight( 0xffffff);
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
			var geometry = new THREE.BoxGeometry( 2, 2, 2);
			var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
			mesh = new THREE.Mesh( geometry, material );
      //mesh = new Physijs.BoxMesh( geometry, material,0 );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}

		function addConeMesh(){
			var geometry = new THREE.ConeGeometry( 4, 5, 32);
			var material = new THREE.MeshLambertMaterial( { color: 0x00ff00} );
			//var mesh = new THREE.Mesh( geometry, material );
      var mesh = new Physijs.ConeMesh( geometry, material );
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
			var geometry = new THREE.SphereGeometry( 4, 20, 20);
			var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
			//var mesh = new THREE.Mesh( geometry, material );
      var mesh = new Physijs.SphereMesh( geometry, material );
			mesh.castShadow = true;
			scene.add( mesh );
			return mesh;
		}


		function addPlaneMesh(){
			// creating a textured plane which receives shadows
			var geometry = new THREE.PlaneGeometry( 80, 80, 128 );
			var texture = new THREE.TextureLoader().load( '../images/pebbles.jpg' );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 3, 3 );
			var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
			//var mesh = new THREE.Mesh( geometry, material );
      var mesh = new Physijs.BoxMesh( geometry, material );
			scene.add(mesh);
			mesh.receiveShadow = true;
			return mesh
			// we need to rotate the mesh 90 degrees to make it horizontal not vertical


		}








	function animate() {
		//console.dir(ball.getLinearVelocity());
    //cone.__dirtyRotation = true;
    //cone.rotateX(Math.PI/180*2);
    if (controls.move){
      ball.setLinearVelocity(new THREE.Vector3(0,0,10));
    } else {
      ball.setLinearVelocity(new THREE.Vector3(0,0,0));
    }
    scene.simulate();
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}
