import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import * as TextureUtils from 'three/addons/utils/WebGLTextureUtils.js';

import config from './config.js';
import { saveToFile, loadJsonFromFile } from '../helpers/files.js';

class Application {
	constructor(config) {
		const {
			roomHeight,
			roomSizeX,
			roomSizeY,
			wallThickness,
			ratio,
		} = config.roomSize;

		this.roomSizeX = roomSizeX;
		this.roomSizeY = roomSizeY;
		this.ratio = ratio;

		this._roomHeight = roomHeight;
		this._wallThickness = wallThickness;

		this.wallKeys = ['N', 'S', 'W', 'E'];
		this.selectedWall = '';

		this.textures = {
			coversOutside: {
				type: 'coverUrlOutside',
				value: config.textures.wallsOutside.items.find(item => item.default)['value'],
			},
			coversInside: {
				type: 'coverUrlInside',
				value: config.textures.wallsInside.items.find(item => item.default)['value'],
			},
			floor: {
				type: 'coverUrlFloor',
				value: config.textures.floors.items.find(item => item.default)['value'],
			},
			walls: {
				type: 'walls',
				value: '/textures/walls/4.jpg',
			}
		}

		this.textureLoader = null;
		this.loadTextures();

		this.cutouts = [];
	}

	loadTextures() {
		for (let key of Object.keys(this.textures)) {
			const textureLoader = this.getTextureLoader();
			this.textures[key].texture = textureLoader.load(this.textures[key].value || this.textures[key].src);
		};
	}

	normalize(value) {
		return value * this.ratio;
	}

	rebuildRoom() {
		this.clearScene();
		this.buildRoom();
	};

	clearScene() {
		if (this.scene) {
			for (let group of ['floor', 'walls', 'highlighters']) {
				this.scene.getObjectByName(group) && this.scene.getObjectByName(group).clear();
			}
		}
		this.clearSelectedWall();
	}

	get roomHeight() {
		return this._roomHeight;
	}

	set roomHeight(value) {
		const numericValue = Number(value);

		if (this._roomHeight !== numericValue) {
			this._roomHeight = numericValue;
			this.rebuildRoom();
		}
	}

	get wallThickness() {
		return this._wallThickness;
	}

	set wallThickness(value) {
		const numericValue = Number(value);

		if (this._wallThickness !== numericValue) {
			this._wallThickness = numericValue;
			this.rebuildRoom();
		}
	}

	get coverUrlOutside() {
		return this.textures.coversOutside.value;
	}

	set coverUrlOutside(value) {
		if (this.textures.coversOutside.value !== value) {
			this.textures.coversOutside.value = value;
			this.updateWallCovers('coversOutside', value);
		}
	}

	get coverUrlInside() {
		return this.textures.coversInside.value;
	}

	set coverUrlInside(value) {
		if (this.textures.coversInside.value !== value) {
			this.textures.coversInside.value = value;
			this.updateWallCovers('coversInside', value);
		}
	}

	get coverUrlFloor() {
		return this.textures.floor.value;
	}

	set coverUrlFloor(value) {
		if (this.textures.floor.value !== value) {
			this.textures.floor.value = value;
			this.updateFloorCover(value);		
		}
	}

	buildRoom() {}

	getTextureLoader() {
		return this.textureLoader || new THREE.TextureLoader();
	}

	updateFloorCover(value) {
		this.resetHighlighting();
		if (value) {
			const textureLoader = this.getTextureLoader();
			this.textures['floor'].src = undefined;
			textureLoader.load(value, texture => {
				this.textures['floor'].texture = texture;
				const material = new THREE.MeshStandardMaterial({ 
					map: texture, 
					transparent: true, 
					opacity: 1 
				});
				this.scene.getObjectByName('floor').traverse(item => {
					if (item.type !== 'Group' && item.name !== 'text') {
						item.material = material.clone();
					}
				});

			});
		}
	}

