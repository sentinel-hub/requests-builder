export const dataFilterDefaultValues = {
  maxCloudCoverage: 100,
  maxSnowCoverage: 90,
  maxIncidenceAngle: 90,
};

export const planetDemoOrder = {
  id: '172db870-2cd1-4f79-9dca-edbe8ddef6a9',
  userId: 'd959e744-3284-4b69-858b-0cd5fd47e0da',
  created: '2020-09-10T12:49:26.023Z',
  name: 'planet demo request',
  provider: 'PLANET',
  input: {
    bounds: {
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [15.825815, 46.714048],
            [15.813988, 46.707248],
            [15.832682, 46.703062],
            [15.839931, 46.711694],
            [15.835353, 46.716664],
            [15.825815, 46.714048],
          ],
        ],
      },
    },
    provider: 'PLANET',
    data: [
      {
        dataFilter: {
          timeRange: {
            from: '2019-04-27T00:00:00Z',
            to: '2019-04-30T00:00:00Z',
          },
          maxCloudCoverage: 30,
        },
        itemType: 'PSScene4Band',
        productBundle: 'analytic',
      },
    ],
    planetApiKey: '',
  },
};

export const airbusOrderDemo = {
  name: 'airbus products',
  input: {
    provider: 'AIRBUS',
    bounds: {
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [15.825815, 46.714048],
            [15.813988, 46.707248],
            [15.832682, 46.703062],
            [15.839931, 46.711694],
            [15.835353, 46.716664],
            [15.825815, 46.714048],
          ],
        ],
      },
    },
    data: [
      {
        constellation: 'PHR',
        products: [
          {
            id: '6701559b-e11e-43f9-b395-ac04f193a83b',
          },
        ],
        dataFilter: {
          timeRange: {
            from: '2017-01-01T00:00:00.000Z',
            to: '2018-01-01T00:00:00.000Z',
          },
        },
      },
    ],
  },
};
