const generateSetup = (inputs, mosaicking, output) => {
  const isOnDatafusion = inputs.length > 1;
  return `function setup() {
  return {
    input: [${inputs.map(
      (input) =>
        `\n      {
        bands: [${input.bands.map((band) => `"${band}"`)}],\
      ${input.units !== '' ? `\n        units: "${input.units}",` : ''}\
      ${input.metadataBounds ? '\n        metadata: ["bounds"],' : ''}\
      ${isOnDatafusion ? `\n        datasource:"${input.id}"` : ''}
      }`,
    )}
    ],
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
    mosaicking: "${mosaicking}",
  };
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
const generateEvalscript = (inputs, mosaicking, output, evaluatePixel, additionalFunctions) => {
  return `//VERSION=3

${generateSetup(inputs, mosaicking, output)}

${evaluatePixel}

${generateAdditionalFunctions(additionalFunctions)}`;
};

export default generateEvalscript;
