import { controlsSection } from "./js/controls/controlsSection.js";
import { roomBuilder } from "./js/scene/roomBuilder.js";

const controlsEl = document.querySelector('.js-controls-panel');
controlsEl.replaceChildren(controlsSection());

const sceneEl = document.querySelector('.js-scene');
roomBuilder(sceneEl);
