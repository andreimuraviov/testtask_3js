import * as THREE from 'three';

export function buildWall({
	wallLength = 2, 
	wallHeight = 1, 
	wallThickness = 0.1
}) {

	// const vertices = new Float32Array([
	// 	-1.1,  0,  -0.1, // v0
	// 	-1.0,  0,  -0.1, // v1
	// 	 1.0,  0,  -0.1, // v2
	// 	 1.1,  0,  -0.1, // v3
	// 	 1.0,  0,   0.0, // v4
	// 	-1.0,  0,   0.0, // v5

	// 	-1.1,  1,  -0.1, // v6
	// 	-1.0,  1,  -0.1, // v7
	// 	 1.0,  1,  -0.1, // v8
	// 	 1.1,  1,  -0.1, // v9
	// 	 1.0,  1,   0.0, // v10
	// 	-1.0,  1,   0.0, // v11

	// ]);

	const vertices = new Float32Array(36);

	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 6; j++) {
			if (j === 0) {
				vertices[i * 6 * 3 + j * 3] = 0 - wallLength / 2 - wallThickness;
			} else if (j === 1 || j === 5) {
				vertices[i * 6 * 3 + j * 3] = 0 - wallLength / 2;
			} else if (j === 2 || j === 4) {
				vertices[i * 6 * 3 + j * 3] = wallLength / 2;
			} else {
				vertices[i * 6 * 3 + j * 3] = wallLength / 2 + wallThickness;
			}
			vertices[i * 6 * 3 + j * 3 + 1] = i * wallHeight;
			vertices[i * 6 * 3 + j * 3 + 2] = j < 4 ? 0 - wallThickness : 0;
		}
	}

	const indices = new Uint16Array([
		2, 1, 7,   // f0
		2, 7, 8,   // f1
		0, 1, 5,   // f2
		1, 2, 5,   // f3
		5, 2, 4,   // f4
		2, 3, 4,   // f5
		6, 11, 7,  // f6
		7, 11, 8,  // f7
		11, 10, 8, // f8
		10, 9, 8,  // f9
		6, 0, 5,   // f10
		6, 5, 11,  // f11
		11, 5, 10, // f12
		5, 4, 10,  // f13
		4, 9, 10,  // f14
		3, 9, 4,   // f15
		0, 6, 1,   // f16
		1, 6, 7,   // f17
		9, 2, 8,   // f18
		9, 3, 2,   // f19
	]);

	const uv = new Float32Array([
		0, 0,    // v0
		0, 0.1,  // v1
		0, 0.9,  // v2
		0, 1,    // v3
		1, 1,    // v4
		1, 0,    // v5
		0, 0.1,  // v6
		0, 0.9,  // v7
		0, 1,    // v8
		1, 1,    // v9
		1, 0,    // v10
		0, 0.1,  // v11
		1, 0,    // v12
	]);

	const geometry = new THREE.BufferGeometry();
	geometry.setIndex( new THREE.BufferAttribute(indices, 1));
	geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.setAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );

	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load('/textures/walls/4.jpg');

	const material = new THREE.MeshBasicMaterial({ map: texture });
	const mesh = new THREE.Mesh( geometry, material );

	return mesh;
}