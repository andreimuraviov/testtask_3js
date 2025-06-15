export function cutoutEditForm() {
	const container = document.createElement('div');
	container.setAttribute('class', 'container-fluid');

	const inputId = document.createElement('input');
	inputId.setAttribute('id', 'cutoutId');
	inputId.setAttribute('type', 'hidden');

	container.appendChild(inputId);

	// Название

	const rowName = document.createElement('div');
	rowName.setAttribute('class', 'row mb-3');

	const rowNameTitle = document.createElement('div');
	rowNameTitle.setAttribute('class', 'col-6');
	rowNameTitle.innerHTML = 'Название';

	const rowNameInput = document.createElement('div');
	rowNameInput.setAttribute('class', 'col-6');

	const inputName = Object.assign(document.createElement('input'), {
		'id': 'cutoutName',
		'type': 'text',
		'placeholder': 'Название',
		'className': 'form-control form-control-sm',
	});

	rowNameInput.appendChild(inputName);

	// Размер выреза

	const rowSize = document.createElement('div');
	rowSize.setAttribute('class', 'row mb-3');

	const rowSizeTitle = document.createElement('div');
	rowSizeTitle.setAttribute('class', 'col-6');
	rowSizeTitle.innerHTML = 'Размер (см)';

	const rowSizeInput = document.createElement('div');
	rowSizeInput.setAttribute('class', 'col-6');

	const rowSizeInputGroup = document.createElement('div');
	rowSizeInputGroup.setAttribute('class', 'input-group input-group-sm');

	const inputWidth = Object.assign(document.createElement('input'), {
		'id': 'cutoutWidth',
		'type': 'number',
		'min': '1',
		'placeholder': 'Ширина',
		'className': 'form-control',
	});

	const inputGroupDelimiter = document.createElement('span');
	inputGroupDelimiter.setAttribute('class', 'input-group-text');
	inputGroupDelimiter.innerHTML = '&#x2715;';

	const inputHeight = Object.assign(document.createElement('input'), {
		'id': 'cutoutHeight',
		'type': 'number',
		'min': '1',
		'placeholder': 'Высота',
		'className': 'form-control',
	});

	rowSizeInputGroup.append(inputWidth, inputGroupDelimiter, inputHeight);
	rowSizeInput.appendChild(rowSizeInputGroup);

	// Расстояние от края стены

	const rowPosition = document.createElement('div');
	rowPosition.setAttribute('class', 'row mb-3');

	const rowPositionTitle = document.createElement('div');
	rowPositionTitle.setAttribute('class', 'col-6');
	rowPositionTitle.innerHTML = 'Расстояние от края (см)';

	const rowPositionInput = document.createElement('div');
	rowPositionInput.setAttribute('class', 'col-6');

	const rowPositionInputGroup = document.createElement('div');
	rowPositionInputGroup.setAttribute('class', 'input-group input-group-sm');

	const inputLeft = Object.assign(document.createElement('input'), {
		'id': 'cutoutLeft',
		'type': 'number',
		'min': '1',
		'placeholder': 'Слева',
		'className': 'form-control',
	});

	const inputTop = Object.assign(document.createElement('input'), {
		'id': 'cutoutTop',
		'type': 'number',
		'min': '1',
		'placeholder': 'Сверху',
		'className': 'form-control',
	});

	rowPositionInputGroup.append(inputLeft, inputGroupDelimiter.cloneNode(true), inputTop);
	rowPositionInput.appendChild(rowPositionInputGroup);

	// Глубина

	const rowDepth = document.createElement('div');
	rowDepth.setAttribute('class', 'row');

	const rowDepthTitle = document.createElement('div');
	rowDepthTitle.setAttribute('class', 'col-6');
	rowDepthTitle.innerHTML = 'Глубина (см)';

	const rowDepthInput = document.createElement('div');
	rowDepthInput.setAttribute('class', 'col-6');

	const inputDepth = Object.assign(document.createElement('input'), {
		'id': 'cutoutDepth',
		'type': 'number',
		'min': '1',
		'placeholder': 'Глубина',
		'className': 'form-control form-control-sm',
	});

	rowDepthInput.appendChild(inputDepth);

	rowName.append(rowNameTitle, rowNameInput);
	rowSize.append(rowSizeTitle, rowSizeInput);
	rowPosition.append(rowPositionTitle, rowPositionInput);
	rowDepth.append(rowDepthTitle, rowDepthInput);

	container.append(rowName, rowSize, rowPosition, rowDepth);

	return container;
}