import * as Immutable from 'immutable';
import * as _ from 'lodash';
import { IModel, IModelTemplate } from './types';
import { buildSignalsObject, buildInitialStateObject, buildStateProxyObject } from './utils';

type StateType = Immutable.Map<any, any>;

export class Model implements IModel {
    key: string;
    parent: Model;
    newState: StateType;
    state: StateType;
    template: any;
    signals: any;
    models: any;
    $state: any;
    
    constructor(template: IModelTemplate) {
        this.key = template.key || 'ROOT';
        this.template = template;
        this.getStateItem = this.getStateItem.bind(this);
        this.setStateItem = this.setStateItem.bind(this);
        this.signals = buildSignalsObject(template.actions, this.getStateItem, this.setStateItem);        
        this.rebuildModels(template.models, template.initialState);
        this.rebuildStateProxy(template.initialState);
    }
    
    private toState(originalStateFormat: any): StateType {
        return  Immutable.fromJS(originalStateFormat);
    }
    
    private getStateItem(key: string): any {
        return this.state.get(key);
    }
    
    private setStateItem(key: string, value: any) {
        this.newState = this.state.set(key, value);
        this.propagateStateUp();
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
        this.$state = buildStateProxyObject(state, this.models, this.getStateItem, this.setStateItem);;
    }
    
    private getCurrentState() {
        return this.newState || this.state || this.toState(this.template.initialState);
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
    }
    
    updateModels(models: any) {
        this.rebuildModels(models, this.state);
        const initalState = buildInitialStateObject(this.template.initialState, this.models, this.toState);
        this.newState = initalState.merge(this.state);
        this.propagateStateUp();
        this.rebuildStateProxy();
    }
}