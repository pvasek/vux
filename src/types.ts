export interface IModel {
    key?: string;
    signals: {};    
    models: {};
    $state: {};
};

export interface IModelTemplateActions {
    [index: string]: any; //Function;
};

export interface IModelTemplateModels {
    [index: string]: any;//IModel;
};

export interface IModelTemplate {
    key?: string;
    initialState?: any;
    actions?: IModelTemplateActions;
    models?: IModelTemplateModels;
};

//export interface IModelSignals {}
export type IModelSignals = any;

