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
            acc[key] = this.models[key].getCurrentState()
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
        this.$state = buildStateProxyObject(state, models, this.getStateItem, this.setStateItem);        
        Object.getOwnPropertyNames(this.models).forEach(key => {
            this.models[key].parent = this; 
        });
    }
    
    private getCurrentState() {
        return this.newState || this.state;
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
}