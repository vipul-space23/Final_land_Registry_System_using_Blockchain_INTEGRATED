// // src/components/LandMapSelector.jsx

// import React, { useEffect, useState, useRef } from 'react';
// import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
// import { EditControl } from 'react-leaflet-draw';
// import L from 'leaflet';
// import { area as turfArea } from '@turf/area';
// import { centroid as turfCentroid } from '@turf/centroid';
// import { LocateFixed, Trash2, Search, MapPinned } from 'lucide-react';

// // ... (Leaflet CSS and Icon Fix imports are fine)
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });


// // ... (AutoCenterMap and MapSearch components are fine)
// const AutoCenterMap = ({ coords }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (coords.lat && coords.lng) {
//       map.flyTo([coords.lat, coords.lng], 16);
//     }
//   }, [coords, map]);
//   return null;
// };

// const MapSearch = ({ onLocationSelect }) => {
//     const [query, setQuery] = useState('');
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const debounceTimeout = useRef(null);

//     const handleSearch = (e) => {
//         const newQuery = e.target.value;
//         setQuery(newQuery);
//         setLoading(true);

//         if (debounceTimeout.current) {
//             clearTimeout(debounceTimeout.current);
//         }

//         if (!newQuery) {
//             setResults([]);
//             setLoading(false);
//             return;
//         }

//         debounceTimeout.current = setTimeout(async () => {
//             try {
//                 const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newQuery)}&countrycodes=in`);
//                 const data = await response.json();
//                 setResults(data);
//             } catch (err) {
//                 console.error("Search error:", err);
//             } finally {
//                 setLoading(false);
//             }
//         }, 500);
//     };

//     const handleSelect = (result) => {
//         onLocationSelect({
//             lat: parseFloat(result.lat),
//             lng: parseFloat(result.lon)
//         });
//         setQuery(result.display_name);
//         setResults([]);
//     };

//     return (
//         <div className="relative w-full md:w-1/2">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2">
//                 <Search className="w-4 h-4 text-gray-400" />
//             </div>
//             <input
//                 type="text"
//                 value={query}
//                 onChange={handleSearch}
//                 placeholder="Search for a location (e.g., Airoli, Mumbai)"
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
//             />
//             {(loading || results.length > 0) && (
//                 <ul className="absolute z-[1000] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//                     {loading && <li className="px-4 py-2 text-gray-500">Searching...</li>}
//                     {results.map(result => (
//                         <li
//                             key={result.osm_id}
//                             onClick={() => handleSelect(result)}
//                             className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
//                         >
//                             {result.display_name}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };


// const LandMapSelector = ({ 
//     title, 
//     onCoordsFetched = () => {}, 
//     onShapeDrawn = () => {} 
// }) => {
//   const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629, zoom: 5 });
//   const [error, setError] = useState(null);
//   const featureGroupRef = useRef();

//   const [selectedArea, setSelectedArea] = useState(0);
//   const [shapeCenter, setShapeCenter] = useState(null);

//   const fetchUserLocation = () => {
//     setError(null);
//     if (!navigator.geolocation) {
//         setError("Error: Geolocation is not supported by your browser.");
//         return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const newCoords = { lat: latitude, lng: longitude, zoom: 16 };
//         setCoords(newCoords);
//         if (onCoordsFetched) onCoordsFetched(newCoords); 
//       },
//       (err) => {
//         console.error("Geolocation error:", err);
//         setError(`Error: ${err.message}. (Ensure you are on HTTPS/localhost and allowed permissions).`);
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   };

//   useEffect(() => {
//     fetchUserLocation();
//   }, []); 


//   // ✅ 1. Modify this function to calculate and RETURN all data
//   const calculateShapeData = (geometry) => {
//     if (!geometry) {
//         setSelectedArea(0);
//         setShapeCenter(null);
//         // Return null/zero data
//         return { geometry: null, area: 0, center: null };
//     }

