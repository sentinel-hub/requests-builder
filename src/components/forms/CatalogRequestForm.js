import React, { useState } from 'react';
import CatalogCollectionSelection from '../catalog/CatalogCollectionSelection';
import CatalogQueryOptions from '../catalog/CatalogQueryOptions';
import MapContainer from '../input/MapContainer';
import CatalogRequestPreview from '../catalog/CatalogRequestPreview';
import CatalogTimeRange from '../catalog/CatalogTimeRange';
import CatalogSendRequest from '../catalog/CatalogSendRequest';
import CatalogResults from '../catalog/CatalogResults';
// import CatalogDistinctSelection from '../catalog/CatalogDistinctSelection';
import CatalogFields from '../catalog/CatalogFields';

const CatalogRequestForm = () => {
  // type is needed to render the results.
  const [results, setResults] = useState({
    type: '',
    results: [],
  });

  return (
    <div>
      <div className="catalog-first-row">
        <div className="catalog-first-row-first-item">
          <CatalogCollectionSelection />
          <CatalogQueryOptions />
        </div>
        <div className="catalog-first-row-second-item">
          <CatalogTimeRange />
          {/* <CatalogDistinctSelection /> */}
        </div>
        <div className="catalog-first-row-third-item">
          <MapContainer />
        </div>
      </div>

      <div className="catalog-second-row">
        <div className="catalog-second-row-first-item">
          <CatalogFields />
          <CatalogSendRequest setResults={setResults} />
        </div>
        <div className="catalog-second-row-second-item">
          <CatalogRequestPreview />
        </div>
        <div className="catalog-second-row-third-item">
          <CatalogResults results={results} />
        </div>
      </div>
    </div>
  );
};

export default CatalogRequestForm;
