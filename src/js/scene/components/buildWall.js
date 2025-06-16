import * as THREE from 'three';
import { Brush } from 'three-bvh-csg';
import { app } from '../../state/app';

export class buildWall {
	constructor({
		wallLength, 
		wallHeight, 
		wallPosition,
		wallRotation,
		wallThickness,
		name,
	}) {
		this.wallLength = wallLength;
		this.wallHeight = wallHeight;
		this.wallThickness = wallThickness;

		const geometry = new THREE.BufferGeometry();
		geometry.setIndex( this.getIndices() );
		geometry.setAttribute( 'position', new THREE.BufferAttribute( this.getVertices(), 3 ) );
		geometry.setAttribute( 'uv', new THREE.BufferAttribute( this.getUV(), 2 ) );

		for (let group of this.getGroups()) {
			const { start, count, materialIndex } = group;
			geometry.addGroup(start, count, materialIndex);
		}

		const mesh = new Brush( geometry, app.getWallsMaterial() );
		mesh.castShadow = true;
		mesh.receiveShadow = true;

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
		return [
			// внешняя стена
			0, 6, 9,   // f0
			3, 0, 9,   // f1

			// внутренняя стена
			11, 5, 10, // f2
			10, 5, 4,  // f3

			// верх
			6, 11, 7,  // f4
			7, 11, 8,  // f5
			11, 10, 8, // f6
			10, 9, 8,  // f7

			// правый скос
			4, 9, 10,  // f8
			3, 9, 4,   // f9

			// левый скос
			6, 0, 5,   // f10
			6, 5, 11,  // f11

			// низ
			0, 1, 5,   // f12
			1, 2, 5,   // f13
			5, 2, 4,   // f14
			2, 3, 4,   // f15
		];
	}

	getGroups() {
		return [
			{ start: 0, count: 6, materialIndex: 0 },
			{ start: 6, count: 6, materialIndex: 1 },
			{ start: 12, count: 36, materialIndex: 2 },
		];
	}

	getUV() {
		return new Float32Array([
			1, 0,    // v0
			1, 1,    // v1
			0, 1,    // v2
			0, 0,    // v3
			1, 0,    // v4
			0, 0,    // v5
			1, 1,    // v6
			1, 1,    // v7
			0, 0,    // v8
			0, 1,    // v9
			1, 1,    // v10
			0, 1,    // v11
		]);
	}
}