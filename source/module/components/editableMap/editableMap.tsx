declare const L: any;
import classnames from 'classnames';
import { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import drawLocales, { Language } from 'leaflet-draw-locales';
// @ts-ignore
import isEqual from 'lodash.isequal';
import * as React from 'react';
import { FeatureGroup, Map, TileLayer } from 'react-leaflet';
// @ts-ignore
import { EditControl } from 'react-leaflet-draw';
import { GeoPoint } from '../../models/geoPoint';

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

let geocoderControl: any = null;
let geocoder: any = null;

const EditableMap = (props: IEditableMapProps) => {
    const mapRef = React.useRef<Map | null>(null);
    const featureGroupRef = React.useRef<FeatureGroup | null>(null);
    const isInit = React.useRef(false);

    /**
     * Получить параметры отрисовки для линий
     */
    const getShapeOptions = () => ({
        color: props.lineColor ?? 'blue',
        weight: props.lineWeight ?? 1,
    });

    /**
     * Инициируем геокодер
     */
    const initGeocoder = () => {
        try {
            if (!mapRef.current?.leafletElement) {
                const timeout: number = 100;
                window.setTimeout(() => initGeocoder(), timeout);
                return;
            }
            if (!geocoderControl) {
                geocoderControl = L.Control.geocoder()
                    .addTo(mapRef.current.leafletElement);
            }
            if (!geocoder) {
                geocoder = new L.Control.Geocoder.Nominatim();
                if (props.createGeocoderCallback) {
                    props.createGeocoderCallback(geocoder, mapRef.current.leafletElement);
                }
            }
        } catch (e) {
            const timeout: number = 100;
            window.setTimeout(() => initGeocoder(), timeout);
        }
    }

    const shapeOptions = React.useRef(getShapeOptions());

    /**
     * Слои для отрисовки инициализировались
     * @param ref
     */
    const onFeatureGroupReady = (ref: FeatureGroup | null) => {
        if (!!featureGroupRef.current || !ref) return;

        featureGroupRef.current = ref;

        redrawGeoJsonLayers();

        isInit.current = true;
    };

    /**
     * Перерисовать geoJson
     */
    const redrawGeoJsonLayers = () => {
        const geoJson = featureGroupRef.current?.leafletElement.toGeoJSON();

        /**
         * Проверяем, нужно ли перерисовать слои geoJson. Используется для обхода внутренней
         * ошибки leaflet-draw при изменении координат объекта типа "POINT"
         */
        const skipRedraw =
            (isEqual(geoJson, props.geoJson) && isEqual(shapeOptions.current, getShapeOptions()))
            || typeof props.geoJson === 'undefined';

        if (skipRedraw) return;

        if (!props.geoJson) {
            featureGroupRef.current?.leafletElement.clearLayers();
            return;
        }

        const boundPad = 0.005;
        const leafletGeoJSON = new L.GeoJSON(props.geoJson);
        featureGroupRef.current?.leafletElement.clearLayers();

        leafletGeoJSON.eachLayer((layer: L.GeoJSON) => {
            if (!!layer.setStyle) {
                layer.setStyle(getShapeOptions());
            }
            featureGroupRef.current?.leafletElement?.addLayer(layer);
        });

        if (!isInit.current && featureGroupRef.current) {
            const bounds = featureGroupRef.current.leafletElement.getBounds();
            const boundsWithPad = featureGroupRef.current.leafletElement.getBounds()
                .pad(0.5);

            const newBounds = boundsWithPad.equals(bounds)
                ? new L.LatLngBounds(
                    { lat: bounds.getNorthWest().lat - boundPad, lng: bounds.getNorthWest().lng - boundPad },
                    { lat: bounds.getSouthEast().lat + boundPad, lng: bounds.getSouthEast().lng + boundPad },
                )
                : boundsWithPad;

            mapRef.current?.leafletElement.fitBounds(newBounds);
        }

    };

    /**
     * Обновить geoJson
     */
    const updateGeoJson = () => {
        const geoJson = featureGroupRef.current?.leafletElement.toGeoJSON();
        if (geoJson) {
            props.updateGeoJson?.(geoJson);
        }
    };

    /**
     * Кастомизация настроек карты
     */
    const rewriteMapCustomSettings = () => {
        drawLocales(props.locale ?? 'ru');
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: props.markerIconRetinaUrl ?? 'assets/images/map/marker-icon.png',
            iconUrl: props.markerIconUrl ?? 'assets/images/map/marker-icon.png',
            shadowUrl: props.markerShadowUrl ?? 'assets/images/map/marker-shadow.png',
        });
    };

    React.useEffect(
        () => {
            rewriteMapCustomSettings();
            initGeocoder();
        },
        [],
    );

    React.useEffect(
        () => {
            redrawGeoJsonLayers();
            shapeOptions.current = getShapeOptions();
        },
        [props.geoJson, props.lineWeight, props.lineColor],
    );

    return (
        <div
            className={classnames(
                'editable-map',
            )}
        >
            <Map
                ref={mapRef}
                zoom={props.defaultZoom}
                center={
                    props.defaultCenter
                        ? [props.defaultCenter.latitude, props.defaultCenter.longitude]
                        : [0, 0]
                }
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FeatureGroup
                    ref={reactFGref => onFeatureGroupReady(reactFGref)}
                >
                    <EditControl
                        position={props.editControlPosition ?? 'topright'}
                        onEdited={() => updateGeoJson()}
                        onCreated={() => updateGeoJson()}
                        onDeleted={() => updateGeoJson()}
                        edit={{
                            edit: !props.disabled,
                            remove: !props.disabled,
                        }}
                        draw={{
                            marker: !props.disabled && !props.hideMarkerCreateButton,
                            circle: !props.disabled && !props.hideCircleCreateButton && getShapeOptions(),
                            polygon: !props.disabled && !props.hidePolygonCreateButton && getShapeOptions(),
                            polyline: !props.disabled && !props.hidePolylineCreateButton && getShapeOptions(),
                            rectangle: !props.disabled && !props.hideRectangleCreateButton && getShapeOptions(),
                            circlemarker: !props.disabled && !props.hideCircleMarkerCreateButton && getShapeOptions(),
                        }}
                    />
                </FeatureGroup>
            </Map>
        </div>
    );
};

export default EditableMap;
