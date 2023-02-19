"use client";
import 'mapbox-gl/dist/mapbox-gl.css';

import { useEffect, useState } from 'react';
import {Map, NavigationControl, Marker} from 'react-map-gl';

interface geocodeObj {
    type: string;
    query: string[];
    features: featureObj[];
}

interface featureObj {
    id: string;
        type: string;
        place_type: string[];
        relevance: number;
        properties: Properties;
        text: string;
        place_name: string;
        center: number[];
        geometry: Geometry;
        context: Context[];
}

interface Context {
    id: string;
    text: string;
    wikidata: string;
    short_code: string;
}

interface Geometry {
    coordinates: number[];
    type: string;
}

interface Properties {
    foursquare: string;
    wikidata: string;
    landmark: boolean;
    address: string;
    category: string;
}

interface Props { search: string }

const Mapbox = ({search}: Props) => {

    const [coords, setCoords] = useState([] as number[])

    useEffect(() => {
      async function geocode(searchTerm: string) {
        let geocode = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?limit=1&access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`);
        let coordinates: geocodeObj = await geocode.json();
        const lat: number = coordinates.features[0].geometry.coordinates[1];
        const lon: number = coordinates.features[0].geometry.coordinates[0];

        setCoords([lat, lon])
      }
      geocode(search)
    }, [])
    return (
        <div>
            {coords[0] &&
            <Map
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
                initialViewState={{
                    longitude: coords[1],
                    latitude: coords[0],
                    zoom: 10
                }}
                style={{width: 667, height: 400}}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                <NavigationControl showZoom={true} position='top-right'/>
                <Marker latitude={coords[0]} longitude={coords[1]}/>
            </Map>}
        </div>
    )
}

export default Mapbox