import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Model } from '../../src/Model';

import { DataColumn } from './reactComponents/DataColumn';
import { View as Pager, createModel as pagerCreateModel } from './components/Pager';
import { View as Table, createModel as tableCreateModel } from './components/Table';

const actions = {
    NEW_ITEM: 'NEW_ITEM',
    DELETE: 'DELETE',
    DATA_LOADED: 'DATA_LOADED'
};

export const createModel = () => new Model({
    
    models: {
        pager: pagerCreateModel(),
        table: tableCreateModel()
    },
    
    actions: {        
        delete(state, ids) {
            
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
    
    render() {
        const { model } = this.props;
        const selectedIds =  model.$state.table.selectedIds;
        return (
            <div>
                <Pager model={model.models.pager}/>
                
                {/*
                <BulkActionBar model={selectedIds}>
                    <ActionButton action={model.signals.delete}/>
                </BulkActionBar>
                */}
                
                <Table data={this.data} model={model.models.table}>
                    <DataColumn title="First Name" field="FirstName"/>
                    <DataColumn title="Last Name" field="LastName"/>                
                </Table>
                
            </div>
        );
    }
};