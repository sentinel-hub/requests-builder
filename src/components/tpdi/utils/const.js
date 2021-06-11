export const dataFilterDefaultValues = {
  maxCloudCoverage: 100,
  maxSnowCoverage: 90,
  maxIncidenceAngle: 90,
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
