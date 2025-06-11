import { appState } from '../../state/app.js';

export function importExportControl() {

	const controlElement = document.createElement('div');

	// Экспорт

	const exportBtn = document.createElement('button');
	exportBtn.setAttribute('class', 'btn btn-secondary btn-sm me-2');
	exportBtn.setAttribute('type', 'button');
	exportBtn.innerHTML = 'Сохранить в&nbsp;файл';

	exportBtn.addEventListener('click', appState.exportToFile.bind(appState));

	// Импорт

	const importBtn = document.createElement('button');
	importBtn.setAttribute('class', 'btn btn-secondary btn-sm');
	importBtn.setAttribute('type', 'button');
	importBtn.innerHTML = 'Загрузить из&nbsp;файла';

	const fileInput = document.createElement('input');
	fileInput.setAttribute('type', 'file');
	fileInput.style.display = 'none';

	importBtn.addEventListener('click', () => {
		fileInput.click();
	});

	fileInput.addEventListener('change', appState.importFromFile.bind(appState), false);

	controlElement.append(exportBtn, importBtn);

	return controlElement;
}