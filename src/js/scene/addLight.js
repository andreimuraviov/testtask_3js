import * as THREE from 'three';

export function addLight(scene) {
	const ambientLight = new THREE.AmbientLight( 0xffffff, 0.8 );
	scene.add( ambientLight );

	const shadowLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
	shadowLight.castShadow = true;
	shadowLight.position.set(-4, 8, -2);
	scene.add( shadowLight );
}