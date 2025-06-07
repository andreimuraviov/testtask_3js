export function wallParameterControl({labelName = '', labelTitle = ''}) {

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
		'placeholder': '1',
		'className': 'form-control form-control-sm',
	});

	const button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-primary btn-sm');
	button.innerHTML = 'Применить';

	group.appendChild(input);
	group.appendChild(button);

	const controlElement = document.createElement('div');
	controlElement.append(label, group);

	return controlElement;
}