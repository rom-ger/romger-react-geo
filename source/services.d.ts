
import { OrderedValue } from '@romger/react-global-module/lib/models';
import { FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { IFigureTypeObject } from './interfaces';
import { GeoData, GeoPoint } from './models';

interface IGeoDataService {
    getGeoDataFigureTypeByGeoJsonType(geoJsonType: string): IFigureTypeObject | undefined;
    convertGeoJsonToGeoData(geoJson: FeatureCollection<Point | Polygon | LineString>): GeoData | null;
    convertGeoJsonToSendApi(data: Array<OrderedValue<GeoPoint>>): Array<OrderedValue<GeoPoint>>;
    convertGeoDataToGeoJson(geoData: GeoData | null): FeatureCollection<Point | Polygon | LineString> | null;
}

declare const GeoDataService: IGeoDataService;

export {
    GeoDataService,
};
