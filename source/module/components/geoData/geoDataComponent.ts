import { RgReactBaseComponent, RgReactBaseComponentInterface } from '@romger/react-base-components';
import { SimpleObjectInterface } from '@romger/react-global-module/lib/interfaces';
import { FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { IFigureTypeObject } from '../../../interfaces';
import FIGURE_TYPE, { FigureTypeEnum } from '../../enums/figureType';
import { GeoData } from '../../models/geoData';
import { GeoPoint } from '../../models/geoPoint';
import { GeoDataService } from '../../services/geoDataService';
import geoDataTemplate from './geoDataTemplate';

interface IGeoDataComponentProps {
    geoData: GeoData | null;
    defaultLng: number;
    defaultLat: number;
    searchPrefix?: string;
    updateGeoData?: (geoData: GeoData) => any;
    editMode?: boolean;
}

interface IGeoDataComponentState {
    mapDefaultCenter: GeoPoint;
    geoData: GeoData | null;
    searchString: string | null;
}

export interface IGeoDataComponent extends RgReactBaseComponentInterface {
    props: IGeoDataComponentProps;
    state: IGeoDataComponentState;

    geocoder: any;
    map: any;
    lineWidthItems: number[];
    isExistFigureOnMap: boolean;
    mapDefaultZoom: number;
    showLineParams: boolean;
    parentLocation: string;

    updateGeoDataByGeoJson(geoJson: FeatureCollection<Point | Polygon | LineString>): void;

    updateGeoData(): any;

    updateFigureType(figureType: SimpleObjectInterface): void;

    updateLineWidth(lineWidth: number): void;

    updateLineColor(color: string): void;
    findMyLocation(): void;
    findPointBySearchString(): void;
}

export default class GeoDataComponent extends RgReactBaseComponent<IGeoDataComponentProps, IGeoDataComponentState> implements IGeoDataComponent {
    geocoder: any = null;
    map: any = null;
    mapDefaultZoom = 13;
    defaultLineColor = '#000dff';
    parentLocation: string = '';
    lineWidthItems = Array(9)
        .fill(null)
        .map((_item, index) => index + 1);

    state: IGeoDataComponentState = {
        mapDefaultCenter: {
            latitude: this.props.defaultLat,
            longitude: this.props.defaultLng,
        },
        geoData: null,
        searchString: null,
    };

    get isExistFigureOnMap() {
        return !!this.state.geoData?.geoPoints && !!this.state.geoData?.geoPoints.length;
    }

    get showLineParams() {
        return this.state.geoData?.figureType?.value === FigureTypeEnum.POLYLINE ||
        this.state.geoData?.figureType?.value === FigureTypeEnum.POLYGON;
    }

    componentDidMount() {
        let geoData = this.props.geoData ? { ...this.props.geoData } : {
            figureType: FIGURE_TYPE.POINT,
            geoPoints: [],
            lineWidth: null,
            color: null,
        };
        if (!geoData.figureType) {
            geoData.figureType = FIGURE_TYPE.POINT;
        }
        this.setState({
            geoData,
        });
        try {
            this.parentLocation = this.props.searchPrefix ?? '';
        } catch {
            //
        }
    }

    /**
     * Найти мою позицию
     */
    findMyLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!this.map) {
                    return;
                }
                this.setState({
                    searchString: null,
                });
                this.map.setView({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                const zoom: number = 18;
                this.map.setZoom(zoom);
            },
            () => {
                return;
            },
        );
    }

    /**
     * Найти точку по адресу
     */
    findPointBySearchString = () => {
        this.geocoder.geocode(`${this.parentLocation}${this.state.searchString}`, (result: any) => {
            if (!this.state.searchString || !result.length || !this.map) {
                return;
            }
            if (!this.map) {
                return;
            }
            const zoom: number = 18;
            this.map.setZoom(zoom);
            this.map.setView(result[0].center);
        });
    }

    /**
     * Обновить тип отображения
     * @param figureType
     */
    updateFigureType = (figureType: IFigureTypeObject) => {
        let geoDataState: GeoData | null = this.state.geoData ? { ...this.state.geoData } : { geoPoints: [], color: null, figureType: null, lineWidth: null };
        geoDataState.figureType = figureType;
        geoDataState.geoPoints = [];
        this.setState({ geoData: geoDataState }, () => this.updateGeoData());
    }

    /**
     * Обновить толщину линии
     * @param lineWidth
     */
    updateLineWidth = (lineWidth: number) => {
        let geoDataState: GeoData | null = this.state.geoData ? { ...this.state.geoData } : { geoPoints: [], color: null, figureType: null, lineWidth: null };
        geoDataState.lineWidth = lineWidth;
        this.setState({ geoData: geoDataState }, () => this.updateGeoData());
    }

    /**
     * Обновить цвет линии
     * @param color
     */
    updateLineColor = (color: string) => {
        let geoDataState: GeoData | null = this.state.geoData ? { ...this.state.geoData } : { geoPoints: [], color: null, figureType: null, lineWidth: null };
        geoDataState.color = color;
        this.setState({ geoData: geoDataState }, () => this.updateGeoData());
    }

    /**
     * Обновить гео-данные в стейте по geoJson
     * @param geoJson
     */
    updateGeoDataByGeoJson = (geoJson: FeatureCollection<Point | Polygon | LineString>) => {
        const geoData = GeoDataService.convertGeoJsonToGeoData(geoJson);
        let geoDataState: GeoData | null = this.state.geoData ? { ...this.state.geoData } : { geoPoints: [], color: null, figureType: null, lineWidth: null };
        geoDataState.geoPoints = geoData?.geoPoints ?? [];
        this.setState({
            geoData: geoDataState,
        },            () => this.updateGeoData());
    }

    /**
     * Сохранить изменения
     */
    updateGeoData() {
        if (!this.state.geoData || !this.props.updateGeoData) {
            return;
        }
        this.props.updateGeoData(this.state.geoData);
    }

    render(): false | JSX.Element {
        return geoDataTemplate(this);
    }
}
