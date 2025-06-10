import * as THREE from 'three';

export function addWallCover({ sizeX, sizeY, coverUrl }) {

	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(coverUrl);

	const geometry = new THREE.PlaneGeometry( sizeX, sizeY );
	const material = new THREE.MeshBasicMaterial({ map: texture });

	const cover = new THREE.Mesh( geometry, material );
	cover.position.y = sizeY * 0.5;
	cover.name = 'cover';

	return cover;
}