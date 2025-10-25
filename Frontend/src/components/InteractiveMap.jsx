// // import React, { useState, useRef, useEffect } from 'react';

// // const InteractiveMap = ({ onMapUpdate }) => {
// //   const mapRef = useRef(null);
// //   const leafletMap = useRef(null);
// //   const drawControl = useRef(null);
// //   const drawnItems = useRef(null);
// //   const [leafletLoaded, setLeafletLoaded] = useState(false);
// //   const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India default
// //   const [drawnShapes, setDrawnShapes] = useState([]);
// //   const [pins, setPins] = useState([]);
// //   const [totalArea, setTotalArea] = useState(0);

// //   // Load Leaflet and Leaflet.draw scripts and styles
// //   useEffect(() => {
// //     // This effect can be improved by checking if scripts/styles already exist
// //     // For simplicity, we'll keep the original dynamic loading logic.
// //     const leafletCSS = document.createElement('link');
// //     leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
// //     leafletCSS.rel = 'stylesheet';
// //     document.head.appendChild(leafletCSS);

// //     const drawCSS = document.createElement('link');
// //     drawCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
// //     drawCSS.rel = 'stylesheet';
// //     document.head.appendChild(drawCSS);

// //     const leafletScript = document.createElement('script');
// //     leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
// //     leafletScript.onload = () => {
// //       const drawScript = document.createElement('script');
// //       drawScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
// //       drawScript.onload = () => setLeafletLoaded(true);
// //       document.head.appendChild(drawScript);
// //     };
// //     document.head.appendChild(leafletScript);
// //   }, []);

// //   // Initialize and manage the map instance
// //   useEffect(() => {
// //     if (!leafletLoaded || !mapRef.current || leafletMap.current) return;

// //     const L = window.L;
// //     leafletMap.current = L.map(mapRef.current).setView(mapCenter, 13);
// //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //       attribution: '© OpenStreetMap contributors',
// //     }).addTo(leafletMap.current);

// //     drawnItems.current = new L.FeatureGroup();
// //     leafletMap.current.addLayer(drawnItems.current);

// //     drawControl.current = new L.Control.Draw({
// //       edit: { featureGroup: drawnItems.current },
// //       draw: {
// //         polygon: { shapeOptions: { color: '#97009c' } },
// //         rectangle: { shapeOptions: { color: '#97009c' } },
// //         circle: { shapeOptions: { color: '#97009c' } },
// //         polyline: false,
// //         circlemarker: false,
// //       },
// //     });
// //     leafletMap.current.addControl(drawControl.current);

// //     const handleDrawCreate = (e) => {
// //       const layer = e.layer;
// //       drawnItems.current.addLayer(layer);
// //       updateMapData();
// //     };

// //     const handleDrawEditOrDelete = () => {
// //       updateMapData();
// //     };

// //     leafletMap.current.on(L.Draw.Event.CREATED, handleDrawCreate);
// //     leafletMap.current.on(L.Draw.Event.EDITED, handleDrawEditOrDelete);
// //     leafletMap.current.on(L.Draw.Event.DELETED, handleDrawEditOrDelete);

// //     return () => {
// //       if (leafletMap.current) {
// //         leafletMap.current.off(L.Draw.Event.CREATED, handleDrawCreate);
// //         leafletMap.current.off(L.Draw.Event.EDITED, handleDrawEditOrDelete);
// //         leafletMap.current.off(L.Draw.Event.DELETED, handleDrawEditOrDelete);
// //         leafletMap.current.remove();
// //         leafletMap.current = null;
// //       }
// //     };
// //   }, [leafletLoaded]);

// //   // Update map center when mapCenter state changes
// //   useEffect(() => {
// //     if (leafletMap.current) {
// //       leafletMap.current.setView(mapCenter, 15);
// //     }
// //   }, [mapCenter]);

// //   // This function gathers all data and sends it to the parent
// //   const updateMapData = () => {
// //     if (!drawnItems.current) return;
    
// //     const shapesData = [];
// //     const pinsData = [];
// //     let currentTotalArea = 0;

// //     drawnItems.current.eachLayer((layer) => {
// //       if (layer instanceof window.L.Polygon || layer instanceof window.L.Rectangle) {
// //         const coords = layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]);
// //         shapesData.push({ type: 'polygon', coordinates: coords });
// //         currentTotalArea += window.L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
// //       } else if (layer instanceof window.L.Circle) {
// //         const center = layer.getLatLng();
// //         const radius = layer.getRadius();
// //         shapesData.push({ type: 'circle', center: [center.lat, center.lng], radius });
// //         currentTotalArea += Math.PI * radius * radius;
// //       } else if (layer instanceof window.L.Marker) {
// //         const latLng = layer.getLatLng();
// //         pinsData.push({ lat: latLng.lat, lng: latLng.lng });
// //       }
// //     });
    
