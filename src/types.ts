import * as Immutable from 'immutable';

export type StateType = Immutable.Map<any, any>;

export interface IModel {
    key?: string;
    signals: any;    
    models: any;
    $state: any;
};

export interface IModelTemplateActions {
    [index: string]: any; //Function;
};

export interface IModelTemplateModels {
    [index: string]: any;//IModel;
};

export type FromStateType = (state: StateType) => any;
export type ToStateType = (state: any) => StateType;

export interface IModelTemplate {
    key?: string;
    initialState?: any;
    actions?: IModelTemplateActions;
    models?: IModelTemplateModels;
};

//export interface IModelSignals {}
export type IModelSignals = any;

