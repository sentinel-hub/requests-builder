const generateSetup = (input, output) => {
  return `function setup() {
  return {
    input: [{
      bands: [${input.bands.map((band) => `"${band}"`)}],
      units: "${input.units}",
      mosaicking: "${input.mosaicking}",\
      ${input.metadataBounds ? '\n      metadata: ["bounds"],' : ''}
    }],
    output: [${output
      .map(
        (outputObject) => `
      {
        id: "${outputObject.id}",
        bands: ${outputObject.bands},
        sampleType: "${outputObject.sampleType}",\
        ${outputObject.noDataValue ? `\n        noDataValue: ${outputObject.noDataValue},` : ''}
      },\
    `,
      )
      .join('')}
    ],
  }
}
`;
};

const additionalFunctionToCode = (additionalFunction) => {
  switch (additionalFunction) {
    case 'preProcessScenes':
      return `\
function preProcessScenes(collections) {
  return collections;
}`;
    case 'updateOutputMetadata':
      return `\
function updateOutputMetadata(scenes, inputMetadata, outputMetadata) {
  // Write your code here
}`;
    default:
      return '';
  }
};
const generateAdditionalFunctions = (additionalFunctions) => {
  if (additionalFunctions.length === 0) {
    return '';
  }
  return additionalFunctions.map(additionalFunctionToCode).join('\n');
};
const generateEvalscript = (input, output, evaluatePixel, additionalFunctions) => {
  return `//VERSION=3

${generateSetup(input, output)}

${evaluatePixel}

${generateAdditionalFunctions(additionalFunctions)}`;
};

export default generateEvalscript;
