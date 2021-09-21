import React, { useRef, useEffect, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { extent, max, min } from 'd3-array';
import { useDidMountEffect, useWindowSize } from '../../../utils/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

export const margin = {
  top: 60,
  left: 80,
  right: 10,
  bottom: 60,
};

export const triggerDownload = (imgURI, fileName) => {
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true,
  });

  const a = document.createElement('a');
  a.setAttribute('download', fileName);
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
};

const Chart = ({ histogram, percentiles, onEnter, onLeave, onMove, bandName }) => {
  const xAxisRef = useRef();
  const yAxisRef = useRef();
  const svgRef = useRef();
  const [bars, setBars] = useState();
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const { width: windowWidth } = useWindowSize();
  // const [points, setPoints] = useState();
  // const [path, setPath] = useState();

  useDidMountEffect(() => {
    if (windowWidth < 900) {
      setWidth(300);
      setHeight(300);
    }
  }, [windowWidth]);

  useEffect(() => {
    const histoMax = max(histogram.map((hist) => hist.count));
    const minEdge = min(histogram.map((hist) => hist.lowEdge));
    const maxEdge = max(histogram.map((hist) => hist.highEdge));
    const xScale = scaleLinear()
      .domain([minEdge, maxEdge])
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain([histoMax, 0])
      .range([height - margin.bottom, 0]);
    const colorScale = scaleLinear();
    const colorDomain = extent(histogram, (d) => d.count);
    colorScale.domain(colorDomain).range(['#adffa6', '#085701']);

    const xAxis = axisBottom().scale(xScale);
    const yAxisScale = scaleLinear()
      .domain([0, histoMax])
      .range([height - margin.bottom, 0]);
    const yAxis = axisLeft()
      .scale(yAxisScale)
      .tickFormat((d) => `${d}`);

    const barWidth = (width - margin.left - margin.right) / histogram.length - 1;
    const bars = histogram.map((hist, idx) => {
      const barHeight = yScale(hist.count);
      return {
        x: xScale(hist.lowEdge),
        height: barHeight,
        y: height - margin.bottom - barHeight,
        fill: colorScale(hist.count),
        count: hist.count,
        width: barWidth,
      };
    });
    setBars(bars);

    // const points = percentiles
    //   ? Object.entries(percentiles)
    //       .filter(([key, value]) => minEdge <= value <= maxEdge)
    //       .map(([key, value]) => ({
    //         cx: xScale(value),
    //         cy: yAxisScale(histoMax * (Number(key) / 100)),
    //         percentileKey: Number(key),
    //         percentileValue: value,
    //       }))
    //       .sort((a, b) => (a.percentileKey > b.percentileKey ? 1 : -1))
    //   : [];
    // setPoints(points);

    // const lineGenerator = line();
    // lineGenerator.x((point) => xScale(point.percentileValue));
    // lineGenerator.y((point) => yAxisScale(histoMax * (point.percentileKey / 100)));
    // setPath(lineGenerator(points));

    select(xAxisRef.current).call(xAxis);
    select(yAxisRef.current).call(yAxis);
    // eslint-disable-next-line
  }, [histogram, percentiles, width, height]);

  const retrieveDataAttribute = (e) => {
    return 'Count: ' + e.target.getAttribute('data-count');
  };

  const handleDownloadSvg = (asJpeg = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const svg = svgRef.current;
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.drawImage(img, 0, 10);
      URL.revokeObjectURL(url);

      const imgURI = canvas.toDataURL('image/png', 1.0).replace('image/png', 'image/octet-stream');

      triggerDownload(imgURI, `histogram-${bandName}.png`);
    };
    img.src = url;
  };

  return (
    <div style={{ marginRight: '2rem', maxHeight: '50%', display: 'flex', flexDirection: 'column' }}>
      <h4 className="heading-4 mb-1">Histogram</h4>

      <svg width={width} height={height} ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
        {bars &&
          bars.map((d, idx) => (
            <rect
              x={d.x}
              y={d.y}
              width={d.width}
              height={d.height}
              fill={d.fill}
              key={idx}
              onMouseEnter={onEnter(retrieveDataAttribute)}
              onMouseLeave={onLeave}
              onMouseMove={onMove}
              data-count={d.count}
            />
          ))}

        {/* <Percentiles points={points} onEnter={onEnter} onLeave={onLeave} onMove={onMove} path={path} /> */}
        <g>
          <text
            transform={`translate(${margin.left / 4}, ${
              (height - margin.top - margin.bottom) / 2
            }) rotate(-90)`}
            fontSize="15"
            fontWeight="bold"
          >
            Count
          </text>
          <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
          <text
            transform={`translate(${width / 2}, ${height - margin.bottom / 2})`}
            fontSize="15"
            fontWeight="bold"
          >
            Bins
          </text>
          <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
      <button className="secondary-button w-fit mb-2" onClick={() => handleDownloadSvg(true)}>
        <FontAwesomeIcon icon={faSave} style={{ marginRight: '1rem' }} />
        Download SVG as PNG
      </button>
    </div>
  );
};

export default React.memo(Chart);
