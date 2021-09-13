import React, { useState } from 'react';
import { Controlled } from 'react-codemirror2';
import { useDidMountEffect } from '../../../../utils/hooks';
import { EVALUATE_PIXEL_DOCS } from './const';
import TabBox from './TabBox';

export const getDefaultEvaluatePixelFromResponses = (filteredResponses) => {
  return `function evaluatePixel(samples) {
    // Your javascript code here
    return {
${filteredResponses.map((resp) => `      ${resp.identifier}: [],`).join('\n')}
    };
  }`;
};

const generateGlobalScope = (bands) => {
  if (bands.length > 1) {
    // data fusion
    return {
      samples: [],
    };
  }
  return {
    samples: bands.flat().reduce((acc, band) => {
      acc[band] = 0;
      return acc;
    }, {}),
  };
};

const EvalscriptEvaluatePixel = ({ evaluatePixel, setEvaluatePixel, filteredResponses, selectedBands }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [globalScope, setGlobalScope] = useState(generateGlobalScope(selectedBands));

  const handleEvaluatePixelChange = (_, __, code) => {
    if (!isEdited) {
      setIsEdited(true);
    }
    setEvaluatePixel(code);
  };

  // update evaluate pixel as long as user has not edited it with new
  useDidMountEffect(() => {
    if (!isEdited) {
      setEvaluatePixel(getDefaultEvaluatePixelFromResponses(filteredResponses));
    }
  }, [filteredResponses, isEdited]);

  useDidMountEffect(() => {
    setGlobalScope(generateGlobalScope(selectedBands));
  }, [selectedBands]);

  return (
    <div className="flex flex-col">
      <TabBox title="evaluatePixel" documentationLink={EVALUATE_PIXEL_DOCS}>
        <Controlled
          value={evaluatePixel}
          onBeforeChange={handleEvaluatePixelChange}
          options={{
            mode: 'javascript',
            theme: 'eclipse',
            lint: {
              esversion: 6,
            },
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            gutters: ['CodeMirror-lint-markers'],
            styleActiveLine: true,
            extraKeys: {
              Tab: (cm) => {
                var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
                cm.replaceSelection(spaces);
              },
              'Ctrl-Space': 'autocomplete',
            },
            hintOptions: {
              globalScope: {
                ...globalScope,
              },
              completeSingle: false,
            },
          }}
          className="evaluatepixel-editor"
        />
      </TabBox>
    </div>
  );
};

export default EvalscriptEvaluatePixel;
