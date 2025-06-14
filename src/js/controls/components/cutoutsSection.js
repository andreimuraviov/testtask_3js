import { heading } from "./heading.js";
import { app } from '../../state/app.js';
import config from '../../state/config.js';


export function cutoutsSection () {
	const controlsSection = document.createElement('div');
	controlsSection.setAttribute('class', 'controls-panel-section');

	controlsSection.appendChild(heading({ text: 'Вырезы', className: 'mb-3' }));

	const button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-primary btn-sm');
	button.innerHTML = 'Добавить вырез';

	button.addEventListener('click', () => {
		if (app.cutoutEditModal) {
			clearCutoutEditForm(app.cutoutEditModal);
			const cutoutEditModal = bootstrap.Modal.getOrCreateInstance(app.cutoutEditModal);
			cutoutEditModal.show(button);
		}
	})
	
	controlsSection.appendChild(button);

	return controlsSection;
}

function clearCutoutEditForm(form) {
	const paramKeys = Object.keys(config.cutoutParams);
	for (let key of paramKeys) {
		const input = form.querySelector(`#${key}`);
		if (input) {
			input.value = config.cutoutParams[key].defaultValue;
		}
	}
}