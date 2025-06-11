import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import * as TextureUtils from 'three/addons/utils/WebGLTextureUtils.js';

import config from './config.js';
import { saveToFile, loadJsonFromFile } from '../helpers/files.js';

class ApplicationState {
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
			for (let group of ['floor', 'coversInside', 'coversOutside', 'walls', 'higlighter']) {
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

	resetHighlighting() {}

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
				this.scene.getObjectByName(layer).children.forEach(item => {
					item.material = material.clone();
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
		this.scene.getObjectByName(layer).children.forEach(item => {
			item.material = material.clone();
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

	setHighlighting(wall) {
		const scene = this.scene;
		const edges = new THREE.EdgesGeometry( wall.geometry ); 
		const lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { linewidth: 1, color: 0x0d6efd } ) );
		lines.name = wall.name;
		lines.position.set(wall.position.x, wall.position.y, wall.position.z);
		lines.setRotationFromEuler(wall.rotation);
		lines.scale.set(1.001, 1.001, 1.001);
		scene.getObjectByName('higlighter').add( lines );

		wall.material.opacity = 0.5;
		for (const group of ['coversOutside', 'coversInside']) {
			scene.getObjectByName(group).getObjectByName(wall.name).material.opacity = 0.5;	
		}
	}

	resetHighlighting() {
		const scene = this.scene;
		let highlightSide = '';
		const highlightGroup = scene.getObjectByName('higlighter');

		if (highlightGroup.children.length > 0) {
			highlightSide = highlightGroup.children[0].name;
			for (const group of ['walls', 'coversOutside', 'coversInside']) {
				scene.getObjectByName(group).getObjectByName(highlightSide).material.opacity = 1;	
			}
			scene.getObjectByName('higlighter').clear();
		}
	}

}

const appState = new ApplicationState(config);

export { appState };