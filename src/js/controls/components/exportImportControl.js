import { appState } from '../../state/app.js';

export function exportImportControl() {
	const controlElement = document.createElement('div');

	const dropdown = document.createElement('button');
	dropdown.setAttribute('class', 'btn btn-secondary btn-sm dropdown-toggle');
	dropdown.setAttribute('type', 'button');
	dropdown.setAttribute('data-bs-toggle', 'dropdown');
	dropdown.innerHTML = 'Сохранить / загрузить';

	const dropdownMenu = document.createElement('ul');
	dropdownMenu.setAttribute('class', 'dropdown-menu');

	const fileInput = document.createElement('input');
	fileInput.setAttribute('type', 'file');
	fileInput.style.display = 'none';

	fileInput.addEventListener('change', appState.importFromFile.bind(appState), false);

	const dropdownContent = [
		{
			title: 'Сохранить настройки (json)',
			action: appState.exportToFile.bind(appState),
		},
		{
			title: 'Загрузить настройки (json)',
			action: () => { fileInput.click(); },
		},
		{
			title: 'Экспортировать в GLB',
			action: appState.exportSceneToGLB.bind(appState),
		}
	];

	for (let item of dropdownContent) {
		const li = document.createElement('li');
		const button = document.createElement('button');
		button.setAttribute('type', 'button');
		button.setAttribute('class', 'dropdown-item  btn-sm');
		button.innerHTML = item.title;
		button.addEventListener('click', item.action);
		li.appendChild(button);
		dropdownMenu.appendChild(li);
	}

	controlElement.append(dropdown, dropdownMenu, fileInput);

	return controlElement;
}