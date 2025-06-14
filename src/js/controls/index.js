import { roomParamsSection } from "./components/roomParamsSection.js";
import { cutoutsSection } from "./components/cutoutsSection.js";
import { cutoutEditModal } from "./components/cutoutEditModal.js";

import { app } from '../state/app.js';

export function controlsSection (config) {

	const tabs = [ 
		{ title: 'Параметры комнаты' },
		{ title: 'Вырезы' },
	];

	const controlsSection = document.createElement('div');
	controlsSection.setAttribute('class', 'controls-panel-content');

	// Переключатель вкладок

	const navTabs = document.createElement('ul');
	navTabs.setAttribute('class', 'nav nav-underline');

	for (let tab of tabs) {
		const navItem = document.createElement('li');
		navItem.className = 'nav-item';

		const navLink = document.createElement('a');
		navLink.setAttribute('class', tab === tabs[0] ? 'nav-link active' : 'nav-link');
		navLink.setAttribute('href', 'javascript:void(0)');
		navLink.innerHTML = tab.title;

		tab.tabLink = navLink;

		navLink.addEventListener('click', () => {
			if (!navLink.classList.contains('active')) {
				for (let tab of tabs) {
					tab.tabLink.classList.remove('active');
					tab.tabContent.classList.add('hidden')
				}
				tab.tabContent.classList.remove('hidden')
				tab.tabLink.classList.add('active');
			}
		});

		navItem.appendChild(navLink);
		navTabs.appendChild(navItem);
	}

	controlsSection.append(navTabs);

	// Вкладки
	
	const roomParams = roomParamsSection(config);
	tabs[0].tabContent = roomParams;
	controlsSection.appendChild(roomParams);
	
	const cutouts = cutoutsSection();
	tabs[1].tabContent = cutouts;
	cutouts.classList.add('hidden');
	controlsSection.appendChild(cutouts);

	app.cutoutEditModal = cutoutEditModal();
	document.body.appendChild(app.cutoutEditModal);

	return controlsSection;
}
