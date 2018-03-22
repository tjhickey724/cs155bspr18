
/*
Game 0
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone

*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam;  // we have two cameras in the main scene
	var avatar;
	var suzanne;
	var brs;   //big red sphere
	// here are some mesh objects ...
	var blueCube;
	var ground;

	var cone;
	var npc;

	var endScene, endCamera, endText;





	var controls =
	     {fwd:false, bwd:false, left:false, right:false, up:false,
				speed:10, fly:false, reset:false, avatarCamAngle:Math.PI}

	var gameState =
	     {score:0, health:10, scene:'main', camera:'none' }


	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!




	function createEndScene(){
		endScene = initScene();
		endText = createSkyBox('youwon.png',10);
		//endText.rotateX(Math.PI);
		endScene.add(endText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,1);
		endCamera.lookAt(0,0,0);

	}

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createEndScene();
			initRenderer();
			createMainScene();
	}


	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,100,0);
			camera.lookAt(0,0,0);



			// create the ground and the skybox
			ground = createGround('grass.png');
			scene.add(ground);
			var skybox = createSkyBox('sky.jpg',1);
			scene.add(skybox);

			// create the avatar


      edgeCam = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
      edgeCam.position.set(0,100,100);
			gameState.camera = edgeCam;


			addBalls();

			cone = createConeMesh(4,6);
			cone.position.set(10,3,7);
			scene.add(cone);

			npc = createBoxMesh(0x0000ff);
			npc.position.set(30,5,-30);
			npc.scale.set(1,2,4);
			scene.add(npc);
			console.dir(npc);
			//playGameMusic();
			brs = createBouncyRedSphere();
			brs.position.set(-40,40,40);
			scene.add(brs);
			console.log('just added brs');
			console.dir(brs);

			var platform = createRedBox();
			platform.position.set(0,50,0);
			platform.__dirtyPosition==true;
			scene.add(platform);

			initSuzanneJSON();
			initSuzanneOBJ();
			blueCube = createBlueCube();
			scene.add(blueCube);

			for(i=0; i<10; i++){
				var cube = createGreenCube();
				cube.position.set(-20,i*1.01,-20);
				scene.add(cube);
			}


	}



	function createBlueCube(){
		var geometry = new THREE.BoxGeometry( 2, 2, 2);
		var material = new THREE.MeshLambertMaterial( { color: 0x0000ff} );
		mesh = new Physijs.BoxMesh( geometry, material, 0);
		mesh.position.set(30,5,30);
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createGreenCube(){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: 0x00ff00} );
		var pmaterial = new Physijs.createMaterial(material,0.95,0.05);
		mesh = new Physijs.BoxMesh( geometry, pmaterial);
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		mesh.addEventListener( 'collision',
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				if (other_object==ground){
					console.log("cube hit the ground");
					soundEffect('bad.wav');

				}
			}
		)
		return mesh;
	}

	function createRedBox(){
		var geometry = new THREE.BoxGeometry( 10, 2, 10);
		var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
		mesh = new Physijs.BoxMesh( geometry, material, 0);
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

  function createBouncyRedSphere(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.SphereGeometry( 5, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
		var mass = 10;
    var mesh = new Physijs.SphereMesh( geometry, pmaterial, mass );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;

		mesh.addEventListener( 'collision',
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				if (other_object==avatar){
					console.log("avatar hit the big red ball");
					soundEffect('bad.wav');
					gameState.health = gameState.health - 1;

				}
			}
		)

		return mesh;

	}

	function randN(n){
		return Math.random()*n;
	}




	function addBalls(){
		var numBalls = 2;


		for(i=0;i<numBalls;i++){
			var ball = createBall();
			ball.position.set(randN(20)+15,30,randN(20)+15);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cone){
						console.log("ball "+i+" hit the cone");
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numBalls) {
							gameState.scene='youwon';
						}
            //scene.remove(ball);  // this isn't working ...
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					} else if (other_object == avatar){
						gameState.health += 1;
					}
				}
			)
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
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
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}



	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}



	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry(800, 20, 20 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}

var suzyOBJ;
var theObj;


	function initSuzanneOBJ(){
		var loader = new THREE.OBJLoader();
		loader.load("../models/suzyA.obj",
					function ( obj) {
						console.log("loading obj file");
						console.dir(obj);
						//scene.add(obj);
						obj.castShadow = true;
						suzyOBJ = obj;
						theOBJ = obj;
						// you have to look inside the suzyOBJ
						// which was imported and find the geometry and material
						// so that you can pull them out and use them to create
						// the Physics object ...
						var geometry = suzyOBJ.children[0].geometry;
						var material = suzyOBJ.children[0].material;
						suzyOBJ = new Physijs.BoxMesh(geometry,material);
						suzyOBJ.position.set(20,20,20);
						scene.add(suzyOBJ);
						console.log("just added suzyOBJ");
						//suzyOBJ = new Physijs.BoxMesh(obj);

						//
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

					function(err){
						console.log("error in loading: "+err);}
				)
	}

	function initSuzanneJSON(){
		//load the monkey avatar into the scene, and add a Physics mesh and camera
		var loader = new THREE.JSONLoader();
		loader.load("../models/suzanne.json",
					function ( geometry, materials ) {
						console.log("loading suzanne");
						var material = //materials[ 0 ];
						new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
						//geometry.scale.set(0.5,0.5,0.5);
						suzanne = new Physijs.BoxMesh( geometry, material );

						avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
						gameState.camera = avatarCam;

						avatarCam.position.set(0,6,-15);
						avatarCam.lookAt(0,4,10);
						suzanne.add(avatarCam);
						suzanne.position.set(-40,20,-40);
						suzanne.castShadow = true;
						scene.add( suzanne  );
						avatar=suzanne;
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
					function(err){console.log("error in loading: "+err);}
				)
	}


	function createConeMesh(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var texture = new THREE.TextureLoader().load( '../images/tile.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
		mesh.castShadow = true;
		return mesh;
	}


	function createBall(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		//var material = new THREE.MeshLambertMaterial( { color: 0x444444} );
		var texture = new THREE.TextureLoader().load( '../images/rocks.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 0.1, 0.1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );

		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.SphereMesh( geometry, pmaterial );
		//mesh.setDamping(0,0);
		mesh.castShadow = true;
		return mesh;
	}





	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		//console.log("Keydown: '"+event.key+"'");
		//console.dir(event);
		// first we handle the "play again" key in the "youwon" scene
		if (gameState.scene == 'youwon' && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
			// next reposition the big red sphere (brs)
			brs.position.set(-40,40,40);
			brs.__dirtyPosition = true;
			brs.setLinearVelocity(0,1,0);
			addBalls();
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "m": controls.speed = 30; break;
			case "y": controls.up = true; break;

			case "k":
				avatar.position.set(0,60,0);
				avatar.__dirtyPosition = true;
				console.dir(avatar);
			break;


      case " ": controls.fly = true;
          console.log("space!!");
          break;
      case "h": controls.reset = true; break;

			case ";": gameState.scene = 'youwon'; return;


			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
      case "3": gameState.camera = edgeCam; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "q": controls.avatarCamAngle += Math.PI/8; break;
			case "e": controls.avatarCamAngle -= Math.PI/8; break;
			case "r": avatar.rotation.set(0,0,0); avatar.__dirtyRotation=true;
				console.dir(avatar.rotation); break;

		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
			case "y": controls.up = false; break;
		}
	}

	function updateNPC(){
		npc.lookAt(avatar.position);
	  npc.__dirtyPosition = true;
		if (controls.up){
			npc.setLinearVelocity(0,1,0);
		} else {
		npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(0.05));
	}


	}

  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();



		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }


	}

	function updateSuzyOBJ(){
		var t = clock.getElapsedTime();
		suzyOBJ.material.emissive.r = Math.abs(Math.sin(t));
		suzyOBJ.material.color.b=0
	}



	function animate() {

		requestAnimationFrame( animate );



		switch(gameState.scene) {


			case "youwon":
				endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

			case "main":
				updateAvatar();
				updateNPC();
				updateSuzyOBJ();
				blueCube.rotateY(0.01);
				blueCube.__dirtyRotation= true;
				if (brs.position.y < 0){
					// when the big red sphere (brs) falls off the platform, end the game
					gameState.scene = 'youwon';
				}
        edgeCam.lookAt(avatar.position);
				avatarCam.rotation.set(0,controls.avatarCamAngle,0);
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//draw heads up display ..
	  var info = document.getElementById("info");
		info.innerHTML='<div style="font-size:24pt">Score: ' + gameState.score +
        '  Health:'+ gameState.health
				+ " camAngle:"+(controls.avatarCamAngle/Math.PI*180 -180).toFixed()+
				'</div>';

	}
