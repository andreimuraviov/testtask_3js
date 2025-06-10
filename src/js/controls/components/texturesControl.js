import { appState } from '../../state/app.js';

export function texturesControl({
	labelName, 
	labelTitle,
	roomValue,
	items = []
}) {
	const label = document.createElement('label');
	label.setAttribute('for', labelName);
	label.classList.add('form-label');
	label.innerText = labelTitle;

	const group = document.createElement('div');
	group.setAttribute('class', 'input-group mb-2');

	const select = document.createElement('select');
	select.setAttribute('id', labelName);
	select.setAttribute('class', 'form-select form-select-sm');

	for (let item of items) {
		const option = document.createElement('option');
		option.setAttribute('value', item.value);
		option.innerText = item.text;
		if (item.default) {
			option.setAttribute('selected', 'selected');
		}
		select.appendChild(option);
	}

	const loadOption = document.createElement('option');
	loadOption.setAttribute('value', '');
	loadOption.innerText = 'Своё изображение...';
	select.appendChild(loadOption);

	const button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-primary btn-sm');
	button.style.width = '90px';
	button.innerHTML = 'Применить';

	group.append(select, button);	

	const fileInput = document.createElement('input');
	fileInput.setAttribute('type', 'file');
	fileInput.style.display = 'none';

	const controlElement = document.createElement('div');
	controlElement.setAttribute('class', 'textures-control');

	controlElement.append(label, group);

	select.addEventListener('change', function (e) {
		if (select.value === '') {
			button.innerHTML = 'Загрузить';
		} else {
			button.innerHTML = 'Применить';
		}
	});

	button.addEventListener('click', () => {
		if (!select.value) {
			fileInput.click();
		} else {
			appState[roomValue] = select.value;
		}
	});

	fileInput.addEventListener('change', function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file && file.type.match('image.*')) {
			const reader = new FileReader();

			    reader.onload = function (event) {
				const image = new Image();
				image.src = event.target.result;

				image.onload = function () {
					appState[roomValue] = '';
					appState.applyCustomImage(roomValue, image);
				};
			};

			reader.readAsDataURL(file);
		}
	}, false);

	return controlElement;
}