//     try {
//         if (geometry.type === 'Point') {
//             const center = { lat: geometry.coordinates[1], lng: geometry.coordinates[0] };
//             setSelectedArea(0);
//             setShapeCenter(center);
//             // Return point data
//             return { geometry, area: 0, center };
//         } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
//             const area = Math.round(turfArea(geometry));
//             const centerPoint = turfCentroid(geometry);
//             const center = {
//                 lat: centerPoint.geometry.coordinates[1],
//                 lng: centerPoint.geometry.coordinates[0]
//             };
//             setSelectedArea(area);
//             setShapeCenter(center);
//             // Return polygon data
//             return { geometry, area, center };
//         }
//     } catch (e) {
//         console.error("Error calculating shape data:", e);
//         setSelectedArea(0);
//         setShapeCenter(null);
//     }
//     // Return null/zero data on failure
//     return { geometry: null, area: 0, center: null };
//   };


//   // ✅ 2. Modify onCreated to pass the full data object up
//   const onCreated = (e) => {
//     const { layer } = e;
//     featureGroupRef.current?.clearLayers();
    
//     const geoJSON = layer.toGeoJSON();
//     const geometry = geoJSON.geometry; 
    
//     // Calculate data AND pass the full object to the parent
//     const data = calculateShapeData(geometry);
//     onShapeDrawn(data);
//   };

//   // ✅ 3. Modify onEditStop to pass the full data object up
//   const onEditStop = (e) => {
//     const layers = e.layers.getLayers();
//     if (layers.length > 0) {
//       const editedLayer = layers[0];
//       const geoJSON = editedLayer.toGeoJSON();
//       const geometry = geoJSON.geometry;

//       // Calculate data AND pass the full object to the parent
//       const data = calculateShapeData(geometry);
//       onShapeDrawn(data);
//     }
//   };

//   // ✅ 4. Modify onDeleteStop to pass the reset object up
//   const onDeleteStop = () => {
//     calculateShapeData(null); // This just resets internal state
//     // Pass the null/zero object to the parent
//     onShapeDrawn({ geometry: null, area: 0, center: null });
//   };

//   const clearAllShapes = () => {
//     featureGroupRef.current?.clearLayers();
//     onDeleteStop(); // Trigger the delete logic
//   };

//   // ... (drawStyleOptions and the rest of the component are fine)
//   const drawStyleOptions = {
//     shapeOptions: { 
//       color: '#4f46e5',
//       fillColor: '#6366f1',
//       fillOpacity: 0.5 
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      
//       {/* --- HEADER --- */}
//       <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
//         <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//           <MapPinned className="inline-block h-6 w-6 mr-2 text-indigo-600"/>
//           {title || "Select Your Property Area"}
//         </h2>
//         <div className="flex gap-2">
//             <button typeG="button" onClick={fetchUserLocation} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
//                 <LocateFixed className="w-4 h-4"/> My Location
//             </button>
//             <button type="button" onClick={clearAllShapes} className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2">
//                 <Trash2 className="w-4 h-4"/> Clear
//             </button>
//         </div>
//       </div>

//       {/* --- SEARCH BAR --- */}
//       <div className="mb-4">
//         <MapSearch onLocationSelect={(loc) => setCoords({ ...loc, zoom: 16 })} />
//       </div>

//       {/* --- ERROR & LOCATION INFO --- */}
//       {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm mb-2">{error}</p>}
//       <div className="flex flex-wrap items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-md">
//         <span className="font-medium text-gray-700">Map Location:</span>
//         <span className="text-sm font-mono text-blue-600">Lat: {coords.lat?.toFixed(6) || '...'}</span>
//         <span className="text-sm font-mono text-blue-600">Lng: {coords.lng?.toFixed(6) || '...'}</span>
//       </div>

//       <p className="text-sm text-gray-500 mb-4">
//         Use the drawing tools (polygon or rectangle) on the left to mark your property.
//       </p>

//       {/* --- MAP CONTAINER --- */}
//       <div className="h-[400px] rounded-md overflow-hidden z-0 border border-gray-300">
//         <MapContainer
//           center={[coords.lat, coords.lng]}
//           zoom={coords.zoom}
//           style={{ height: '100%', width: '100%' }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <AutoCenterMap coords={coords} />
          
//           <FeatureGroup ref={featureGroupRef}>
//             <EditControl
//               position="topleft"
//               onCreated={onCreated}
//               onEdited={onEditStop}
//               onDeleted={onDeleteStop}
              
