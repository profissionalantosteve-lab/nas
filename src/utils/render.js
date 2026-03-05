// rendering utility

export function exportCanvasToDownload(canvas, filename = "tryon.png") {
	return new Promise((resolve) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) return resolve(false);
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
				resolve(true);
			},
			"image/png",
			1.0
		);
	});
}
