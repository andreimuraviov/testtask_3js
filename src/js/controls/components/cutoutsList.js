import { app } from '../../state/app.js';

export function cutoutsList(list) {
	if (!list || !list.length) {
		const cutoutsSection = document.createElement('div');
		cutoutsSection.setAttribute('class', 'mt-3');
		cutoutsSection.innerHTML = "Список пуст."
		return cutoutsSection;
	}

	const cutoutsSection = document.createElement('ol');
	cutoutsSection.setAttribute('class', 'cutouts-list mt-3 ps-4');

	for (let item of list) {
		const row = document.createElement('li');
		
		const link = document.createElement('a');
		link.setAttribute('href', 'javascript: void(0)');
		link.innerHTML = item.cutoutName;

		link.addEventListener('click', () => {
			app.showCutoutEditForm(link, item);
		});

		row.appendChild(link);
		cutoutsSection.appendChild(row);
	}

	return cutoutsSection;
}
