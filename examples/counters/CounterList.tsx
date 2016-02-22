import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Model } from '../../src/Model';
import { View as Counter, createModel as createCounterModel } from './Counter';

export const createModel = () => {
    
    const model = new Model({});
    
    // use sub-model knowledge for calling their actions
    const counterModels = {};
    (model as any).counterCount = 0; 
    (model as any).addCounter = () => {
        counterModels[`counter${(model as any).counterCount}`] = createCounterModel();
        (model as any).counterCount += 1;
        model.updateModels(counterModels);       
    } 
    return model;
}

const range = (to) => {
    const result = [];
    for (let i = 0; i < to; i++) {
        result.push(i);
    }
    return result;
}
export class View extends Component<any,{}> {               
    render() {      
        const model = this.props.model;
        
        const items = range(model.counterCount).map(index => {
            const item = model.models[`counter${index}`];
            return (<Counter key={index} model={item}/>);
        });
            
        return (
            <div>
                <h2>List</h2>
                <div>
                    {items}                    
                </div>
                <div>
                    <button onClick={model.addCounter}>Add counter</button>
                </div>
            </div>
        );
    }
}