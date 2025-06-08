export function createHtmlElement(sceneElement) {
	sceneElement.style.position = 'relative';

	const roomSceneElement = document.createElement('div');
	roomSceneElement.style.position = 'absolute';
	roomSceneElement.style.left = '0';
	roomSceneElement.style.right = '0';
	roomSceneElement.style.top = '0';
	roomSceneElement.style.bottom = '0';

	sceneElement.replaceChildren(roomSceneElement);

	return roomSceneElement;
}