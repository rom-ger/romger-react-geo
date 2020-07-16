import { OrderedValue } from '@romger/react-global-module/lib/models';
import * as t from 'io-ts';
import { FigureTypeEnum } from './enums';
import { IFigureTypeObject } from './interfaces';
import { GeoPointType } from './module/models/geoPoint';

declare class GeoPoint {
    latitude: number;
    longitude: number;

    constructor(params: IGeoPointDTO);
}

interface IGeoPointDTO extends t.TypeOf<typeof GeoPointType> {
}

declare const GeoDataType: t.TypeC<{
    figureType: t.UnionC<[t.Type<FigureTypeEnum, FigureTypeEnum, unknown>, t.NullC]>;
    geoPoints: t.ArrayC<t.TypeC<{
        orderNumber: t.NumberC;
        value: t.UnknownC;
    }>>;
    lineWidth: t.UnionC<[t.NumberC, t.NullC]>;
    color: t.UnionC<[t.StringC, t.NullC]>;
}>;

declare class GeoData {
    figureType: IFigureTypeObject | null;
    geoPoints: Array<OrderedValue<GeoPoint>>;
    lineWidth: number | null;
    color: string | null;

    constructor(params: IGeoDataDTO);
}

interface IGeoDataDTO extends t.TypeOf<typeof GeoDataType> {
}

export {
    GeoPoint, IGeoPointDTO, GeoPointType,
    GeoData, IGeoDataDTO, GeoDataType,
};
