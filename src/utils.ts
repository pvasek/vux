import * as _ from 'lodash';
import { IModelTemplateActions, IModelSignals, IModelTemplateModels } from './types';

export type GetStateItem = (key: string) => any;
export type SetStateItem = (key: string, state: any) => void;
export type ToState = (originalStateFormat: any) => any;

export const buildSignalsObject = (
    actions: IModelTemplateActions, 
    getStateItem: GetStateItem, 
    setStateItem: SetStateItem): IModelSignals => {

    if (!actions) {
        return {};
    }
    
    const signalToAction = (key: string, action: Function) => {
        return (...args) => { 
            const actionResult = action(getStateItem(key), ...args);
            setStateItem(key, actionResult);
        };
    };
    
    return Object.getOwnPropertyNames(actions).reduce((result, key) => {
        result[key] = signalToAction(key, actions[key]);
        return result;
    }, {});
};

export const buildInitialStateObject = (initialState: any, models: IModelTemplateModels, toState: ToState): any => {
    
     const modelStates = models ? Object.getOwnPropertyNames(models).reduce((result, key) => {
        result[key] = models[key].template.initialState;
        return result;
    }, {}) : {};
    
    return toState(_.merge({}, initialState, modelStates));
}

export const buildStateProxyObject = (initialState: any, models: IModelTemplateModels, getStateItem: GetStateItem, setStateItem: SetStateItem = null): any => {
    
    const modelGetter = (key: string) => () => models[key].$state;
    const stateGetter = function(key: string) { 
        return function() {
            return getStateItem(key); 
        } 
    };
    const stateSetter = function(key: string) { 
        return function(value: any) {
            return setStateItem(key, value); 
        } 
    };


    let proxy = models ? Object.getOwnPropertyNames(models).reduce(function(result, key) {
        Object.defineProperty(result, key, { 
            get: modelGetter(key)
        });
        return result;
    }, {}) : {};

    proxy = initialState ? Object.getOwnPropertyNames(initialState).reduce(function(result, key) {
        Object.defineProperty(result, key, { 
            get: stateGetter(key),
            set: stateSetter(key) 
        });
        return result;
    }, proxy) : proxy;
    
    return proxy;
}

