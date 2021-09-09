// Utility functions
const log = (...args) => {
  console.log(...args);
}  
const findInFigmaObject = (nameOfLayer, figmaObj) => {
  return figmaObj.findAll(n => n.name === nameOfLayer);
}
// Color conversions
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
  } : null;
}
const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function rgb2hsl(obj) {
  let r = obj.r, g = obj.g, b = obj.b;
  let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta == 0)
      h = 0;
  else if (cmax == r)
      h = ((g - b) / delta) % 6;
  else if (cmax == g)
      h = (b - r) / delta + 2;
  else
      h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0)
      h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return "hsl(" + Math.round(h) + ", " + Math.round(s) + "%, " + Math.round(l) + "%)";
}
// Contrast ratio calculations
function luminanace(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
    : Math.pow( (v + 0.055) / 1.055, 2.4 );
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function contrast(rgb1, rgb2) {
  const L1 = luminanace(rgb1[0], rgb1[1], rgb1[2]);
  const L2  = luminanace(rgb2[0], rgb2[1], rgb2[2]);
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return Dec2((ratio * 100) / 100)
}
// Convert decimal to contrast ratio
function Dec2(num) {
  num = String(num);
  if(num.indexOf('.') !== -1) {
    var numarr = num.split(".");
    if (numarr.length == 1) {
      return Number(num);
    }
    else {
      return Number(numarr[0]+"."+numarr[1].charAt(0)+numarr[1].charAt(1));
    }
  }
  else {
    return Number(num);
  }
}
  
function getContrastScores(contrast) {
  let largeText;
  let smallText;
  switch (true) {
      case contrast > 7:
          largeText = 'AAA';
          smallText = 'AAA';
          break;
      case contrast >= 4.5:
          largeText = 'AAA';
          smallText = 'AA';
          break;
      case contrast >= 3:
          largeText = 'AA';
          smallText = 'N/A';
          break;
      default:
          largeText = 'N/A';
          smallText = 'N/A';
          break;
  }
  return { largeText, smallText };
}

let selection = figma.currentPage.selection[0];

//  1. find color in color sample
let colorSample = findInFigmaObject('Color Sample', selection);
//  2. Check if color is referenced in the color fill description
let colorSampleFill = colorSample[0].fills[0];
let colorSampleFillStyleId;
if (colorSample[0].fillStyleId) {
  colorSampleFillStyleId = colorSample[0].fillStyleId;
}
const colorStyles = figma.getLocalPaintStyles();
let colorStyle = colorStyles.find(cs => cs.id === colorSampleFillStyleId);
//  3. if it is, update the color reference layer text to match the colorstyle's name
let colorReference = findInFigmaObject('Color Reference', selection);
let colorRamp = [];
let otherColors = [];
let colorReferenceName = '';
colorStyles.map((item, key) => {
  item.name.includes('Color Ramp') ?
    colorRamp.push(item) :
    otherColors.push(item);
})
if (colorStyle.description.includes('Color Ramp')) {
  colorRamp.map(color => {
    colorStyle.description.includes(color.name) ? 
      colorReferenceName = '[library-name] ' + color.name.split('/').pop().replace(/^\s+/, '') : 
      'No color reference in [library-name]'; //update this string with your library name
  })
} 

colorReference[0].characters = colorStyle ? colorReferenceName : 'No color reference in Library';

//  5. Calculate the contrast rating for color against each color you create a variable for
let accessibility = findInFigmaObject('Accessibility', selection);
let enterpriseGrey = findInFigmaObject('Enterprise Grey', accessibility[0]);

// Grab the rgb values
const rgbPrimitives = Object.values(colorSampleFill.color);
let rgbValues = rgbPrimitives.map(function(element) {
  return Math.floor(element * 255);
});
// Create variables for each color you want to check
const contrastGrey = contrast([170,170,170], rgbValues).toFixed(2); 
let contrastGreyRating = getContrastScores(contrastGrey);

//  6. Add the contrast rating to the color rating for those layers
let enterpriseGreyText =  findInFigmaObject('Color Rating', enterpriseGrey[0]);
enterpriseGreyText[0].characters = `${contrastGreyRating.smallText} / ${contrastGrey}`;

//  7. Add the hex code and the hsl code to the hex layer in color references
let hexLayer = findInFigmaObject('Hex', selection);
hexLayer[0].characters = `${rgbToHex(rgbValues[0],rgbValues[1], rgbValues[2]).toUpperCase()}\n${rgb2hsl(colorSampleFill.color)}`;