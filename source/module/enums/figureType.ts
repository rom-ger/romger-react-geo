import { TypeService } from '@romger/react-global-module/lib/services';
import { IFigureType } from '../../interfaces';

export enum FigureTypeEnum {
    POINT = 'POINT',
    POLYLINE = 'POLYLINE',
    POLYGON = 'POLYGON',
}

const FIGURE_TYPE: IFigureType = {
    POINT: {
        name: 'Точка',
        value: 'POINT',
        geoJsonType: 'Point',
    },
    POLYLINE: {
        name: 'Линия',
        value: 'POLYLINE',
        geoJsonType: 'LineString',
    },
    POLYGON: {
        name: 'Полигон',
        value: 'POLYGON',
        geoJsonType: 'Polygon',
    },
};

export default FIGURE_TYPE;

export const FigureTypeEnumType = TypeService.createEnum<FigureTypeEnum>(FigureTypeEnum, 'FigureTypeEnum');
