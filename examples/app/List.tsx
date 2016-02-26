import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Subject, Observable } from '@reactivex/rxjs';
import { IModel } from '../../src/types';
import { Model } from '../../src/Model';

import { DataColumn } from './reactComponents/DataColumn';
import { View as Pager, createModel as pagerCreateModel } from './components/Pager';
import { View as Table, createModel as tableCreateModel } from './components/Table';

export const createModel = () => new Model({
    
    initialState: {
        data: [],
        loading: false
    },
    
    models: {
        pager: pagerCreateModel(),
        table: tableCreateModel()
    },
    
    actions: {        
        setData: (state, data) => state.merge({data}),
        setLoading: (state) => state.merge({loading: true}),
        resetLoading: (state) => state.merge({loading: false}) 
    },
    
    targets: {
        init$: e => e
    },
    
    cycle({init$, http$}, model: IModel){
        const foundImages$ = http$                   
            .flatMap((i: Response) => Observable.fromPromise(i.json()))
            .do(model.signals.resetLoading)
            .subscribe(model.signals.setData);
            
        return { 
            http$: init$
                .do(model.signals.setLoading)
                .map(i => 'http://jsonplaceholder.typicode.com/photos')             
        }
    }
    
});

export class View extends Component<any, {}> {
    private data = [
        { Id: '1', FirstName: "FirstName1", LastName: "LastName1"},
        { Id: '2', FirstName: "FirstName2", LastName: "LastName2"},
        { Id: '3', FirstName: "FirstName3", LastName: "LastName3"},
        { Id: '4', FirstName: "FirstName4", LastName: "LastName4"},    
        { Id: '5', FirstName: "FirstName5", LastName: "LastName5"},        
    ];
    
    componentWillMount() {
        this.props.model.$targets.init$();        
    }
    
    render() {
        const { model } = this.props;
        const selectedIds =  model.$state.table.selectedIds;
        
        if (model.$state.loading) {
            return <div>Loading...</div>;
        }
        
        return (
            <div>
                <Pager model={model.models.pager}/>
                
                {/*
                <BulkActionBar model={selectedIds}>
                    <ActionButton action={model.signals.delete}/>
                </BulkActionBar>
                */}
                
                <Table data={model.$state.data} model={model.models.table}>
                    <DataColumn title="Title" field="title"/>
                    <DataColumn title="Url" field="url"/>                
                </Table>
                
            </div>
        );
    }
};