	getWallsMaterial() {
		return [ 'coversOutside', 'coversInside', 'walls' ].map(item => {
				return new THREE.MeshStandardMaterial({ map: this.textures[item].texture, transparent: true, opacity: 1});
			}
		);
	}

	updateWallCoverMaterial() {
		this.scene.getObjectByName('walls').traverse(item => {
			if (item.type !== 'Group') {
				item.material = this.getWallsMaterial();
			}
		});
	}

	updateWallCovers(layer, value) {
		this.resetHighlighting();
		if (value) {
			const textureLoader = this.getTextureLoader();
			this.textures[layer].src = undefined;
			textureLoader.load(value, texture => {
				this.textures[layer].texture = texture;
				if (this.cutouts.length) {
					this.rebuildRoom();
				} else {
					this.updateWallCoverMaterial();
				}
			});
		}
	}

	applyCustomImage(type, image) {
		const layer = Object.keys(this.textures).find(item => this.textures[item].type === type);
		this.textures[layer].src = image.getAttribute('src');
		this.textures[layer].texture = new THREE.Texture(image);
		this.textures[layer].texture.needsUpdate = true;
		if (this.cutouts.length) {
			this.rebuildRoom();
		} else {
			this.updateWallCoverMaterial();
		}
	}

	exportToFile() {
		const exportObj = {
			roomHeight: this._roomHeight,
			wallThickness: this._wallThickness,
			textures: {},
			cutouts: [ ...this.cutouts ],
		}

		for (let texture of ['coversOutside', 'coversInside', 'floor']) {
			exportObj.textures[texture] = 
				this.textures[texture].src 
					? { src: this.textures[texture].src } 
					: { value: this.textures[texture].value }
		}

		const jsonString = JSON.stringify(exportObj, null, 2);
		saveToFile(jsonString, 'application/json', 'export.json');
	}

	importFromFile(e) {
		loadJsonFromFile(e, importedObj => {
			this._roomHeight = importedObj.roomHeight;
			this._wallThickness = importedObj.wallThickness;
			this.cutouts = [ ...importedObj.cutouts ];

			for (let texture of ['coversOutside', 'coversInside', 'floor']) {
				this.textures[texture].value = '';
				delete this.textures[texture].src;
				this.textures[texture] = { ...this.textures[texture], ...importedObj.textures[texture] };
			}

			this.loadTextures();
			this.rebuildRoom();
			this.updateParameters();
		});
	}

	exportSceneToGLB() {
		const scene = this.scene;
		const exporter = new GLTFExporter().setTextureUtils( TextureUtils );

		const options = {
			trs: false,
			onlyVisible: false,
			binary: true,
		};

		exporter.parse(scene, result => {
			saveToFile(result, 'application/octet-stream', 'room.glb');
		},
		error => {
			console.log(error);
		},
		options);
	}

	setWallOpacity(wallSide, value) {
		for (const group of ['walls']) {
			const material = this.scene.getObjectByName(group).getObjectByName(wallSide).material;
			if (Array.isArray(material)) {
				material.forEach(element => {
					element.opacity = value;
				});
			} else {
				material.opacity = value;
			}
		}
	}

	clearSelectedWall() {
		this.selectedWall = '';
   		this.addCutoutButton.classList.add('nav-link', 'disabled');		
	}

	setHighlighting(wall) {
		const scene = this.scene;

		scene.getObjectByName('highlighters').traverse(item => {
			if (item.type === 'LineSegments' && item.name === wall.name) {
				item.material.opacity = 1;
			}
		});

		this.setWallOpacity(wall.name, 0.6);

		this.selectedWall = wall.name;
   		this.addCutoutButton.classList.remove('nav-link', 'disabled');
	}

	resetHighlighting() {
		const scene = this.scene;
		let highlightSide = '';

		scene.getObjectByName('highlighters').traverse(item => {
			if (item.type === 'LineSegments' && item.material.opacity === 1) {
				highlightSide = item.name;
				item.material.opacity = 0;
			}
		});

		if (highlightSide) {
			this.setWallOpacity(highlightSide, 1);
		}

		this.clearSelectedWall();	
	}

