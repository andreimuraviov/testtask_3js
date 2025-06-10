import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

import { addFloor } from "./addFloor.js";
import { buildWall } from "./buildWall.js";
import { addWallCover } from "./addWallCover.js";
import { addText } from "./addText.js";

import { appState } from '../../state/app.js';

export function buildRoom () {

	const scene = appState.scene;
	const { 
		roomSizeX, 
		roomSizeY, 
		wallThickness, 
		roomHeight,
	} = appState;

	// Floor
	
	const floor = addFloor({
		sizeX: appState.normalize(roomSizeX),
		sizeY: appState.normalize(roomSizeY),
		texture: appState.textures['floor'].texture
	});

	// Text

	addText(`${roomSizeX * roomSizeY * 0.0001} м²`, floor);

	// Wall 1

	const wallShortLeft = buildWall({
		wallLength: appState.normalize(roomSizeY),
		wallHeight: appState.normalize(roomHeight),
		wallThickness: appState.normalize(wallThickness),
		texture: appState.textures['walls'].texture
	});
	wallShortLeft.rotation.y = 0 - Math.PI * 0.5;
	wallShortLeft.position.set(appState.normalize(roomSizeX) * 0.5, 0, 0);
	wallShortLeft.name = 'E';

	// Wall 2

	const wallShortRight = SkeletonUtils.clone(wallShortLeft);
	wallShortRight.material = wallShortLeft.material.clone();
	wallShortRight.rotation.y = Math.PI * 0.5;
	wallShortRight.position.set(0 - appState.normalize(roomSizeX) * 0.5, 0, 0);
	wallShortRight.name = 'W';

	// Wall 3

	const wallLongLeft = buildWall({
		wallLength: appState.normalize(roomSizeX),
		wallHeight: appState.normalize(roomHeight),
		wallThickness: appState.normalize(wallThickness),
		texture: appState.textures['walls'].texture
	});
	wallLongLeft.position.set(0, 0, 0 - appState.normalize(roomSizeY) * 0.5);
	wallLongLeft.name = 'N';

	// Wall 4

	const wallLongRight = SkeletonUtils.clone(wallLongLeft);
	wallLongLeft.material = wallLongRight.material.clone();
	wallLongRight.rotation.y = Math.PI;
	wallLongRight.position.set(0, 0, appState.normalize(roomSizeY) * 0.5);
	wallLongRight.name = 'S';

	// Wall covers

	const cover1 = addWallCover({
		sizeX: appState.normalize(roomSizeX), 
		sizeY: appState.normalize(roomHeight), 
		texture: appState.textures.coversInside.texture
	});
	cover1.position.z = 0 - appState.normalize(roomSizeY) * 0.499;
	cover1.name = 'N';

	const cover2 = SkeletonUtils.clone(cover1);
	cover2.material = cover1.material.clone();
	cover2.rotation.y = Math.PI;
	cover2.position.z = appState.normalize(roomSizeY) * 0.499;
	cover2.name = 'S';
	
	const cover3 = addWallCover({
		sizeX: appState.normalize(roomSizeY), 
		sizeY: appState.normalize(roomHeight), 
		texture: appState.textures.coversInside.texture
	});
	cover3.rotation.y = Math.PI * 0.5;
	cover3.position.x = 0 - appState.normalize(roomSizeX) * 0.499;
	cover3.name = 'W';

	const cover4 = SkeletonUtils.clone(cover3);
	cover4.material = cover3.material.clone();
	cover4.rotation.y = 0 - Math.PI * 0.5;
	cover4.position.x = appState.normalize(roomSizeX) * 0.499;
	cover4.name = 'E';


	const cover5 = addWallCover({
		sizeX: appState.normalize(roomSizeX) + appState.normalize(wallThickness) * 2, 
		sizeY: appState.normalize(roomHeight), 
		texture: appState.textures.coversOutside.texture
	});
	cover5.position.z = appState.normalize(wallThickness) + appState.normalize(roomSizeY) * 0.501;
	cover5.name = 'S';

	const cover6 = SkeletonUtils.clone(cover5);
	cover6.material = cover5.material.clone();
	cover6.rotation.y = Math.PI;
	cover6.position.z = 0 - appState.normalize(wallThickness) - appState.normalize(roomSizeY) * 0.501;
	cover6.name = 'N';
	
	const cover7 = addWallCover({
		sizeX: appState.normalize(roomSizeY) + appState.normalize(wallThickness) * 2, 
		sizeY: appState.normalize(roomHeight), 
		texture: appState.textures.coversOutside.texture
	});
	cover7.rotation.y = Math.PI * 0.5;
	cover7.position.x = appState.normalize(wallThickness) + appState.normalize(roomSizeX) * 0.501;
	cover7.name = 'E';

	const cover8 = SkeletonUtils.clone(cover7);
	cover8.material = cover7.material.clone();
	cover8.rotation.y = 0 - Math.PI * 0.5;
	cover8.position.x = 0 - appState.normalize(wallThickness) - appState.normalize(roomSizeX) * 0.501;
	cover8.name = 'W';

	// Add to scene
	scene.getObjectByName('floor').add( floor );
	scene.getObjectByName('coversInside').add( cover1, cover2, cover3, cover4 );
	scene.getObjectByName('coversOutside').add( cover5, cover6, cover7, cover8 );
	scene.getObjectByName('walls').add( wallShortLeft, wallShortRight, wallLongLeft, wallLongRight );
}