// //     setDrawnShapes(shapesData);
// //     setPins(pinsData);
// //     setTotalArea(currentTotalArea);

// //     // Call the callback prop to update parent's state
// //     onMapUpdate({
// //         coordinates: shapesData,
// //         pinLocations: pinsData,
// //         area: Math.round(currentTotalArea).toString(),
// //     });
// //   };

// //   const clearAllShapes = () => {
// //     if (drawnItems.current) {
// //       drawnItems.current.clearLayers();
// //       updateMapData(); // This will reset the data in the parent as well
// //     }
// //   };

// //   const getUserLocation = () => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => setMapCenter([position.coords.latitude, position.coords.longitude]),
// //         (error) => console.error("Error getting location:", error)
// //       );
// //     }
// //   };

// //   return (
// //     <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
// //       <div className="flex justify-between items-center flex-wrap gap-4">
// //         <h3 className="text-xl font-semibold text-gray-800">🗺️ Interactive Land Map</h3>
// //         <div className="flex gap-2">
// //           <button type="button" onClick={getUserLocation} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">📍 My Location</button>
// //           <button type="button" onClick={clearAllShapes} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">🗑️ Clear All</button>
// //         </div>
// //       </div>

// //       <div ref={mapRef} className="w-full h-96 rounded-lg border-2 border-gray-300 shadow-lg" style={{ minHeight: '500px', zIndex: 1 }} />
      
// //       {/* Status Display */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //         <div className="bg-blue-100 p-4 rounded-lg text-center">
// //             <div className="text-2xl font-bold text-blue-800">{drawnShapes.length}</div>
// //             <div className="text-sm text-blue-600">Shapes Drawn</div>
// //         </div>
// //         <div className="bg-green-100 p-4 rounded-lg text-center">
// //             <div className="text-2xl font-bold text-green-800">{pins.length}</div>
// //             <div className="text-sm text-green-600">Pins Added</div>
// //         </div>
// //         <div className="bg-purple-100 p-4 rounded-lg text-center">
// //             <div className="text-2xl font-bold text-purple-800">{totalArea ? Math.round(totalArea) : '0'}</div>
// //             <div className="text-sm text-purple-600">Total Area (sq m)</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InteractiveMap;

// import React, { useState, useRef, useEffect } from 'react';
// import { MapPin, Trash2, Maximize, Target } from 'lucide-react';

// const InteractiveMap = ({ onMapUpdate }) => {
//     const mapRef = useRef(null);
//     const leafletMap = useRef(null);
//     const drawnItems = useRef(null);
//     const [leafletLoaded, setLeafletLoaded] = useState(false);
    
//     // --- NEW STATE FOR LAT/LNG ---
//     const [latitude, setLatitude] = useState('');
//     const [longitude, setLongitude] = useState('');
//     const [totalArea, setTotalArea] = useState(0);

//     // Load Leaflet scripts and styles
//     useEffect(() => {
//         const loadScript = (src, onLoad) => {
//             if (document.querySelector(`script[src="${src}"]`)) {
//                 if (onLoad) onLoad();
//                 return;
//             }
//             const script = document.createElement('script');
//             script.src = src;
//             script.onload = onLoad;
//             document.head.appendChild(script);
//         };

//         const loadStyle = (href) => {
//             if (document.querySelector(`link[href="${href}"]`)) return;
//             const link = document.createElement('link');
//             link.href = href;
//             link.rel = 'stylesheet';
//             document.head.appendChild(link);
//         };

//         loadStyle('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
//         loadStyle('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css');

//         loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', () => {
//             loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js', () => {
//                 setLeafletLoaded(true);
//             });
//         });
//     }, []);

//     // Initialize map
//     useEffect(() => {
//         if (!leafletLoaded || !mapRef.current || leafletMap.current) return;

//         const L = window.L;
//         leafletMap.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Default to India
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '© OpenStreetMap contributors',
//         }).addTo(leafletMap.current);

//         drawnItems.current = new L.FeatureGroup();
//         leafletMap.current.addLayer(drawnItems.current);

//         const drawControl = new L.Control.Draw({
//             edit: { 
//                 featureGroup: drawnItems.current,
//                 remove: true, // Enable the delete tool
//             },
//             // --- UPDATED: Only allow polygon drawing ---
//             draw: {
//                 polygon: { 
//                     shapeOptions: { color: '#97009c' },
//                     allowIntersection: false,
//                     drawError: {
//                         color: '#e1e100',
//                         message: '<strong>Oh snap!</strong> you can\'t draw that!'
//                     },
//                  },
//                 polyline: false,
//                 rectangle: false,
//                 circle: false,
//                 marker: false,
//                 circlemarker: false,
//             },
//         });
//         leafletMap.current.addControl(drawControl);

