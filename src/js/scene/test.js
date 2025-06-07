import * as THREE from 'three';

export function testThreeJs(element) {
	const width = element.offsetWidth;
	const height = element.offsetHeight;

	// init

	const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
	camera.position.z = 1;

	const scene = new THREE.Scene();

	const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	const material = new THREE.MeshNormalMaterial();

	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( width, height );
	renderer.setAnimationLoop( animate );
	// animateStatic();
	
	element.appendChild( renderer.domElement );

	window.addEventListener('resize', (event) => {
		renderer.setSize( element.offsetWidth, element.offsetHeight);
	});

	// animation

	function animate( time ) {

		mesh.rotation.x = time / 2000;
		mesh.rotation.y = time / 1000;

		renderer.render( scene, camera );

	}

	// function animateStatic() {
	// 	requestAnimationFrame(animateStatic);
	// 	renderer.render(scene, camera);
	// }

}

