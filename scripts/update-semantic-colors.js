const log = a => {
	console.log(a);
}
const sortColors = (array) => {
	let colorRamp = [];
	let otherColors = [];
	array.map((item, key) => {
		item.name.includes('Color Ramp') ?
			colorRamp.push(item) :
			otherColors.push(item);
	})
	otherColors.map((item, key) => {
		if (item.description.includes('Color Ramp')) {
			colorRamp.map(color => {
				item.description.includes(color.name) ? 
					item.paints = color.paints : 
					null;
			})
		} 
	})
	return {colorRamp, otherColors}
}
const updateSemanticColors = (array) => {
	let colors = sortColors(array);
	log(colors);
}

let styles = figma.getLocalPaintStyles();

updateSemanticColors(styles);