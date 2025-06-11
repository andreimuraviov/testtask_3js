import { texturesControl } from "./components/texturesControl.js";
import { wallParameterControl } from "./components/wallParameterControl.js";
import { exportImportControl } from "./components/exportImportControl.js";

export function controlsSection (config) {
	const { textures, wallParams} = config;

	const headerTag = 'h4';

	const controlsSection = document.createElement('div');
	controlsSection.setAttribute('class', 'controls-panel-content');

	// Текстуры
	
	const texturesHeading = document.createElement(headerTag);
	texturesHeading.setAttribute('class', 'mb-3');
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

	// Параметры стен

	const wallParamsHeading = document.createElement(headerTag);
	wallParamsHeading.setAttribute('class', 'mt-5 mb-3');
	wallParamsHeading.innerHTML = 'Параметры стен';
	controlsSection.appendChild(wallParamsHeading);

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

	const importExportHeading = document.createElement(headerTag);
	importExportHeading.setAttribute('class', 'mt-5 mb-3');
	importExportHeading.innerHTML = 'Импорт / экспорт';

	controlsSection.append(importExportHeading, exportImportControl());

	return controlsSection;
}
