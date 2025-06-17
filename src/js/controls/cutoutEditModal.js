import { cutoutEditForm } from "./cutoutEditForm.js";
import config from '../state/config.js';
import { app } from '../state/app.js';

export function cutoutEditModal() {
	const modal = document.createElement('div');
	modal.setAttribute('class', 'modal fade');
	modal.setAttribute('id', 'cutout-edit-modal');
	modal.setAttribute('tabindex', '-1');
	modal.setAttribute('aria-hidden', 'true');

	const modalDialog = document.createElement('div');
	modalDialog.setAttribute('class', 'modal-dialog modal-dialog-centered');

	const modalContent = document.createElement('div');
	modalContent.setAttribute('class', 'modal-content');

	const modalHeader = document.createElement('div');
	modalHeader.setAttribute('class', 'modal-header');

	const modalHeaderText = document.createElement('h1');
	modalHeaderText.setAttribute('class', 'modal-title fs-5');
	modalHeaderText.setAttribute('id', 'cutout-edit-modal-heading');
	modalHeaderText.innerHTML = 'Параметры выреза';

	const modalCloseBtn = document.createElement('button');
	modalCloseBtn.setAttribute('type', 'button');
	modalCloseBtn.setAttribute('class', 'btn-close');
	modalCloseBtn.setAttribute('data-bs-dismiss', 'modal');
	modalCloseBtn.setAttribute('aria-label', 'Закрыть');

	const modalBody = document.createElement('div');
	modalBody.setAttribute('class', 'modal-body');

	const modalFooter = document.createElement('div');
	modalFooter.setAttribute('class', 'modal-footer');

	const modalCancelBtn = document.createElement('button');
	modalCancelBtn.setAttribute('type', 'button');
	modalCancelBtn.setAttribute('class', 'btn btn-secondary btn-sm');
	modalCancelBtn.setAttribute('data-bs-dismiss', 'modal');
	modalCancelBtn.innerHTML = 'Отмена';

	const modalApplyBtn = document.createElement('button');
	modalApplyBtn.setAttribute('type', 'button');
	modalApplyBtn.setAttribute('class', 'btn btn-primary btn-sm');
	modalApplyBtn.innerHTML = 'Применить';

	modalHeader.append(modalHeaderText, modalCloseBtn);
	modalFooter.append(modalCancelBtn, modalApplyBtn);
	modalContent.append(modalHeader, modalBody, modalFooter);
	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	const modalEditForm = cutoutEditForm();
	modalBody.appendChild(modalEditForm);

	modalApplyBtn.addEventListener('click', () => {
		const cutoutParams = collectFormValues(modal);
		const cutoutEditModal = bootstrap.Modal.getOrCreateInstance(modal);

		modalApplyBtn.blur();
		cutoutEditModal.hide(modalApplyBtn);
		app.addCutouts(cutoutParams);
	});

	return modal;
}

function collectFormValues(form) {
	const paramKeys = Object.keys(config.cutoutParams);
	const result = {
		cutoutId: form.querySelector('#cutoutId').value
	};
	for (let key of paramKeys) {
		const input = form.querySelector(`#${key}`);
		if (input) {
			result[key] = key === 'cutoutName' ? input.value : Number(input.value);
		}
	}
	return result;
}