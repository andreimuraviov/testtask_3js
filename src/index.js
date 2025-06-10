import { controlsSection } from "./js/controls/index.js";
import { roomBuilder } from "./js/scene/index.js";
import { appState } from "./js/state/app.js";
import config from './js/state/config.js';

const controlsEl = document.querySelector('.js-controls-panel');
controlsEl.replaceChildren(controlsSection(config));

const sceneEl = document.querySelector('.js-scene');
roomBuilder(sceneEl);
