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

	clearScene() {
		if (this.scene) {
			for (let group of ['floor', 'coversInside', 'coversOutside', 'walls', 'highlighters']) {
				this.scene.getObjectByName(group) && this.scene.getObjectByName(group).clear();
			}
		}
	}

	get roomHeight() {
		return this._roomHeight;
	}

	set roomHeight(value) {
		const numericValue = Number(value);

		if (this._roomHeight !== numericValue) {
			this._roomHeight = numericValue;
			this.clearScene();
			this.buildRoom();
		}
	}

	get wallThickness() {
		return this._wallThickness;
	}

	set wallThickness(value) {
		const numericValue = Number(value);

		if (this._wallThickness !== numericValue) {
			this._wallThickness = numericValue;
			this.clearScene()
			this.buildRoom();
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
			this.updateWallCovers('floor', value);		}
	}

	buildRoom() {}

	getTextureLoader() {
		return this.textureLoader || new THREE.TextureLoader();
	}

	updateWallCovers(layer, value) {
		this.resetHighlighting();
		if (value) {
			const textureLoader = this.getTextureLoader();
			this.textures[layer].src = undefined;
			textureLoader.load(value, texture => {
				this.textures[layer].texture = texture;
				const material = new THREE.MeshStandardMaterial({ 
					map: texture, 
					transparent: true, 
					opacity: 1 
				});
				this.scene.getObjectByName(layer).traverse(item => {
					if (item.type !== 'Group') {
						item.material = material.clone();
					}
				});

			});
		}
	}

	applyCustomImage(type, image) {
		const layer = Object.keys(this.textures).find(item => this.textures[item].type === type);
		this.textures[layer].src = image.getAttribute('src');
		this.textures[layer].texture = new THREE.Texture(image);
		this.textures[layer].texture.needsUpdate = true;
		const material = new THREE.MeshStandardMaterial({ map: this.textures[layer].texture, transparent: true, opacity: 1 });
		this.scene.getObjectByName(layer).traverse(item => {
			if (item.type !== 'Group') {
				item.material = material.clone();
			}
		});
	}

	exportToFile() {
		const exportObj = {
			roomHeight: this._roomHeight,
			wallThickness: this._wallThickness,
			textures: {}
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

			for (let texture of ['coversOutside', 'coversInside', 'floor']) {
				this.textures[texture].value = '';
				delete this.textures[texture].src;
				this.textures[texture] = { ...this.textures[texture], ...importedObj.textures[texture] };
			}

			this.clearScene();
			this.loadTextures();
			this.buildRoom();
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
		for (const group of ['walls', 'coversOutside', 'coversInside']) {
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

		this.selectedWall = '';
   		this.addCutoutButton.classList.add('nav-link', 'disabled');		
	}

	getWallParameters(name, type = 'walls') {
		const k = type === 'walls' ? 0.5 : type === 'coversInside' ? 0.499 : 0.501;

		const sizeX = type === 'coversOutside' 
			? this.normalize(this.roomSizeX) + this.normalize(this.wallThickness) * 2
			: this.normalize(this.roomSizeX);

		const sizeY = type === 'coversOutside' 
			? this.normalize(this.roomSizeY) + this.normalize(this.wallThickness) * 2
			: this.normalize(this.roomSizeY);

		const posY = type === 'walls' ? 0 : this.normalize(this.roomHeight) * 0.5;

		const rotationAnnex = type === 'coversOutside' ? 0 : 1;

		switch (name) {
			case 'N':
				return {
					wallLength: sizeX,
					wallHeight: this.normalize(this.roomHeight),
					wallPosition: Array.of( 0, posY, 0 - sizeY * k ),
					wallRotation: Math.PI * (1 - rotationAnnex),
				}
			case 'S':
				return {
					wallLength: sizeX,
					wallHeight: this.normalize(this.roomHeight),
					wallPosition: Array.of( 0, posY, sizeY * k ),
					wallRotation: Math.PI * (0 - rotationAnnex),
				}
			case 'W':
				return {
					wallLength: sizeY,
					wallHeight: this.normalize(this.roomHeight),
					wallPosition: Array.of( 0 - sizeX * k, posY, 0 ),
					wallRotation: Math.PI * (rotationAnnex - 0.5),
				}
			case 'E':
				return {
					wallLength: sizeY,
					wallHeight: this.normalize(this.roomHeight),
					wallPosition: Array.of( sizeX * k, posY, 0 ),
					wallRotation: Math.PI * (0.5 + rotationAnnex),
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

			this.updateCutoutsList();
		} else if (cutoutParams) {
			cutoutParams.cutoutId = Number(cutoutParams.cutoutId);
			const cutoutIndex = this.cutouts.findIndex(item => item.cutoutId === cutoutParams.cutoutId);
			if (cutoutIndex !== -1) {
				this.cutouts[cutoutIndex] = { ...this.cutouts[cutoutIndex], ...cutoutParams };
				this.clearScene()
				this.buildRoom();
				this.updateCutoutsList()
			}
		} else if (this.cutouts.length) {
			this.cutouts.forEach(item => {
				this.addCutout(item);
			});
		}
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
		}
	}
}

const app = new Application(config);

export { app };