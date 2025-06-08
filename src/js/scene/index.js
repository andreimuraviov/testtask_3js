import { createHtmlElement } from "./components/createHtml.js";
import { initScene } from "./components/initScene.js";
import { addBox } from "./components/addBox.js";

export function createScene (sceneElement) {

	const roomSceneElement = createHtmlElement(sceneElement);

	setTimeout(() => {
		const scene = initScene(roomSceneElement);

		addBox(scene);
	}, 0);
}
