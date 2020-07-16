import { FlexBox } from '@romger/react-flex-layout';
import { RgReactInput } from '@romger/react-input';
import { RgReactSelect } from '@romger/react-select';
import classnames from 'classnames';
import * as React from 'react';
import FIGURE_TYPE, { FigureTypeEnum } from '../../enums/figureType';
import { GeoDataService } from '../../services/geoDataService';
import EditableMap from '../editableMap/editableMap';
import { IGeoDataComponent } from './geoDataComponent';

const geoDataTemplate = (context: IGeoDataComponent) => (
    <FlexBox
        className={classnames(
            'tab-wrapper',
            'geo-data',
        )}
        column="start start"
    >
        {
            context.props.editMode &&
            <FlexBox
                rowWrap={'start end'}
                className={classnames(
                    'geo-data__input-row',
                )}
            >
                <FlexBox
                    className={classnames(
                        'geo-data__search-wrap',
                    )}
                >
                    <RgReactInput
                        topLabel={true}
                        label="Поиск"
                        iconSvg="assets/images/svg/baseline-my_location-24px.svg"
                        iconCallback={context.findMyLocation}
                        placeholder="Поиск места"
                        value={context.state.searchString ?? ''}
                        updateCallback={(e: any) => context.updateState(e?.target?.value ?? '', 'searchString', context.findPointBySearchString)}
                    />
                </FlexBox>
                <div
                    className={classnames(
                        'geo-data__input-block',
                    )}
                >
                    <RgReactSelect
                        topLabel
                        notRemove
                        required
                        modelField={'value'}
                        visibleField={'name'}
                        label={'Тип отображения'}
                        placeholder={'Выберите тип'}
                        model={context.state.geoData?.figureType ?? null}
                        items={() => Object.values(FIGURE_TYPE)}
                        updateModelHandler={context.updateFigureType}
                    />
                </div>
                {
                    context.showLineParams && [
                        <div
                            className={classnames(
                                'geo-data__input-block',
                            )}
                        >
                            <RgReactSelect
                                topLabel
                                notRemove
                                withoutField
                                label={'Толщина линии'}
                                placeholder={'Выберите толщину'}
                                items={() => context.lineWidthItems}
                                model={context.state.geoData?.lineWidth ?? null}
                                updateModelHandler={context.updateLineWidth}
                            />
                        </div>,
                        <div
                            className={classnames(
                                'geo-data__input-block',
                            )}
                        >
                            <input
                                type="color"
                                value={context.state.geoData?.color ?? ''}
                                className={classnames(
                                    'geo-data__color-picker',
                                )}
                                onChange={e => context.updateLineColor(e.target.value)}
                            />
                        </div>,
                    ]
                }
            </FlexBox>
        }
        {
            context.state.geoData?.figureType &&
            <EditableMap
                hideCircleCreateButton
                hideRectangleCreateButton
                hideCircleMarkerCreateButton
                disabled={!context.props.editMode}
                defaultZoom={context.mapDefaultZoom}
                updateGeoJson={context.updateGeoDataByGeoJson}
                defaultCenter={context.state.mapDefaultCenter}
                lineColor={context.state.geoData?.color}
                lineWeight={context.state.geoData?.lineWidth}
                createGeocoderCallback={(geocoder: any, map: any) => {
                    context.geocoder = geocoder;
                    context.map = map;
                }}
                geoJson={GeoDataService.convertGeoDataToGeoJson(context.state.geoData)}
                hideMarkerCreateButton={
                    context.isExistFigureOnMap ||
                    context.state.geoData?.figureType?.value !== FigureTypeEnum.POINT
                }
                hidePolygonCreateButton={
                    context.isExistFigureOnMap ||
                    context.state.geoData?.figureType?.value !== FigureTypeEnum.POLYGON
                }
                hidePolylineCreateButton={
                    context.isExistFigureOnMap ||
                    context.state.geoData?.figureType?.value !== FigureTypeEnum.POLYLINE
                }
            />
        }
    </FlexBox>
);

export default geoDataTemplate;
