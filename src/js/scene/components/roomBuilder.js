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
		coverUrl: appState.coverUrlFloor
	});

	// Text

	addText(`${roomSizeX * roomSizeY * 0.0001} м²`, floor);

	// Wall 1

	const wallShortLeft = buildWall({
		wallLength: appState.normalize(roomSizeY),
		wallHeight: appState.normalize(roomHeight),
		wallThickness: appState.normalize(wallThickness),
	});

	wallShortLeft.rotation.y = 0 - Math.PI * 0.5;
	wallShortLeft.position.set(appState.normalize(roomSizeX) * 0.5, 0, 0);

	// Wall 2

	const wallShortRight = SkeletonUtils.clone(wallShortLeft);

	wallShortRight.rotation.y = Math.PI * 0.5;
	wallShortRight.position.set(0 - appState.normalize(roomSizeX) * 0.5, 0, 0);

	// Wall 3

	const wallLongLeft = buildWall({
		wallLength: appState.normalize(roomSizeX),
		wallHeight: appState.normalize(roomHeight),
		wallThickness: appState.normalize(wallThickness),
	});

	wallLongLeft.position.set(0, 0, 0 - appState.normalize(roomSizeY) * 0.5);

	// Wall 4

	const wallLongRight = SkeletonUtils.clone(wallLongLeft);

	wallLongRight.rotation.y = Math.PI;
	wallLongRight.position.set(0, 0, appState.normalize(roomSizeY) * 0.5);

	// Wall covers

	const cover1 = addWallCover({
		sizeX: appState.normalize(roomSizeX), 
		sizeY: appState.normalize(roomHeight), 
		coverUrl: appState.coverUrlInside
	});
	cover1.position.z = 0 - appState.normalize(roomSizeY) * 0.499;

	const cover2 = SkeletonUtils.clone(cover1);
	cover2.rotation.y = Math.PI;
	cover2.position.z = appState.normalize(roomSizeY) * 0.499;
	
	const cover3 = addWallCover({
		sizeX: appState.normalize(roomSizeY), 
		sizeY: appState.normalize(roomHeight), 
		coverUrl: appState.coverUrlInside
	});
	cover3.rotation.y = Math.PI * 0.5;
	cover3.position.x = 0 - appState.normalize(roomSizeX) * 0.499;

	const cover4 = SkeletonUtils.clone(cover3);
	cover4.rotation.y = 0 - Math.PI * 0.5;
	cover4.position.x = appState.normalize(roomSizeX) * 0.499;


	const cover5 = addWallCover({
		sizeX: appState.normalize(roomSizeX) + appState.normalize(wallThickness) * 2, 
		sizeY: appState.normalize(roomHeight), 
		coverUrl: appState.coverUrlOutside
	});
	cover5.position.z = appState.normalize(wallThickness) + appState.normalize(roomSizeY) * 0.501;

	const cover6 = SkeletonUtils.clone(cover5);
	cover6.rotation.y = Math.PI;
	cover6.position.z = 0 - appState.normalize(wallThickness) - appState.normalize(roomSizeY) * 0.501;
	
	const cover7 = addWallCover({
		sizeX: appState.normalize(roomSizeY) + appState.normalize(wallThickness) * 2, 
		sizeY: appState.normalize(roomHeight), 
		coverUrl: appState.coverUrlOutside
	});
	cover7.rotation.y = Math.PI * 0.5;
	cover7.position.x = appState.normalize(wallThickness) + appState.normalize(roomSizeX) * 0.501;

	const cover8 = SkeletonUtils.clone(cover7);
	cover8.rotation.y = 0 - Math.PI * 0.5;
	cover8.position.x = 0 - appState.normalize(wallThickness) - appState.normalize(roomSizeX) * 0.501;

	// Add to scene
	scene.getObjectByName('floor').add( floor );
	scene.getObjectByName('coversInside').add( cover1, cover2, cover3, cover4 );
	scene.getObjectByName('coversOutside').add( cover5, cover6, cover7, cover8 );
	scene.getObjectByName('walls').add( wallShortLeft, wallShortRight, wallLongLeft, wallLongRight );
}