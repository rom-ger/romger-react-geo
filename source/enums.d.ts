import * as t from 'io-ts';
import { IFigureType } from './interfaces';

declare enum FigureTypeEnum {
    POINT = 'POINT',
    POLYLINE = 'POLYLINE',
    POLYGON = 'POLYGON',
}

declare const FIGURE_TYPE: IFigureType;
declare const FigureTypeEnumType: t.Type<FigureTypeEnum, FigureTypeEnum, unknown>;

export {
    FIGURE_TYPE, FigureTypeEnum, FigureTypeEnumType,
};
