import { initScene } from "./initScene.js";
import { buildRoom } from './buildRoom.js';

import { app } from '../state/app.js';

export function roomBuilder (sceneElement) {
	const scene = initScene(sceneElement);

	app.scene = scene;
	app.buildRoom = buildRoom;

	app.buildRoom();
}
