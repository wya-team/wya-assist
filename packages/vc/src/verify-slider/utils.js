const getPixelRGBA = (imageData, x, y) => {
	const origin = y * imageData.width * 4 + 4 * x;

	let R = imageData.data[origin];
	let G = imageData.data[origin + 1];
	let B = imageData.data[origin + 2];
	let A = imageData.data[origin + 3];
 
	return {
		R,
		G,
		B,
		A,
	};
};

const getDiffPixelRGBA = (imageData1, imageData2, x, y) => {
	const target1 = getPixelRGBA(imageData1, x, y);
	const target2 = getPixelRGBA(imageData2, x, y);

	if (
		target1.R !== target2.R
		|| target1.G !== target2.G
		|| target1.B !== target2.B
		|| target1.A !== target2.A 
	) {
		return [target1, target2];
	}
};

const getGridCoord = (baseX, baseY) => {
	const base = [-1, 0, 1];
	let result = [];
	for (let i = 0; i < base.length; i++) {
		let x = baseX + base[i];
		for (let j = 0; j < base.length; j++) {
			let y = baseY + base[j];
			result.push([x, y]);
		}
	}
	return result;
};

const loadImage = (src) => {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(image);
		image.src = src + `?${Math.random()}`;
		// 这里看具体情况，有些图片需要带上cookie验证
		image.crossOrigin = 'use-credentials';
	});
};
 
export const hackImg = async (src) => {
	try {
		const image = await loadImage(src);

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		canvas.width = image.width;
		canvas.height = image.height;

		context.drawImage(image, 0, 0, image.width, image.height);

		let vImageHeight = image.height / 3;

		// 计算不同点
		let imageData1 = context.getImageData(0, 0, image.width, vImageHeight);
		let imageData2 = context.getImageData(0, vImageHeight * 2, image.width, vImageHeight);

		// 中间区域忽略空白
		// context.fillStyle = `rgba(255, 255, 255, 0)`;
		// context.fillRect(0, vImageHeight, image.width, vImageHeight);

		context.clearRect(0, vImageHeight, image.width, vImageHeight);
		
		let base = 0;
		let draws = [];
		for (let x = 0; x <= image.width; x++) {
			for (let y = 0; y <= vImageHeight; y++) {
				let rgba = getDiffPixelRGBA(imageData1, imageData2, x, y);
				if (rgba) {
					const { R, G, B, A } = rgba[1];
					// 用于x轴偏移值
					base = base || x;

					// 不同点绘制
					let newX = x - base + 1;
					let newY = y + vImageHeight;

					// 目的为了画描边
					try {
						let coords = getGridCoord(newX, newY);

						context.fillStyle = `rgba(255, 255, 255, 0.8)`;
						coords.forEach(([_x, _y]) => {
							context.fillRect(_x, _y, 1, 1);
						});
					} catch (e) {
						console.log(e);
					}

					draws.push(() => {
						context.fillStyle = `rgba(${R}, ${G}, ${B}, ${A})`;
						context.fillRect(newX, newY, 1, 1);
					});
				}
			}
		}

		draws.forEach(fn => fn());

		return canvas.toDataURL();
	} catch (e) {
		console.log(e, '转化失败');
		return src;
	}
};