//               draw={{
//                 rectangle: drawStyleOptions,
//                 polygon: drawStyleOptions,
//                 circle: false,
//                 marker: false, 
//                 circlemarker: false,
//                 polyline: false,
//               }}
//               edit={{
//                 edit: {}, 
//                 remove: {},
//               }}
//             />
//           </FeatureGroup>
//         </MapContainer>
//       </div>

//       {/* --- AREA & CENTER DISPLAY --- */}
//       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-indigo-50 p-4 rounded-lg text-center">
//             <div className="text-2xl font-bold text-indigo-800">{selectedArea.toLocaleString()}</div>
//             <div className="text-sm font-medium text-indigo-600">Selected Area (sq m)</div>
//         </div>
//          <div className="bg-gray-50 p-4 rounded-lg text-center">
//             <div className="text-sm font-bold text-gray-800 truncate">
//                 {shapeCenter ? `${shapeCenter.lat.toFixed(6)}, ${shapeCenter.lng.toFixed(6)}` : 'N/A'}
//             </div>
//             <div className="text-sm font-medium text-gray-600">Shape Center (Lat, Lng)</div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default LandMapSelector; 



import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { area as turfArea } from '@turf/area';
import { centroid as turfCentroid } from '@turf/centroid';
import { LocateFixed, Trash2, Search, MapPinned } from 'lucide-react';

// --- Leaflet Draw CSS ---
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// --- Fix for default Leaflet icon ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * A component to automatically center the map when coords change.
 */
const AutoCenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords.lat && coords.lng) {
      map.flyTo([coords.lat, coords.lng], 16); // Fly to new location
    }
  }, [coords, map]);
  return null;
};

/**
 * A search component for finding locations.
 */
