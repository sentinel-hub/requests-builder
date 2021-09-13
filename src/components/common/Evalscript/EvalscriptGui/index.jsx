import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../../../store';
import requestSlice from '../../../../store/request';
import { SETUP_DOCS } from './const';
import EvalscriptAdditionalFunctions from './EvalscriptAdditionalFunctions';
import EvalscriptEvaluatePixel, { getDefaultEvaluatePixelFromResponses } from './EvalscriptEvaluatePixel';
import EvalscriptInput from './EvalscriptInput/index';
import EvalscriptMosaicking from './EvalscriptMosaicking';
import EvalscriptOutput, { buildFullOutputState, INITIAL_OUTPUT_STATE } from './EvalscriptOutput';
import generateEvalscript from './generateEvalscript';
import TabBox from './TabBox';

const EvalscriptGui = ({ responses, setUsingEvalscriptGui, dataCollections }) => {
  const filteredResponses = useMemo(() => responses.filter((resp) => resp.identifier !== 'userdata'), [
    responses,
  ]);
  const [evaluatePixel, setEvaluatePixel] = useState(getDefaultEvaluatePixelFromResponses(filteredResponses));
  const [additionalFunctions, setAdditionalFunctions] = useState([]);
  const [selectedMosaicking, setSelectedMosaicking] = useState('SIMPLE');
  const [outputState, setOutputState] = useState(
    Array.from({ length: responses.length }).fill(INITIAL_OUTPUT_STATE),
  );
  const [selectedBands, setSelectedBands] = useState(
    dataCollections.reduce((acc, dc) => {
      acc.push([]);
      return acc;
    }, []),
  );

  const [units, setUnits] = useState(dataCollections.map((dc) => 'REFLECTANCE'));
  const [metadataBounds, setMetadataBounds] = useState([false]);

  const fullOutputState = useMemo(() => buildFullOutputState(outputState, filteredResponses), [
    outputState,
    filteredResponses,
  ]);

  const handleGenerateEvalscript = () => {
    const isOnDf = dataCollections.length > 1;
    const inputs = dataCollections.map((dc, idx) => ({
      bands: selectedBands[idx],
      units: units[idx],
      metadataBounds: metadataBounds[idx],
      id: isOnDf ? dc.id : undefined,
    }));

    const evalscript = generateEvalscript(
      inputs,
      selectedMosaicking,
      fullOutputState,
      evaluatePixel,
      additionalFunctions,
    );

    store.dispatch(requestSlice.actions.setEvalscript(evalscript));
    setUsingEvalscriptGui(false);
  };

  const disabledGeneration = !Boolean(
    selectedBands.length > 0 && outputState.every((output) => output.bands !== ''),
  );

  return (
    <section>
      <TabBox title="setup" className="mb-3" documentationLink={SETUP_DOCS}>
        <EvalscriptInput
          selectedBands={selectedBands}
          setSelectedBands={setSelectedBands}
          units={units}
          setUnits={setUnits}
          metadataBounds={metadataBounds}
          setMetadataBounds={setMetadataBounds}
          dataCollections={dataCollections}
        />
        <EvalscriptOutput
          outputState={fullOutputState}
          setOutputState={setOutputState}
          filteredResponses={filteredResponses}
        />
        <EvalscriptMosaicking
          selectedMosaicking={selectedMosaicking}
          setSelectedMosaicking={setSelectedMosaicking}
        />
      </TabBox>
      <EvalscriptEvaluatePixel
        evaluatePixel={evaluatePixel}
        setEvaluatePixel={setEvaluatePixel}
        filteredResponses={filteredResponses}
        selectedBands={selectedBands}
      />
      <EvalscriptAdditionalFunctions
        additionalFunctions={additionalFunctions}
        setAdditionalFunctions={setAdditionalFunctions}
      />
      <button
        className={`secondary-button my-2 ${disabledGeneration ? 'secondary-button--disabled' : ''}`}
        disabled={disabledGeneration}
        onClick={handleGenerateEvalscript}
      >
        Generate Evalscript
      </button>

      {disabledGeneration && (
        <p className="text text--warning italic ml-2 mb-2">Fill every required (*) field to proceed!</p>
      )}
    </section>
  );
};

const mapStateToProps = (state) => ({
  responses: state.request.responses,
  dataCollections: state.request.dataCollections,
});

export default connect(mapStateToProps)(EvalscriptGui);
