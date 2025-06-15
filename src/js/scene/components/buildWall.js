import * as THREE from 'three';
import { Brush } from 'three-bvh-csg';

export class buildWall {
	constructor({
		wallLength, 
		wallHeight, 
		wallPosition,
		wallRotation,
		wallThickness,
		texture,
		name,
	}) {
		this.wallLength = wallLength;
		this.wallHeight = wallHeight;
		this.wallThickness = wallThickness;
		this.texture = texture;

		const geometry = new THREE.BufferGeometry();
		geometry.setIndex( new THREE.BufferAttribute(this.getIndices(), 1));
		geometry.setAttribute( 'position', new THREE.BufferAttribute( this.getVertices(), 3 ) );
		geometry.setAttribute( 'uv', new THREE.BufferAttribute( this.getUV(), 2 ) );

		const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, opacity: 1 });
		const mesh = new Brush( geometry, material );
		mesh.castShadow = true;

		mesh.rotation.y = wallRotation;
		mesh.position.set(...wallPosition);
		mesh.name = name;

		this.wall = mesh;
	}

	getVertices() {
		const vertices = new Float32Array(36);

		for (let i of [0, 1]) {
			for (let j = 0; j < 6; j++) {
				if (j === 0) {
					vertices[i * 6 * 3 + j * 3] = 0 - this.wallLength / 2 - this.wallThickness;
				} else if (j === 1 || j === 5) {
					vertices[i * 6 * 3 + j * 3] = 0 - this.wallLength / 2;
				} else if (j === 2 || j === 4) {
					vertices[i * 6 * 3 + j * 3] = this.wallLength / 2;
				} else {
					vertices[i * 6 * 3 + j * 3] = this.wallLength / 2 + this.wallThickness;
				}
				vertices[i * 6 * 3 + j * 3 + 1] = i * this.wallHeight;
				vertices[i * 6 * 3 + j * 3 + 2] = j < 4 ? 0 - this.wallThickness : 0;
			}
		}

		return vertices;
	}

	getIndices() {
		return new Uint16Array([
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
	}

	getUV() {
		return new Float32Array([
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
	}
}