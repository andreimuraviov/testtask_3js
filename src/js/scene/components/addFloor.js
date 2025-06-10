import * as THREE from 'three';

export function addFloor({sizeX, sizeY, coverUrl}) {
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(coverUrl);

	const geometry = new THREE.PlaneGeometry( sizeX, sizeY );
	const material = new THREE.MeshBasicMaterial({ map: texture });

	const floor = new THREE.Mesh( geometry, material );

	floor.rotation.x = 0 - Math.PI * 0.5;
	floor.position.y = 0;

	floor.name = 'floor';
	
	return floor;
}