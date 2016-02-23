import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Model } from '../../../src/Model';
import { Table } from '../reactComponents/Table';

const SELECTED_IDS = 'selectedIds';

export const createModel = () => new Model({
       
    initialState: {
        selectedIds: [],
        sortBy: null,
        sortDescending: false        
    },
    
    actions: {
        addToSelection(state, id: string) {
            const selectedIds = state.get(SELECTED_IDS);
            if (selectedIds.indexOf(id) === -1) {
                return state.set(SELECTED_IDS, selectedIds.push(id));                
            }               
            return state;            
        },
        removeFromSelection(state, id: string) {
            const selectedIds: Immutable.List<any> = state.get(SELECTED_IDS);
            const index = selectedIds.indexOf(id)
            if (index == -1) {
                return state;
            }
            return state.set(SELECTED_IDS, selectedIds.delete(index));            
        },
        selectAll(state, items: Array<any>) {
            const allIds = items.map(i => i.Id)
            return state.set(SELECTED_IDS, Immutable.List([...allIds]));            
        },
        unselectAll(state) {
            const selectedIds = state.get(SELECTED_IDS);
            return state.set(SELECTED_IDS, selectedIds.clear());            
        },
        sortBy(state, field: string) {
            const stateJs = state.toJS();
            let desc = false;
            if (state && stateJs.sortBy === field) {
                desc = !stateJs.sortDescending
            }
            return state
                .set('sortBy', field)
                .set('sortDescending', desc);            
        }
    }  
});

export class View extends Component<any, {}> {
    
    constructor() {
        super();
        this.isRowSelected = this.isRowSelected.bind(this);
        this.isHeaderSelected = this.isHeaderSelected.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onAllSelectionChanged = this.onAllSelectionChanged.bind(this);
    }
    
    onSelectionChanged(item, selected) {
        if (selected) {
            this.props.model.signals.addToSelection(item.Id)
        } else {
            this.props.model.signals.removeFromSelection(item.Id);
        }
    }
    
    isRowSelected(item) {
        return this.props.model.$state.selectedIds.indexOf(item.Id) > -1;
    }
    
    isHeaderSelected() {
        return this.props.model.$state.selectedIds.length === this.props.data.length;
    }
    
    onAllSelectionChanged(selected) {
        if (selected) {
            this.props.model.signals.selectAll(this.props.data);
        } else {
            this.props.model.signals.unselectAll();
        }
    }

    render() {
        const { data, model } = this.props; 
        return (
            <Table 
                className="table" {...this.props} 
                list={this.props.data}
                sortBy={model.$state.sortBy}
                sortDescending={model.$state.sortDescending}
                isHeaderSelected={this.isHeaderSelected} 
                onAllSelectionChanged={this.onAllSelectionChanged}
                isRowSelected={this.isRowSelected}
                onSelectionChanged={this.onSelectionChanged}
                onSortingChanged={model.signals.sortBy}                 
            />
        );
    }
} 