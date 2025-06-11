function saveToFile(data, type, filename) {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function loadJsonFromFile(e, callback) {
    const file = e.target.files[0];
    if (file) {
		const reader = new FileReader();

      	reader.onload = function (e) {
			try {
				const jsonData = JSON.parse(e.target.result);
				callback(jsonData);
			} catch (error) {
				console.error("Error parsing JSON:", error);
			}
      	};

      	reader.readAsText(file);
    }
}

export { saveToFile, loadJsonFromFile }