const MapSearch = ({ onLocationSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef(null);

    const handleSearch = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setLoading(true);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!newQuery) {
            setResults([]);
            setLoading(false);
            return;
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                // Search limited to India
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newQuery)}&countrycodes=in`);
                const data = await response.json();
                setResults(data);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    const handleSelect = (result) => {
        onLocationSelect({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
        });
        setQuery(result.display_name);
        setResults([]);
    };

    return (
        <div className="relative w-full md:w-1/2">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search for a location (e.g., Airoli, Mumbai)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {(loading || results.length > 0) && (
                <ul className="absolute z-[1000] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {loading && <li className="px-4 py-2 text-gray-500">Searching...</li>}
                    {results.map(result => (
                        <li
                            key={result.osm_id}
                            onClick={() => handleSelect(result)}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                        >
                            {result.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


/**
 * The main map selector component for drawing land boundaries.
 */
const LandMapSelector = ({ 
    title, 
    onCoordsFetched = () => {}, 
    onShapeDrawn = () => {} 
}) => {
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629, zoom: 5 }); // Default: India
  const [error, setError] = useState(null);
  const featureGroupRef = useRef();

  const [selectedArea, setSelectedArea] = useState(0);
  const [shapeCenter, setShapeCenter] = useState(null);

  const fetchUserLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
        setError("Error: Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude, zoom: 16 };
        setCoords(newCoords);
        if (onCoordsFetched) onCoordsFetched(newCoords); 
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(`Error: ${err.message}. (Ensure you are on HTTPS/localhost and allowed permissions).`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Auto-fetch user's current location on mount
  useEffect(() => {
    fetchUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  // Helper to calculate area & center and return data object
  const calculateShapeData = (geometry) => {
    if (!geometry) {
        setSelectedArea(0);
        setShapeCenter(null);
        return { geometry: null, area: 0, center: null };
    }

    try {
        if (geometry.type === 'Point') {
            const center = { lat: geometry.coordinates[1], lng: geometry.coordinates[0] };
            setSelectedArea(0);
            setShapeCenter(center);
            return { geometry, area: 0, center };
        } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            const area = Math.round(turfArea(geometry));
            const centerPoint = turfCentroid(geometry);
            const center = {
                lat: centerPoint.geometry.coordinates[1],
                lng: centerPoint.geometry.coordinates[0]
            };
            setSelectedArea(area);
            setShapeCenter(center);
            return { geometry, area, center };
        }
    } catch (e) {
        console.error("Error calculating shape data:", e);
        setSelectedArea(0);
        setShapeCenter(null);
    }
    return { geometry: null, area: 0, center: null };
  };


  // ✅ FIX: Shape now stays on the map
  const onCreated = (e) => {
    const { layer } = e;
    // 1. Clear any old layers
    featureGroupRef.current?.clearLayers();
    // 2. Add the new layer to the feature group
    featureGroupRef.current?.addLayer(layer);
    
    // 3. Calculate data and send to parent
    const geoJSON = layer.toGeoJSON();
    const geometry = geoJSON.geometry; 
    const data = calculateShapeData(geometry);
    onShapeDrawn(data);
  };

  // Handle shape edit
  const onEditStop = (e) => {
    const layers = e.layers.getLayers();
    if (layers.length > 0) {
      const editedLayer = layers[0];
      const geoJSON = editedLayer.toGeoJSON();
      const geometry = geoJSON.geometry;
      const data = calculateShapeData(geometry);
      onShapeDrawn(data);
    }
  };

  // Handle shape deletion
  const onDeleteStop = () => {
    calculateShapeData(null); 
    onShapeDrawn({ geometry: null, area: 0, center: null });
  };

  // ✅ FIX: "Clear" button now works
  const clearAllShapes = () => {
    featureGroupRef.current?.clearLayers();
    onDeleteStop();
  };

  // ✅ FIX: Rectangle highlight style
  const drawShapeOptions = { 
    shapeOptions: { 
      color: '#4f46e5',
      fillColor: '#6366f1',
      fillOpacity: 0.5 
    },
    showArea: true, // This forces the highlight to show
    metric: true
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <MapPinned className="inline-block h-6 w-6 mr-2 text-indigo-600"/>
          {title || "Select Your Property Area"}
        </h2>
        <div className="flex gap-2">
            <button type="button" onClick={fetchUserLocation} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                <LocateFixed className="w-4 h-4"/> My Location
            </button>
            <button type="button" onClick={clearAllShapes} className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2">
                <Trash2 className="w-4 h-4"/> Clear
            </button>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="mb-4">
        <MapSearch onLocationSelect={(loc) => setCoords({ ...loc, zoom: 16 })} />
      </div>

      {/* --- ERROR & LOCATION INFO --- */}
      {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm mb-2">{error}</p>}
      <div className="flex flex-wrap items-center space-x-4 mb-4 p-3 bg-gray-50 rounded-md">
        <span className="font-medium text-gray-700">Map Location:</span>
        <span className="text-sm font-mono text-blue-600">Lat: {coords.lat?.toFixed(6) || '...'}</span>
        <span className="text-sm font-mono text-blue-600">Lng: {coords.lng?.toFixed(6) || '...'}</span>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Use the drawing tools (polygon or rectangle) on the left to mark your property.
      </p>

      {/* --- MAP CONTAINER --- */}
      <div className="h-[400px] rounded-md overflow-hidden z-0 border border-gray-300">
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={coords.zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <AutoCenterMap coords={coords} />
          
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topleft"
              onCreated={onCreated}
              onEdited={onEditStop}
              onDeleted={onDeleteStop}
              
              draw={{
                rectangle: drawShapeOptions, // Apply style
                polygon: drawShapeOptions,   // Apply style
                circle: false,
                marker: false, 
                circlemarker: false,
                polyline: false,
              }}
              edit={{
                edit: {}, 
                remove: {},
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      {/* --- AREA & CENTER DISPLAY --- */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-800">{selectedArea.toLocaleString()}</div>
            <div className="text-sm font-medium text-indigo-600">Selected Area (sq m)</div>
        </div>
         <div className="bg-indigo-50 p-4 rounded-lg text-center">
            <div className="text-sm font-bold text-indigo-800 truncate">
                {shapeCenter ? `${shapeCenter.lat.toFixed(6)}, ${shapeCenter.lng.toFixed(6)}` : 'N/A'}
            </div>
            <div className="text-sm font-medium text-indigo-600">Shape Center (Lat, Lng)</div>
        </div>
      </div>

    </div>
  );
};

export default LandMapSelector;