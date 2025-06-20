import { app } from '../state/app.js';

export function wallParameterControl({
	labelName, 
	labelTitle, 
}) {
	const label = document.createElement('label');
	label.setAttribute('for', labelName);
	label.classList.add('form-label');
	label.innerText = labelTitle;

	const group = document.createElement('div');
	group.setAttribute('class', 'input-group');

	const input = Object.assign(document.createElement('input'), {
		'id': labelName,
		'type': 'number',
		'min': '1',
		'className': 'form-control form-control-sm',
	});
	input.disabled = true;

	const button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-primary btn-sm');
	button.innerHTML = 'Применить';
	button.disabled = true;

	button.addEventListener('click', () => {
		if (Number(input.value) < 1) {
			return;
		}
		app.setWallParameterValue(labelName, input.value);
	});

	group.append(input, button);

	input.addEventListener('keyup', ({ key }) => {
    	if (key === "Enter") {
			button.click();
		}
	});

	const controlElement = document.createElement('div');
	controlElement.append(label, group);

	return controlElement;
}