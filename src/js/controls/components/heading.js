export function heading({ text, className = 'mt-5 mb-3', tag = 'h4'}) {
	const headingElement = document.createElement(tag);
	headingElement.setAttribute('class', className);
	headingElement.innerHTML = text;

	return headingElement;
}