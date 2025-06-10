import * as THREE from 'three';

export function addWallCover({ sizeX, sizeY, texture }) {

	const geometry = new THREE.PlaneGeometry( sizeX, sizeY );
	const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 });

	const cover = new THREE.Mesh( geometry, material );
	cover.position.y = sizeY * 0.5;
	cover.name = 'cover';

	return cover;
}