import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initScene(sceneElement) {

	const width = sceneElement.offsetWidth;
	const height = sceneElement.offsetHeight;

	const camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 100 );
	camera.position.x = -5;
	camera.position.y = 5;
	camera.position.z = 5;

	camera.layers.enableAll();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color().setRGB( 0.25, 0.27, 0.3 );

	const groups = [
		'floor',
		'walls',
		'coversInside',
		'coversOutside'
	];

	for (let groupName of groups) {
		const group = new THREE.Group();
		group.name = groupName;
		scene.add(group);
	}

	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( width, height );
	sceneElement.appendChild( renderer.domElement );

	window.addEventListener('resize', e => {
		camera.aspect = sceneElement.offsetWidth / sceneElement.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( sceneElement.offsetWidth, sceneElement.offsetHeight);
	});

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = Math.PI * 0.40;
	controls.update();

	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}

	animate();

	return scene;
}
