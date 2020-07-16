import * as t from 'io-ts';

export const GeoPointType = t.interface({
    latitude: t.number,
    longitude: t.number,
});

export interface IGeoPointDTO extends t.TypeOf<typeof GeoPointType> {
}

class GeoPoint {
    latitude: number;
    longitude: number;

    constructor(params: IGeoPointDTO) {
        this.latitude = params.latitude;
        this.longitude = params.longitude;
    }
}

export { GeoPoint };
