export function heading({ text, className = 'mt-5 mb-3'}) {
	const headingElement = document.createElement('h4');
	headingElement.setAttribute('class', className);
	headingElement.innerHTML = text;

	return headingElement;
}