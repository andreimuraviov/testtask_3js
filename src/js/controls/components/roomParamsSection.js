import { heading } from "./heading.js";
import { texturesControl } from "./texturesControl.js";
import { wallParameterControl } from "./wallParameterControl.js";
import { exportImportControl } from "./exportImportControl.js";

export function roomParamsSection (config) {
	const { textures, wallParams } = config;

	const controlsSection = document.createElement('div');
	controlsSection.setAttribute('class', 'controls-panel-section');

	// Текстуры
	
	controlsSection.appendChild(heading({ text: 'Текстуры', className: 'mb-3'}));

	for (let key of Object.keys(textures)) {
		const control = texturesControl({
			labelName: key,
			labelTitle: textures[key].title,
			roomValue: textures[key].roomValue,
			items: textures[key].items,
		});
		control.classList.add('mb-4');
		controlsSection.appendChild(control);
	}

	// Параметры стен

	controlsSection.appendChild(heading({ text: 'Параметры стен' }));

	for (let key of Object.keys(wallParams)) {
		const control = wallParameterControl({
			labelName: key,
			labelTitle: wallParams[key].title,
			roomValue: wallParams[key].roomValue,
		});
		control.classList.add('mb-3');
		controlsSection.appendChild(control);
	}

	// Импорт/экспорт

	controlsSection.appendChild(heading({ text: 'Импорт / экспорт' }));
	controlsSection.appendChild(exportImportControl());

	return controlsSection;

}