	getWallParameters(name) {
		const roomSizeX = this.normalize(this.roomSizeX);
		const roomSizeY = this.normalize(this.roomSizeY);
		const wallHeight = this.normalize(this.roomHeight);

		switch (name) {
			case 'N':
				return {
					wallLength: roomSizeX,
					wallHeight: wallHeight,
					wallPosition: Array.of( 0, 0, 0 - roomSizeY / 2 ),
					wallRotation: 0,
				}
			case 'S':
				return {
					wallLength: roomSizeX,
					wallHeight: wallHeight,
					wallPosition: Array.of( 0, 0, roomSizeY / 2 ),
					wallRotation: Math.PI * -1,
				}
			case 'W':
				return {
					wallLength: roomSizeY,
					wallHeight: wallHeight,
					wallPosition: Array.of( 0 - roomSizeX / 2, 0, 0 ),
					wallRotation: Math.PI * 0.5,
				}
			case 'E':
				return {
					wallLength: roomSizeY,
					wallHeight: wallHeight,
					wallPosition: Array.of( roomSizeX / 2, 0, 0 ),
					wallRotation: Math.PI * -0.5,
				}
			default:
				throw 'Invalid key';
		}
	}

	addCutout() {}

	updateCutoutsList() {}

	addCutouts(cutoutParams) {
		if (cutoutParams && cutoutParams.cutoutId === '') {
			cutoutParams.wallKey = this.selectedWall;
			cutoutParams.cutoutId = this.cutouts.length;

			this.resetHighlighting();
			
			this.addCutout(cutoutParams);
			this.cutouts.push(cutoutParams);
		} else if (cutoutParams) {
			cutoutParams.cutoutId = Number(cutoutParams.cutoutId);
			const cutoutIndex = this.cutouts.findIndex(item => item.cutoutId === cutoutParams.cutoutId);
			if (cutoutIndex !== -1) {
				this.cutouts[cutoutIndex] = { ...this.cutouts[cutoutIndex], ...cutoutParams };
				this.rebuildRoom();
			}
		} else if (this.cutouts.length) {
			this.cutouts.forEach(item => {
				this.addCutout(item);
			});
		}
		this.updateCutoutsList();
	}

	showCutoutEditForm(target, values) {
		if (this.cutoutEditModal) {
			this.fillCutoutEditForm(values);
			const cutoutEditModal = bootstrap.Modal.getOrCreateInstance(app.cutoutEditModal);
			cutoutEditModal.show(target);
		}
	}

	fillCutoutEditForm(values) {
		values = values || config.cutoutParams;
		const paramKeys = Object.keys(values);
		for (let key of paramKeys) {
			const input = this.cutoutEditModal.querySelector(`#${key}`);
			if (input) {
				input.value = 'cutoutId' in values ? values[key] : values[key].defaultValue;
			}
		}
		if (!('cutoutId' in values)) {
			this.cutoutEditModal.querySelector('#cutoutId').value = '';
			this.cutoutEditModal.querySelector('#cutoutName').value = 
				`${config.cutoutParams.cutoutName.defaultValue} ${this.cutouts.length + 1}`;
			this.cutoutEditModal.querySelector('#cutoutDepth').value = this.wallThickness;
		}
	}

	updateParameters() {
		const updateControlsMap = new Map([
			...Object.keys(config.wallParams).map(key => Array.of(key, config.wallParams[key].roomValue)),
			...Object.keys(config.textures).map(key => Array.of(key, config.textures[key].roomValue)),
		]);

		updateControlsMap.forEach((value, key, map) => {
			const input = this.roomParamsElement.querySelector(`#${key}`);
			if (input) {
				input.value = app[value];
				input.dispatchEvent(new Event('change'));
			}
		});
	}
}

const app = new Application(config);

export { app };