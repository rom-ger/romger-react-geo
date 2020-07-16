interface IFigureTypeObject {
    name: string;
    value: string;
    geoJsonType: string;
}

interface IFigureType {
    [index: string]: IFigureTypeObject;

    POINT: IFigureTypeObject;
    POLYLINE: IFigureTypeObject;
    POLYGON: IFigureTypeObject;
}

export {
    IFigureTypeObject,
    IFigureType,
};
