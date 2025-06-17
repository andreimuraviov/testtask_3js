import { heading } from "../helpers/heading.js";
import { app } from '../state/app.js';

import { cutoutsList } from "./cutoutsList.js";

export function cutoutsSection () {
	const controlsSection = document.createElement('div');
	controlsSection.setAttribute('class', 'controls-panel-section');


	const header = document.createElement('div');
	header.setAttribute('class', 'd-flex flex-row');
	
	const button = document.createElement('a');
	button.setAttribute('href', 'javascript: void(0)');
	button.setAttribute('class', 'ms-auto icon-link nav-link disabled');
	button.style.userSelect = 'none';
	button.innerHTML = 
	`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
  		<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
	</svg> Добавить`;

	button.addEventListener('click', () => {
		if (!button.classList.contains('disabled')) app.showCutoutEditForm(button);
	})

	header.append(heading({ text: 'Вырезы', className: 'mb-1' }), button);
	controlsSection.appendChild(header);

	app.addCutoutButton = button;
	app.updateCutoutsList = updateCutoutsList(controlsSection);
	app.updateCutoutsList();

	return controlsSection;
}

function updateCutoutsList(controlsSection) {
	return () => {
		if (app.cutoutsList) {
			controlsSection.removeChild(app.cutoutsList);
		}
		app.cutoutsList = cutoutsList(app.cutouts);
		controlsSection.appendChild(app.cutoutsList);
	}
}