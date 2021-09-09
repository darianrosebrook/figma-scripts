const findInSelection = (nameOfLayer, figmaObj) => {
 return figmaObj.findAll(n => n.name === nameOfLayer)
}

let selection = figma.currentPage.selection[0];
let layerNameToFind = '';
let results = findInSelection(layerNameToFind, selection);

figma.currentPage.selection = results;