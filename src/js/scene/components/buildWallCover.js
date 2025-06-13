import * as THREE from 'three';

export class buildWallCover {
	constructor({
		wallLength, 
		wallHeight, 
		wallPosition,
		wallRotation,
		texture,
		name,
	}) {

		const geometry = new THREE.PlaneGeometry( wallLength, wallHeight );
		const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, opacity: 1 });

		const cover = new THREE.Mesh( geometry, material );
		
		cover.rotation.y = wallRotation;
		cover.position.set(...wallPosition);
		cover.name = name;

		cover.receiveShadow = true;

		this.wallCover = cover;
	}

}