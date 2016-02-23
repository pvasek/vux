import * as _ from 'lodash';
import { IModelTemplateActions, IModelSignals, IModelTemplateModels } from './types';

export type GetState = () => any;
export type SetState = (state: any) => void;

export type GetStateItem = (key: string) => any;
export type SetStateItem = (key: string, state: any) => void;
export type ToState = (originalStateFormat: any) => any;

export const buildSignalsObject = (
    actions: IModelTemplateActions,
    getState: GetState,
    setState: SetState): IModelSignals => {

    if (!actions) {
        return {};
    }

    const signalToAction = (key: string, action: Function) => {
        return (...args) => {
            const oldState = getState();
            const newState = action(oldState, ...args);
            setState(newState);
        };
    };

    return Object.getOwnPropertyNames(actions).reduce((result, key) => {
        result[key] = signalToAction(key, actions[key]);
        return result;
    }, {});
};

export const buildInitialStateObject = (initialState: any, models: IModelTemplateModels, toState: ToState): any => {

    const modelStates = models ? Object.getOwnPropertyNames(models).reduce((result, key) => {
        const model = models[key];        
        result[key] = buildInitialStateObject(model.template.initialState, model.models, state => state); //only final toState needs to be called
        return result;
    }, {}) : {};

    return toState(_.merge({}, initialState || {}, modelStates));
}

export const buildStateProxyObject = (initialState: any, models: IModelTemplateModels, getStateItem: GetStateItem, setStateItem: SetStateItem = null): any => {

    const modelGetter = (key: string) => () => models[key].$state;
    const stateGetter = function(key: string) {
        return function() {
            return getStateItem(key);
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
            get: stateGetter(key)
        });
        return result;
    }, proxy) : proxy;

    return proxy;
}

