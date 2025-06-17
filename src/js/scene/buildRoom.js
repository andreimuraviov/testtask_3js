// import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

import { addFloor } from "./addFloor.js";
import { buildWall } from "./buildWall.js";
import { buildHighlighter } from "./buildHighlighter.js";
import { addCutout } from "./addCutout.js";
import { app } from '../state/app.js';

export function buildRoom () {

	const scene = app.scene;

	const { roomSizeX, roomSizeY, roomHeight } = app;

	const floor = addFloor({
		sizeX: app.normalize(roomSizeX),
		sizeY: app.normalize(roomSizeY),
		texture: app.textures['floor'].texture,
		text: `${roomSizeX * roomSizeY * 0.0001} м²`
	});

	// const ceiling = SkeletonUtils.clone(floor);
	// ceiling.receiveShadow = false;
	// ceiling.rotation.x = Math.PI * 0.5;
	// ceiling.position.set(0, app.normalize(roomHeight), 0);

	scene.getObjectByName('floor').add( floor );

	for (let key of app.wallKeys) {
		const { wall } = new buildWall({
			...app.getWallParameters(key, 'walls'),
			name: key,
		});
		scene.getObjectByName('walls').add(wall);

		const higlighter = buildHighlighter(wall);
		scene.getObjectByName('highlighters').add(higlighter);
	}

	app.addCutout = addCutout;
	app.addCutouts();
}