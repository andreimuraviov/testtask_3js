import * as THREE from 'three';
import { addText } from "./addText.js";

export function addFloor({sizeX, sizeY, texture, text}) {
	const geometry = new THREE.PlaneGeometry( sizeX, sizeY );
	const material = new THREE.MeshStandardMaterial({ color: '#ffffff', map: texture });

	const floor = new THREE.Mesh( geometry, material );

	floor.rotation.x = 0 - Math.PI * 0.5;
	floor.position.y = 0;

	floor.receiveShadow = true;
	floor.name = 'floor';

	addText(text, floor);
	
	return floor;
}