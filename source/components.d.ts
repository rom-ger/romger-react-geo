import { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import { Language } from 'leaflet-draw-locales';
import * as React from 'react';
import { GeoData, GeoPoint } from './models';

interface IEditableMapProps {
    defaultZoom: number;
    defaultCenter?: GeoPoint;
    geoJson?: FeatureCollection | Feature | null;
    updateGeoJson?: (geoJson: GeoJsonObject) => any;
    createGeocoderCallback?: (geocoder: any, map: any) => any;

    // Draw control
    locale?: Language;
    disabled?: boolean;
    editControlPosition?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

    // Drawing
    lineColor?: string | null;
    lineWeight?: number | null;
    hideCircleCreateButton?: boolean;
    hideMarkerCreateButton?: boolean;
    hidePolygonCreateButton?: boolean;
    hidePolylineCreateButton?: boolean;
    hideRectangleCreateButton?: boolean;
    hideCircleMarkerCreateButton?: boolean;

    // Marker icon
    markerIconUrl?: string;
    markerShadowUrl?: string;
    markerIconRetinaUrl?: string;
}

declare class EditableMap extends React.Component<IEditableMapProps, any> {
}

interface IGeoDataComponent {
    geoData: GeoData | null;
    defaultLng: number;
    defaultLat: number;
    searchPrefix?: string;
    editMode?: boolean;
    updateGeoData?: (geoData: GeoData) => any;
}

declare class GeoDataComponent extends React.Component<IGeoDataComponent, any> {
}

export {
    EditableMap,
    GeoDataComponent,
};
