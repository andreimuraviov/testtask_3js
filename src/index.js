import { controlsSection } from "./js/controls/index.js";
import { createScene } from "./js/scene/index.js";

import config from './assets/config.js';

const controlsEl = document.querySelector('.js-controls-panel');
controlsEl.replaceChildren(controlsSection(config));

const sceneEl = document.querySelector('.js-scene');
createScene(sceneEl);
