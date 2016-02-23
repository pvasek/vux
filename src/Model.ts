import * as Immutable from 'immutable';
import * as _ from 'lodash';
import { IModel, IModelTemplate, StateType, FromStateType, ToStateType } from './types';
import { buildSignalsObject, buildInitialStateObject, buildStateProxyObject } from './utils';

export const defaultSettings = {
    transformations: {
        fromActionState: state => {
            return state;
        },
        toActionState: state => {
            return state;
        },
        useJsStateForActions() {
            this.fromActionState = state => {
                return Immutable.fromJS(state);
            };
            this.toActionState = state => {
                return state.toJS();
            }
        }
    }      
};

export class Model implements IModel {   
    
    constructor(template: IModelTemplate) {
        this.key = template.key || 'ROOT';
        this.template = template;
        this.getStateItem = this.getStateItem.bind(this);
        this.setStateItem = this.setStateItem.bind(this);
        this.getWholeState = this.getWholeState.bind(this);
        this.setWholeState = this.setWholeState.bind(this);
        this.signals = buildSignalsObject(template.actions, this.getWholeState, this.setWholeState);        
        this.rebuildModels(template.models, template.initialState);
        this.rebuildStateProxy(template.initialState);
        this.state = buildInitialStateObject(this.template.initialState, this.models, this.toState);
    }
    
    key: string;
    newState: StateType;
    state: StateType;
    signals: any;
    models: any;
    $state: any;

    private parent: Model;
    private template: any;    
    private subscribers = [];

    private toState(originalStateFormat: any): StateType {
        return  Immutable.fromJS(originalStateFormat);
    }
        
    private propagateStateUp() {
        
        const ownState = this.getCurrentState();

        const modelsState = Object.getOwnPropertyNames(this.models).reduce((acc, key) => {
            const value = this.models[key].getCurrentState();
            acc[key] = value;
            return acc; 
        }, {});
        
        this.newState = ownState.merge(modelsState);
        
        if (this.parent) {
            this.parent.propagateStateUp();
        } else {
            this.setState(this.newState);
        }
    }
    
    private rebuildModels(models: any,  state: StateType) {
        this.models = _.merge({}, models);
        Object.getOwnPropertyNames(this.models).forEach(key => {
            const model = this.models[key];
            model.key = key;
            model.parent = this; 
        });                               
    }
    
    private rebuildStateProxy(state = this.state) {        
        const getStateItem = key => {
            const value = this.getStateItem(key);
            const isImmutable = Immutable.Map.isMap(value) 
                || Immutable.List.isList(value)
                || Immutable.Set.isSet(value); 
            return isImmutable ? value.toJS() : value;
        };
        this.$state = buildStateProxyObject(state, this.models, getStateItem, this.setStateItem);;
    }
    
    private getCurrentState() {
        return this.newState || this.state;
    }
    
    private notifySubscribers() {
        const state = this.state;
        this.subscribers.forEach(subscriber => {
            try {
                subscriber(state);
            } catch(e) {
                console.error(e);
            }
        })
    }

    private getWholeState() {
        return defaultSettings.transformations.toActionState(this.state);    
    }
    
    private setWholeState(state: StateType) {        
        this.newState = defaultSettings.transformations.fromActionState(state);
        this.propagateStateUp();
    }
    
    private getStateItem(key: string): any {
        return this.state.get(key);
    }
    
    setStateItem(key: string, value: any) {
        this.newState = this.state.set(key, value);
        this.propagateStateUp();
    }
    
    initialize() {
        const initalState = buildInitialStateObject(this.template.initialState, this.models, this.toState);
        this.setState(initalState);    
    }
    
    setState(newState) {
        this.state = newState;
        this.newState = null;
        Object.getOwnPropertyNames(this.models).forEach(key => {
            this.models[key].setState(this.getStateItem(key)); 
        });
        this.notifySubscribers();
    }
    
    subscribe(callback: (state) => void): () => void {
        this.subscribers.push(callback);
        return () =>  {
            const subscriberIndex = this.subscribers.indexOf(callback);
            if (subscriberIndex > -1) {
                this.subscribers.splice(subscriberIndex, 1);
            }
        };
    }
    
    updateModels(models: any) {
        const originalState = this.state;
        this.rebuildModels(models, this.state);
        const initalState = buildInitialStateObject(this.template.initialState, this.models, this.toState);        
        this.newState = initalState.merge(originalState);
        this.propagateStateUp();
        this.rebuildStateProxy();
    }
}