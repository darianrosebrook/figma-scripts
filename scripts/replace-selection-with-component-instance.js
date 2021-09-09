// Replace the selected frames with a component instance
const selection = figma.currentPage.selection;
// Set the component to clone
const componentName = '';
const component = figma.currentPage.findOne(n => n.name === componentName && n.type === "COMPONENT")

// Utility to add properties to a container via an object with named properties
const addPropertiesToContainer = (properties, container) => {
  Object.keys(properties).map((item, key) => {
    container[item] = properties[item];
  })
}

const replaceInSelectionWithComponent = (selectionItem, componentToClone) => {
	let parent = selectionItem.parent;
	let instance = componentToClone.createInstance();

	// update this number with the position you want to add the instance
	parent.insertChild(1,instance);

	if(objectProperties) { // if we need to add properties to the instance
		addPropertiesToContainer(objectProperties, instance)
	}
	
	// get rid of the original frame
	selectionItem.remove();
}

// Loop over the selection array and run replaceInSelectionWithComponent with each item
selection.map(item => {
	replaceInSelectionWithComponent(item, component);
})