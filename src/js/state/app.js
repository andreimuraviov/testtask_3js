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

		this._coverUrlInside = config.textures.wallsInside.items.find(item => item.default)['value'];
		this._coverUrlOutside = config.textures.wallsOutside.items.find(item => item.default)['value'];
		this._coverUrlFloor = config.textures.floors.items.find(item => item.default)['value'];

		this.textureLoader = null;
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
		return this._coverUrlOutside;
	}

	set coverUrlOutside(value) {
		if (this._coverUrlOutside !== value) {
			this._coverUrlOutside = value;
			this.updateWallCovers('coversOutside', value);
		}
	}

	get coverUrlInside() {
		return this._coverUrlInside;
	}

	set coverUrlInside(value) {
		if (this._coverUrlInside !== value) {
			this._coverUrlInside = value;
			this.updateWallCovers('coversInside', value);
		}
	}

	get coverUrlFloor() {
		return this._coverUrlFloor;
	}

	set coverUrlFloor(value) {
		if (this._coverUrlFloor !== value) {
			this._coverUrlFloor = value;
			this.updateWallCovers('floor', value);		}
	}

	buildRoom() {}

	getTextureLoader() {
		return this.textureLoader || new THREE.TextureLoader();
	}

	updateWallCovers(layer, value) {
		const textureLoader = this.getTextureLoader();
		const texture = textureLoader.load(value);
		const material = new THREE.MeshBasicMaterial({ map: texture });
		this.scene.getObjectByName(layer).children.forEach(item => {
			item.material = material;
		});
	}
}

const appState = new ApplicationState(config);

export { appState };