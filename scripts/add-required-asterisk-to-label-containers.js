let selection = figma.currentPage.selection

function createNewText(characters) {
    const newTextNode = figma.createText()
    newTextNode.characters = characters
    return newTextNode 
  }

const addPropertiesToContainer = (properties, container) => {
  Object.keys(properties).map((item, key) => {
    container[item] = properties[item];
  })
}

let parentProperties = {
      layoutMode: "HORIZONTAL",
      fills: [],
      itemSpacing: 4,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      name: `Label Container`,
			layoutGrow: 1,
}

selection.map((item, key) => {
	let autoLayoutFrame = figma.createFrame();
	let asterisk = createNewText('*')
	addPropertiesToContainer(parentProperties,autoLayoutFrame)
	item.parent.insertChild(0, autoLayoutFrame)
	autoLayoutFrame.insertChild(0, item)
	autoLayoutFrame.insertChild(1, asterisk)
	asterisk.layoutGrow = 1;
	asterisk.fontSize = 18;
	asterisk.lineHeight = {value: 22, unit: 'PIXELS'};
	asterisk.textAutoResize = "HEIGHT";
	asterisk.name = "Required Flag"
	item.textAutoResize = "WIDTH_AND_HEIGHT";
})  