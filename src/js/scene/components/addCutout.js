import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';

import { app } from '../../state/app.js';

export function addCutout(cutoutParams) {
	const scene = app.scene;
	const cutoutLayers = ['walls','coversInside', 'coversOutside'];

	const cutout = createCutout({ ...cutoutParams });
	cutout.position.set(...getCutoutPosition({ ...cutoutParams }));
	cutout.updateMatrixWorld();

	for (let layer of cutoutLayers) {
		const originalBrush = scene.getObjectByName(layer).getObjectByName(cutoutParams.wallKey);
		const clonedBrush = SkeletonUtils.clone(originalBrush);
		clonedBrush.updateMatrixWorld();

		const evaluator = new Evaluator();
		evaluator.attributes = [ 'position', 'uv' ];
		const result = evaluator.evaluate( clonedBrush, cutout, SUBTRACTION );
		result.name = originalBrush.name;
		result.material.forEach(element => { element.transparent = true; });
		result.castShadow = true;

		originalBrush.removeFromParent();
		scene.getObjectByName(layer).add(result);
	}
}

function createCutout({	wallKey, cutoutWidth, cutoutHeight, cutoutDepth }) {
	let cutoutSize = [ app.normalize(cutoutWidth), app.normalize(cutoutHeight), app.normalize(cutoutDepth) * 2 ];
	if (wallKey === 'W' || wallKey === 'E') {
		cutoutSize = cutoutSize.reverse();
	}

	const geometry = new THREE.BoxGeometry( ...cutoutSize );
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

	const mesh = new Brush( geometry, material );
	
	mesh.receiveShadow = true;
	mesh.castShadow = true;

	return mesh;
}

function getCutoutPosition({ wallKey, cutoutWidth, cutoutHeight, cutoutLeft, cutoutTop }) {

	const shiftX = wallKey === 'N' || wallKey === 'S'
			? app.normalize((app.roomSizeX - cutoutWidth) / 2 - cutoutLeft)
			: app.normalize(app.roomSizeX / 2) + 0.05;

	const shiftY = app.normalize(app.roomHeight - cutoutTop - (cutoutHeight / 2));

	const shiftZ = wallKey === 'N' || wallKey === 'S'
			? app.normalize(app.roomSizeY / 2) + 0.05
			: app.normalize((app.roomSizeY - cutoutWidth) / 2 - cutoutLeft);

	switch (wallKey) {
		case 'N':
			return Array.of( 0 - shiftX, shiftY, 0 - shiftZ );
		case 'S':
			return Array.of( shiftX, shiftY, shiftZ );
		case 'W':
			return Array.of( 0 - shiftX, shiftY, shiftZ );
		case 'E':
			return Array.of( shiftX, shiftY, 0 - shiftZ );
		default:
			throw 'Invalid key';
	}
}