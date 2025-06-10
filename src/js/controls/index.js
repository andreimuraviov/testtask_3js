import { texturesControl } from "./components/texturesControl.js";
import { wallParameterControl } from "./components/wallParameterControl.js";
import { importExportControl } from "./components/importExportControl.js";

export function controlsSection (config) {
	const { textures, wallParams} = config;

	const controlsSection = document.createElement('div');
	controlsSection.setAttribute('class', 'controls-panel-content');

	// Текстуры
	
	const texturesHeading = document.createElement('h5');
	texturesHeading.innerHTML = 'Текстуры';
	controlsSection.appendChild(texturesHeading);

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

	const wallParamsHeading = document.createElement('h5');
	wallParamsHeading.setAttribute('class', 'mt-5');
	wallParamsHeading.innerHTML = 'Параметры стены';
	controlsSection.appendChild(wallParamsHeading);

	// Параметры стены

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

	const importExportHeading = document.createElement('h5');
	importExportHeading.setAttribute('class', 'mt-5 mb-3');
	importExportHeading.innerHTML = 'Импорт / экспорт';

	controlsSection.append(importExportHeading, importExportControl());

	return controlsSection;
}
