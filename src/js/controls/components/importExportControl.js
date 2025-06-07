export function importExportControl() {

	const controlElement = document.createElement('div');

	const exportBtn = document.createElement('button');
	exportBtn.setAttribute('class', 'btn btn-secondary btn-sm me-2');
	exportBtn.setAttribute('type', 'button');
	exportBtn.innerHTML = 'Сохранить в&nbsp;файл';

	const importBtn = document.createElement('button');
	importBtn.setAttribute('class', 'btn btn-secondary btn-sm');
	importBtn.setAttribute('type', 'button');
	importBtn.innerHTML = 'Загрузить из&nbsp;файла';

	controlElement.append(exportBtn, importBtn);

	return controlElement;
}