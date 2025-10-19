
import React, { useState, useRef, useEffect } from 'react';
import { MapPinned } from 'lucide-react';

// This component now manually loads Leaflet to ensure stability and avoid import issues.

const LandMapSelector = ({ onAreaSelect, title }) => {
    const mapRef = useRef(null); // Ref for the map container div
    const leafletMap = useRef(null); // Ref to store the map instance
    const drawnItems = useRef(null); // Ref for the feature group holding drawn items

    const [leafletLoaded, setLeafletLoaded] = useState(false);
    const [selectedArea, setSelectedArea] = useState(0); // Area of the single drawn shape

    // 1. Load Leaflet and Leaflet.draw scripts and styles robustly
    useEffect(() => {
        // If Leaflet is already on the window, no need to load again
        if (window.L && window.L.draw) {
            setLeafletLoaded(true);
            return;
        }

        // Helper function to add a script to the document head
        const loadScript = (src, onLoad) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = onLoad;
            document.head.appendChild(script);
        };
        
        // Helper function to add a CSS link to the document head
        const loadCSS = (href) => {
            const link = document.createElement('link');
            link.href = href;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        };

        loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css');

        // Chain the script loading to ensure dependencies are met in order
        loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', () => {
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js', () => {
                loadScript('https://unpkg.com/leaflet-geometryutil', () => {
                    // Fix for default Leaflet marker icon path when using a CDN
                    window.L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';
                    setLeafletLoaded(true);
                });
            });
        });

    }, []);

    // 2. Initialize and manage the map instance
    useEffect(() => {
        // Wait until leaflet is loaded and the container is ready
        if (!leafletLoaded || !mapRef.current || leafletMap.current) return;

        const L = window.L;
        leafletMap.current = L.map(mapRef.current).setView([19.0760, 72.8777], 13); // Default to Mumbai
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(leafletMap.current);

        drawnItems.current = new L.FeatureGroup();
        leafletMap.current.addLayer(drawnItems.current);

        const drawControl = new L.Control.Draw({
            edit: { 
                featureGroup: drawnItems.current,
                edit: false, // Disabling editing for simplicity
                remove: true,
            },
            draw: {
                polygon: { shapeOptions: { color: '#4f46e5', fillColor: '#6366f1', fillOpacity: 0.5 } },
                rectangle: { shapeOptions: { color: '#4f46e5', fillColor: '#6366f1', fillOpacity: 0.5 } },
                marker: true,
                polyline: false,
                circle: false,
                circlemarker: false,
            },
        });
        leafletMap.current.addControl(drawControl);

        const handleDrawCreate = (e) => {
            const layer = e.layer;
            drawnItems.current.clearLayers(); // Enforce a single selection
            drawnItems.current.addLayer(layer);
            updateMapData();
        };

        const handleDrawDelete = () => {
            updateMapData(); // Update when the shape is deleted
        };

        leafletMap.current.on(L.Draw.Event.CREATED, handleDrawCreate);
        leafletMap.current.on(L.Draw.Event.DELETED, handleDrawDelete);

        // Attempt to find user's location on initial load
        leafletMap.current.locate({ setView: true, maxZoom: 16 });
        
        // Cleanup on component unmount
        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
                leafletMap.current = null;
            }
        };
    }, [leafletLoaded]);

    // This function gathers data from the single drawn shape and sends it to the parent
    const updateMapData = () => {
        if (!drawnItems.current || !window.L.GeometryUtil) return;

        let center, area = 0;
        const layers = drawnItems.current.getLayers();

        if (layers.length > 0) {
            const layer = layers[0];
            if (layer instanceof window.L.Polygon) {
                center = layer.getBounds().getCenter();
                area = window.L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
            } else if (layer instanceof window.L.Marker) {
                center = layer.getLatLng();
            }
        }
        
        setSelectedArea(Math.round(area));
        
        // Update parent component with new data or reset if no shape is present
        onAreaSelect({ 
            lat: center ? center.lat.toFixed(6) : null, 
            lng: center ? center.lng.toFixed(6) : null,
            area: Math.round(area)
        });
    };

    const getUserLocation = () => {
        if (leafletMap.current) {
            leafletMap.current.locate({ setView: true, maxZoom: 16 });
        }
    };

    const clearAllShapes = () => {
        if (drawnItems.current) {
            drawnItems.current.clearLayers();
            updateMapData();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <MapPinned className="inline-block h-8 w-8 mr-2 text-indigo-600"/>
                  {title || "Select Your Property Area"}
                </h2>
                <div className="flex gap-2">
                  <button type="button" onClick={getUserLocation} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">📍 My Location</button>
                  <button type="button" onClick={clearAllShapes} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2">🗑️ Clear Selection</button>
                </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
                Use the drawing tools on the map to mark your property. You can draw a rectangle, a polygon, or drop a pin.
            </p>
            
            <div ref={mapRef} className="w-full rounded-lg border-2 border-gray-300 shadow-lg" style={{ height: '500px', zIndex: 1 }}>
                {!leafletLoaded && (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200 animate-pulse">
                        <p className="text-gray-600">Loading Map...</p>
                    </div>
                )}
            </div>

            <div className="mt-4 bg-indigo-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-800">{selectedArea.toLocaleString()}</div>
                <div className="text-sm text-indigo-600">Selected Area (sq m)</div>
            </div>
        </div>
    );
};

export default LandMapSelector;

