import * as THREE from 'three';
import config from './config.js';

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
		Object.keys(this.textures).forEach(key => {
			const textureLoader = this.getTextureLoader();
			this.textures[key].texture = textureLoader.load(this.textures[key].value);
		})
	}

	normalize(value) {
		return value * this.ratio;
	}

	clearScene() {
		if (this.scene) {
			this.scene.getObjectByName('floor') && this.scene.getObjectByName('floor').clear()
			this.scene.getObjectByName('coversInside') && this.scene.getObjectByName('coversInside').clear()
			this.scene.getObjectByName('coversOutside') && this.scene.getObjectByName('coversOutside').clear()
			this.scene.getObjectByName('walls') && this.scene.getObjectByName('walls').clear()
		}
	}

	get roomHeight() {
		return this._roomHeight;
	}

	set roomHeight(value) {
		const numericValue = Number(value);

		if (this._roomHeight !== numericValue) {
			this._roomHeight = numericValue;
			this.clearScene()
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
		if (value) {
			const textureLoader = this.getTextureLoader();
			this.textures[layer].texture = textureLoader.load(value);
			const material = new THREE.MeshBasicMaterial({ map: this.textures[layer].texture });
			this.scene.getObjectByName(layer).children.forEach(item => {
				item.material = material;
			});
		}
	}

	applyCustomImage(type, image) {
		const layer = Object.keys(this.textures).find(item => this.textures[item].type === type);
		this.textures[layer].texture = new THREE.Texture(image);
		this.textures[layer].texture.needsUpdate = true;
		const material = new THREE.MeshBasicMaterial({ map: this.textures[layer].texture });
		this.scene.getObjectByName(layer).children.forEach(item => {
			item.material = material;
		});
	}
}

const appState = new ApplicationState(config);

export { appState };