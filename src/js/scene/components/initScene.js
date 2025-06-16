import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { addGround } from './addGround.js';
import { addLight } from './addLight.js';
import { app } from '../../state/app.js';

export function initScene(sceneElement) {

	const width = sceneElement.offsetWidth;
	const height = sceneElement.offsetHeight;

	const canvasSize = { width, height };

	const camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 100 );
	camera.position.x = -5;
	camera.position.y = 5;
	camera.position.z = 5;

	const scene = new THREE.Scene();
	scene.background = new THREE.Color().setRGB( 0.25, 0.27, 0.3 );

	const groups = [
		'ambience',
		'floor',
		'walls',
		'highlighters'
	];

	for (let groupName of groups) {
		const group = new THREE.Group();
		group.name = groupName;
		scene.add(group);
	}

	addLight(scene.getObjectByName('ambience'));
	addGround(scene.getObjectByName('ambience'));

	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( width, height );
	renderer.shadowMap.enabled = true;

	sceneElement.appendChild( renderer.domElement );

	window.addEventListener('resize', e => {
		canvasSize.width = sceneElement.offsetWidth;
		canvasSize.height = sceneElement.offsetHeight;

		camera.aspect = sceneElement.offsetWidth / sceneElement.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( sceneElement.offsetWidth, sceneElement.offsetHeight);
	});

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = Math.PI * 0.45;
	controls.maxDistance = 15;
	controls.minDistance = 1.5;
	controls.update();

	function tick() {
		renderer.render( scene, camera );
		requestAnimationFrame( tick );
	}

	tick();


	// Raycaster
	const mouse = new THREE.Vector2();
	const raycaster = new THREE.Raycaster();

	sceneElement.addEventListener('mousedown', (e) => {
		app.resetHighlighting();

		mouse.x = e.offsetX / canvasSize.width * 2 - 1;
		mouse.y = 0 - e.offsetY / canvasSize.height * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const objectsToTest = app.scene.getObjectByName('walls').children;

		const intersects = raycaster.intersectObjects(objectsToTest);

		if (intersects.length) {
			app.setHighlighting(intersects[0].object);
		}
	})

	return scene;
}
