import { controlsSection } from "./js/controls/index.js";
import { handleScene } from "./js/scene/index.js";

import config from './assets/config.js';

const controlsEl = document.querySelector('.js-controls-panel');
controlsEl.replaceChildren(controlsSection(config));

const sceneEl = document.querySelector('.js-scene');
handleScene(sceneEl);
