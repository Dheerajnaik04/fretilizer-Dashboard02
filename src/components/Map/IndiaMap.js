import React, { useState, useMemo, useEffect, useContext } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Add, Remove, RestartAlt } from '@mui/icons-material';
import LoadingSpinner from '../Common/LoadingSpinner';
import { ThemeContext } from '../Common/ThemeContext';

const IndiaMap = ({ data, title }) => {
  const { theme } = useContext(ThemeContext);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [indiaGeoJson, setIndiaGeoJson] = useState(null);

  const COLOR_DEFICIT = "#DC3545";
  const COLOR_BALANCED_NO_DATA = "#D4EDDA";
  const COLOR_SURPLUS = "green";

  const initialMapState = useMemo(() => ({ coordinates: [79.0, 22.5], zoom: 1 }), []);
  const [position, setPosition] = useState(initialMapState);

  const handleZoomIn = () => {
    setPosition(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 8)
    }));
  };
  const handleZoomOut = () => {
    setPosition(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 1)
    }));
  };
  const handleResetView = () => {
    setPosition(initialMapState);
  };

  useEffect(() => {
    fetch('/india.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(geoData => {
        setIndiaGeoJson(geoData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Could not load GeoJSON data:", error);
        setContent("Error loading map data. Check console for details.");
        setIsLoading(false);
      });
  }, []);

  const stateData = useMemo(() => {
    const aggregated = data.reduce((acc, item) => {
      const stateName = item.state;
      const requirement = parseFloat(item.requirement_in_mt_ || 0) || 0;
      const availability = parseFloat(item.availability_in_mt_ || 0) || 0;

      if (!acc[stateName]) {
        acc[stateName] = { requirement: 0, availability: 0, netBalance: 0 };
      }
      acc[stateName].requirement += requirement;
      acc[stateName].availability += availability;
      acc[stateName].netBalance = acc[stateName].availability - acc[stateName].requirement;
      return acc;
    }, {});
    return aggregated;
  }, [data]);

  const colorScale = scaleLinear()
    .domain([-5000, 0, 5000])
    .range([COLOR_DEFICIT, COLOR_BALANCED_NO_DATA, COLOR_SURPLUS]);

  return (
    <div className="m-4 p-5 shadow-lg rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300">
      <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        indiaGeoJson ? (
          <div className="relative w-full overflow-hidden rounded-lg min-h-[400px] max-h-[550px] flex justify-center items-center">
            <ComposableMap
              projectionConfig={{
                scale: 700,
                center: initialMapState.coordinates
              }}
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={setPosition}
                disableScrollOnZoom={true}
              >
                <Geographies geography={indiaGeoJson}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const stateNameInGeoJson = geo.properties.name;
                      const cur = stateData[stateNameInGeoJson];

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={cur ? colorScale(cur.netBalance) : COLOR_BALANCED_NO_DATA}
                          stroke={theme === 'dark' ? "#146C43" : "#198754"}
                          strokeWidth={0.5}
                          onMouseEnter={() => {
                            const balance = cur ? cur.netBalance.toLocaleString() : "N/A";
                            setContent(`${stateNameInGeoJson} - Net Balance: ${balance} MT`);
                          }}
                          onMouseLeave={() => {
                            setContent("");
                          }}
                          style={{
                            default: {
                              outline: "none",
                              transition: "all 250ms",
                            },
                            hover: {
                              fill: "#A5D6A7",
                              outline: "none",
                              transition: "all 250ms",
                            },
                            pressed: {
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            {content && (
              <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-md shadow-lg text-sm z-10 transition-opacity duration-300 opacity-90">
                {content}
              </div>
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md z-10">
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Zoom In"
              >
                <Add fontSize="small" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Zoom Out"
              >
                <Remove fontSize="small" />
              </button>
              <button
                onClick={handleResetView}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Reset Map View"
              >
                <RestartAlt fontSize="small" />
              </button>
            </div>
            <div className="absolute bottom-2 right-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-md text-sm text-gray-800 dark:text-gray-200">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Legend:</h4>
              <div className="flex items-center mb-1">
                <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLOR_SURPLUS }}></span> <span className="text-gray-700 dark:text-gray-200">Surplus</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLOR_BALANCED_NO_DATA }}></span> <span className="text-gray-700 dark:text-gray-200">Balanced / No Data</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLOR_DEFICIT }}></span> <span className="text-gray-700 dark:text-gray-200">Deficit</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400">
            <p className="text-center">Error: Could not load map data. Please ensure 'india.json' is in your public folder and is valid GeoJSON.</p>
          </div>
        )
      )}
    </div>
  );
};

export default IndiaMap;