//         const handleDrawEvent = () => updateMapData();

//         leafletMap.current.on(L.Draw.Event.CREATED, (e) => {
//             // Clear previous shapes before adding a new one
//             drawnItems.current.clearLayers(); 
//             const layer = e.layer;
//             drawnItems.current.addLayer(layer);
//             updateMapData();
//         });
        
//         leafletMap.current.on(L.Draw.Event.EDITED, handleDrawEvent);
//         leafletMap.current.on(L.Draw.Event.DELETED, handleDrawEvent);

//         return () => {
//             leafletMap.current?.remove();
//             leafletMap.current = null;
//         };
//     }, [leafletLoaded]);

//     const updateMapData = () => {
//         if (!drawnItems.current || !window.L) return;
        
//         const L = window.L;
//         const layers = drawnItems.current.getLayers();
        
//         if (layers.length === 0) {
//             // Reset everything if no shapes are drawn
//             setTotalArea(0);
//             setLatitude('');
//             setLongitude('');
//             onMapUpdate({ coordinates: [], area: '0', latitude: '', longitude: '' });
//             return;
//         }

//         const layer = layers[0]; // We only allow one shape
//         let currentTotalArea = 0;
//         let shapesData = [];
//         let center = null;

//         if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
//             const coords = layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]);
//             shapesData.push({ type: 'polygon', coordinates: coords });
//             currentTotalArea = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
//             center = layer.getBounds().getCenter(); // --- GET THE CENTER ---
//         }
        
//         setTotalArea(currentTotalArea);

//         // --- UPDATE LAT/LNG STATE ---
//         if (center) {
//             setLatitude(center.lat.toFixed(6));
//             setLongitude(center.lng.toFixed(6));
//         }

//         // --- PASS LAT/LNG TO PARENT ---
//         onMapUpdate({
//             coordinates: shapesData,
//             area: Math.round(currentTotalArea).toString(),
//             latitude: center ? center.lat : '',
//             longitude: center ? center.lng : '',
//         });
//     };

//     const clearAllShapes = () => {
//         drawnItems.current?.clearLayers();
//         updateMapData();
//     };

//     const getUserLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const userCoords = [position.coords.latitude, position.coords.longitude];
//                     leafletMap.current?.setView(userCoords, 15);
//                     // Optionally drop a temporary marker
//                     window.L.marker(userCoords).addTo(leafletMap.current).bindPopup("Your Location").openPopup();
//                 },
//                 (error) => console.error("Error getting location:", error)
//             );
//         }
//     };

//     return (
//         <div className="space-y-4 p-6 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
//             <div className="flex justify-between items-center flex-wrap gap-4">
//                 <h3 className="text-xl font-semibold text-gray-800 flex items-center"><MapPin className="h-6 w-6 mr-2 text-indigo-600"/> Mark Property Location</h3>
//                 <div className="flex gap-2">
//                     <button type="button" onClick={getUserLocation} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"><Target size={16}/> My Location</button>
//                     <button type="button" onClick={clearAllShapes} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"><Trash2 size={16}/> Clear Shape</button>
//                 </div>
//             </div>

//             <div ref={mapRef} className="w-full h-96 rounded-lg border-2 border-gray-300 shadow-inner" style={{ minHeight: '500px', zIndex: 1 }} />
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-gray-100 p-4 rounded-lg">
//                     <label className="text-sm font-medium text-gray-500">Selected Area (sq m)</label>
//                     <div className="text-2xl font-bold text-gray-800">{totalArea ? Math.round(totalArea).toLocaleString() : '0'}</div>
//                 </div>
//                 {/* --- NEW LATITUDE/LONGITUDE DISPLAY --- */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-gray-100 p-4 rounded-lg">
//                          <label className="text-sm font-medium text-gray-500">Latitude</label>
//                          <input type="text" readOnly value={latitude} className="w-full bg-transparent text-lg font-bold text-gray-800 outline-none font-mono" placeholder="-" />
//                     </div>
//                      <div className="bg-gray-100 p-4 rounded-lg">
//                          <label className="text-sm font-medium text-gray-500">Longitude</label>
//                          <input type="text" readOnly value={longitude} className="w-full bg-transparent text-lg font-bold text-gray-800 outline-none font-mono" placeholder="-" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InteractiveMap;
