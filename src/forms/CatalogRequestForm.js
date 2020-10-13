import React, { useState } from 'react';
import CatalogCollectionSelection from '../components/catalog/CatalogCollectionSelection';
import CatalogQueryOptions from '../components/catalog/CatalogQueryOptions';
import MapContainer from '../components/common/Map/MapContainer';
import CatalogRequestPreview from '../components/catalog/CatalogRequestPreview';
import CatalogTimeRange from '../components/catalog/CatalogTimeRange';
import CatalogSendRequest from '../components/catalog/CatalogSendRequest';
import CatalogResults from '../components/catalog/CatalogResults';
// import CatalogDistinctSelection from '../catalog/CatalogDistinctSelection';
import CatalogFields from '../components/catalog/CatalogFields';

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
          <CatalogRequestPreview setResults={setResults} />
        </div>
        <div className="catalog-second-row-third-item">
          <CatalogResults results={results} />
        </div>
      </div>
    </div>
  );
};

export default CatalogRequestForm;
