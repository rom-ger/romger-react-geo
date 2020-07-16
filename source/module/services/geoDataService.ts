import { OrderedValue } from '@romger/react-global-module/lib/models';
import { Feature, FeatureCollection, LineString, Point, Polygon, Position } from 'geojson';
import FIGURE_TYPE, { FigureTypeEnum } from '../enums/figureType';
import { GeoData } from '../models/geoData';
import { GeoPoint } from '../models/geoPoint';

export class GeoDataService {
    static getGeoDataFigureTypeByGeoJsonType = (geoJsonType: string) =>
        Object.values(FIGURE_TYPE)
            .find(type => type.geoJsonType === geoJsonType)

    static convertGeoJsonToGeoData = (geoJson: FeatureCollection<Point | Polygon | LineString>): GeoData | null => {
        const firstFeature = geoJson.features[0];
        if (!firstFeature) return null;

        const figureType = GeoDataService.getGeoDataFigureTypeByGeoJsonType(firstFeature.geometry.type);
        if (!figureType) return null;

        let coordinates: Position[] = [];

        if (figureType.value === FigureTypeEnum.POINT) {
            const feature = firstFeature as Feature<Point>;
            coordinates.push(feature.geometry.coordinates);
        }

        if (figureType.value === FigureTypeEnum.POLYLINE) {
            const feature = firstFeature as Feature<LineString>;
            coordinates = feature.geometry.coordinates;
        }

        if (figureType.value === FigureTypeEnum.POLYGON) {
            const feature = firstFeature as Feature<Polygon>;
            if (feature.geometry.coordinates.length) {
                coordinates = feature.geometry.coordinates[0];
            }
        }

        return {
            figureType,
            geoPoints: coordinates
                .map((coord, index) => ({
                    orderNumber: index,
                    value: new GeoPoint({
                        latitude: coord[0],
                        longitude: coord[1],
                    }),
                })),
            lineWidth: null,
            color: null,
        };
    }

    static convertGeoJsonToSendApi = (data: Array<OrderedValue<GeoPoint>>): Array<OrderedValue<GeoPoint>> => {
        let convertData: Array<OrderedValue<GeoPoint>> = [];
        data.forEach((el: OrderedValue<GeoPoint>) => {
            let newEl: OrderedValue<GeoPoint> = JSON.parse(JSON.stringify(el));
            let long: number = newEl.value.latitude;
            let lat: number = newEl.value.longitude;
            newEl.value.latitude = lat;
            newEl.value.longitude = long;
            convertData.push(newEl);
        });
        return convertData;
    }

    static convertGeoDataToGeoJson = (geoData: GeoData | null): FeatureCollection<Point | Polygon | LineString> | null => {
        if (!geoData || !geoData.geoPoints || !geoData.geoPoints.length) return null;

        let featureCollection: FeatureCollection<Point | Polygon | LineString> = {
            type: 'FeatureCollection',
            features: [],
        };

        const sortedCoords = geoData.geoPoints.sort((a, b) => a.orderNumber - b.orderNumber);

        if (geoData.figureType?.value === FigureTypeEnum.POINT) {
            const feature: Feature<Point> = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [sortedCoords[0].value.latitude, sortedCoords[0].value.longitude],
                },
                properties: {},
            };
            featureCollection.features.push(feature);
        }

        if (geoData.figureType?.value === FigureTypeEnum.POLYLINE) {
            const feature: Feature<LineString> = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: sortedCoords.map(point => [point.value.latitude, point.value.longitude]),
                },
                properties: {},
            };
            featureCollection.features.push(feature);
        }

        if (geoData.figureType?.value === FigureTypeEnum.POLYGON) {
            const feature: Feature<Polygon> = {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [sortedCoords.map(point => [point.value.latitude, point.value.longitude])],
                },
                properties: {},
            };
            featureCollection.features.push(feature);
        }

        return featureCollection;
    }
}
