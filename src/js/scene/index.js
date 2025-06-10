import { initScene } from "./components/initScene.js";
import { buildRoom } from './components/roomBuilder.js';

import { appState } from '../state/app.js';

export function roomBuilder (sceneElement) {
	const scene = initScene(sceneElement);

	appState.scene = scene;
	appState.buildRoom = buildRoom;

	appState.buildRoom();
}
