let selection = figma.currentPage.selection

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

function multiplyNumeric(obj) {
  for (let key in obj) {
    if (typeof obj[key] == 'number') {
      obj[key] = Math.floor(obj[key] * 255);
    }
  }
}

let colors = []

selection.map(item => {
	let color = {r: item.fills[0].color.r, g: item.fills[0].color.g, b: item.fills[0].color.b}
	multiplyNumeric(color)
	let newColor = rgbToHex(color.r, color.g, color.b)
	colors.push(newColor)
})

console.log(colors)