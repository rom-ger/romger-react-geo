import { OrderedValue, OrderedValueType } from '@romger/react-global-module/lib/models';
import * as t from 'io-ts';
import { IFigureTypeObject } from '../../interfaces';
import FIGURE_TYPE, { FigureTypeEnumType } from '../enums/figureType';
import { GeoPoint } from './geoPoint';

export const GeoDataType = t.interface({
    figureType: t.union([FigureTypeEnumType, t.null]),
    geoPoints: t.array(OrderedValueType),
    lineWidth: t.union([t.number, t.null]),
    color: t.union([t.string, t.null]),
});

export interface IGeoDataDTO extends t.TypeOf<typeof GeoDataType> {
}

class GeoData {
    figureType: IFigureTypeObject | null;
    geoPoints: Array<OrderedValue<GeoPoint>>;
    lineWidth: number | null;
    color: string | null;

    constructor(params: IGeoDataDTO) {
        this.figureType = params.figureType ? FIGURE_TYPE[params.figureType] : null;
        this.geoPoints = params.geoPoints
            .map(point => new OrderedValue<GeoPoint>(point));
        this.lineWidth = params.lineWidth;
        this.color = params.color;
    }
}

export { GeoData };
