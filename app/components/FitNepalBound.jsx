// import { useEffect } from "react";
// import { useMap } from "react-leaflet";
// import L from "leaflet";

// function FitNepalBounds({ data }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!map || !data) return;

//     const geojsonLayer = L.geoJSON(data);
//     const bounds = geojsonLayer.getBounds();

//     map.fitBounds(bounds, { padding: [2, 2] }); 
//   }, [map, data]);

//   return null;
// }

// export default FitNepalBounds;
