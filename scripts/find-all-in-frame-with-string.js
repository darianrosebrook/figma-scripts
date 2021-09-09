const findWithString = (string, figmaObj) => {
  return figmaObj.findAll(n => n.name.includes(string));
 }
 
let selection = figma.currentPage.selection[0];
let stringToFind = ''; // Change this to your string
 
let results = findWithString(stringToFind, selection);
figma.currentPage.selection = results;