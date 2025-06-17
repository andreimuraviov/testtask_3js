import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export function addText(str, parent) {
	const fontLoader = new FontLoader();
	fontLoader.load('/fonts/roboto_regular.json', (font) => {
		const geometry = new TextGeometry( str, {
			font,
			size: 0.4,
			depth: 0.005,
			curveSegments: 5,
			bevelEnabled: false,
		});

		const material = new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.5 });
		const text = new THREE.Mesh( geometry, material );

		geometry.computeBoundingBox();

		for (let coordinate of ['x', 'y']) {
			text.position[coordinate] = 0 - (geometry.boundingBox.max[coordinate] - geometry.boundingBox.min[coordinate]) * 0.5;
		}

		text.name = 'text';

		parent.add(text);
	});
}
