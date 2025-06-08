import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene(sceneElement) {

	const width = sceneElement.offsetWidth;
	const height = sceneElement.offsetHeight;

	const camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 10 );
	camera.position.z = 3;

	const scene = new THREE.Scene();

	const axesHelper = new THREE.AxesHelper( 1 );
	scene.add( axesHelper );

	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( width, height );
	sceneElement.appendChild( renderer.domElement );

	window.addEventListener('resize', e => {
		camera.aspect = sceneElement.offsetWidth / sceneElement.offsetHeight;
		camera.updateProjectionMatrix();
		
		renderer.setSize( sceneElement.offsetWidth, sceneElement.offsetHeight);
	});

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = Math.PI * 0.50;
	controls.update();

	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}

	animate();

	return scene;
}
