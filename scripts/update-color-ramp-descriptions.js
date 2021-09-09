const log = a => {
	console.log(a);
}
const sortColors = (array) => {
	let colorRamp = [];
	let otherColors = [];
	// take the list of colors and sort them into the color ramp and the other colors
	array.map((item, key) => {
		// check if color is in color ramp, change this string to match your color system
		item.name.includes('Color Ramp') ?
		//
			colorRamp.push(item) :
			otherColors.push(item);
	})
	// loop through the other colors and check if the color is in the color ramp. If it is, update the descriptions to match the color ramp.
	otherColors.map((item, key) => {
		colorRamp.map(color => {
			JSON.stringify(item.paints[0].color) == JSON.stringify(color.paints[0].color) ?
				(item.description = color.description + `\n\n${color.name}`) : 
        null;
		})
	})
	return {colorRamp, otherColors}
}

const updateSemanticColors = (array) => {
	let colors = sortColors(array);
	log(colors);
}

let styles = figma.getLocalPaintStyles();

