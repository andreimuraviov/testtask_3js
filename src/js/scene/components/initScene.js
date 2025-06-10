import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { appState } from '../../state/app.js';

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
		'floor',
		'walls',
		'coversInside',
		'coversOutside',
		'higlighter'
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
		canvasSize.width = sceneElement.offsetWidth;
		canvasSize.height = sceneElement.offsetHeight;

		camera.aspect = sceneElement.offsetWidth / sceneElement.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( sceneElement.offsetWidth, sceneElement.offsetHeight);
	});

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = Math.PI * 0.40;
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
		resetHighlighting();

		mouse.x = e.offsetX / canvasSize.width * 2 - 1;
		mouse.y = 0 - e.offsetY / canvasSize.height * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const objectsToTest = scene.getObjectByName('walls').children;

		const intersects = raycaster.intersectObjects(objectsToTest);

		if (intersects.length) {
			setHighlighting(intersects[0].object);
		}
	})

	function setHighlighting(wall) {
		const edges = new THREE.EdgesGeometry( wall.geometry ); 
		const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { linewidth: 1, color: 0x0d6efd } ) );
		lines.name = wall.name;
		lines.position.set(wall.position.x, wall.position.y, wall.position.z);
		lines.setRotationFromEuler(wall.rotation);
		lines.scale.set(1.001, 1.001, 1.001);
		scene.getObjectByName('higlighter').add( lines );

		wall.material.opacity = 0.5;
		for (const group of ['coversOutside', 'coversInside']) {
			scene.getObjectByName(group).getObjectByName(wall.name).material.opacity = 0.5;	
		}
	}

	function resetHighlighting() {
		let highlightSide = '';
		const highlightGroup = scene.getObjectByName('higlighter');

		if (highlightGroup.children.length > 0) {
			highlightSide = highlightGroup.children[0].name;
			for (const group of ['walls', 'coversOutside', 'coversInside']) {
				scene.getObjectByName(group).getObjectByName(highlightSide).material.opacity = 1;	
			}
			scene.getObjectByName('higlighter').clear();
		}
	}

	appState.resetHighlighting = resetHighlighting;

	return scene;
}
