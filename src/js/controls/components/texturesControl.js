export function texturesControl({labelName = '', labelTitle = '', items = []}) {

	const label = document.createElement('label');
	label.setAttribute('for', labelName);
	label.classList.add('form-label');
	label.innerText = labelTitle;

	const group = document.createElement('div');
	group.setAttribute('class', 'input-group mb-2');

	const select = document.createElement('select');
	select.setAttribute('id', labelName);
	select.setAttribute('class', 'form-select form-select-sm');

	let i = 0;
	
	for (let item of items) {
		const option = document.createElement('option');
		option.setAttribute('value', item.value);
		if (i = 0) {
			option.setAttribute('selected', true);
			i++;
		}
		option.innerText = item.text;
		select.appendChild(option);
	}

	const button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-primary btn-sm');
	button.innerHTML = 'Применить';

	group.append(select, button);	

	const loadBtn = document.createElement('button');
	loadBtn.setAttribute('type', 'button');
	loadBtn.setAttribute('class', 'btn btn-secondary btn-sm');
	loadBtn.innerHTML = 'Загрузить...';

	const controlElement = document.createElement('div');
	controlElement.setAttribute('class', 'textures-control');
	controlElement.append(label, group, loadBtn);

	return controlElement;
}