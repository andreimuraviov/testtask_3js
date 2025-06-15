import * as THREE from 'three';

export function buildHighlighter(wall) {
	const edges = new THREE.EdgesGeometry( wall.geometry ); 
	const materialOptions = { 
		linewidth: 1, 
		color: 0x0d6efd,
		transparent: true,
		opacity: 0,
	};
	const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial(materialOptions) );

	lines.position.set(wall.position.x, wall.position.y, wall.position.z);
	lines.setRotationFromEuler(wall.rotation);
	lines.scale.set(1.001, 1.001, 1.001);
	lines.name = wall.name;

	return lines;
}