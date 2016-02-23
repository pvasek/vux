import { Component, PropTypes } from 'react';
import * as React from 'react';
import * as classnames from 'classnames';

class HeaderRow extends Component<any, {}> {

    render() {
        const {
            children,
            isSelected,

            sortBy,
            sortDescending,

            onSortingChanged,
            onAllSelectionChanged
        } = this.props;

        return (
            <tr>
                {isSelected &&
                    <th className="col-selection">
                        <input
                            type="checkbox"
                            checked={isSelected() }
                            onChange={(e: any) => onAllSelectionChanged(e.target.checked) }/>
                    </th>
                }
                {React.Children.map(children, (col: any, idx) => (
                    <th
                        key={idx}
                        className={classnames({
                            "col-sortby": sortBy === col.props.field,
                            "col-sortby-desc": sortDescending
                        }) }
                        onClick={() => onSortingChanged(col.props.field) } >
                        <span>{col.props.title}</span>
                    </th>
                )) }
            </tr>
        )
    }
}

class DataRow extends Component<any, {}> {

    constructor() {
        super();
        this.onItemClick = this.onItemClick.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onSelectionCellClick = this.onSelectionCellClick.bind(this);
    }

    onItemClick(item: any) {
        if (this.props.onItemClick) {
            this.props.onItemClick(item);
        }
    }

    onSelectionCellClick(item) {
        const checked = (this.refs as any).selectionCheckbox.checked
        this.onSelectionChanged(item, !checked);        
    }
    
    onSelectionChanged(item, selected) {
        this.props.onSelectionChanged(item, selected);
    }

    render() {
        const {
            columns,
            item,
            isSelected,
            children
        } = this.props;

        const selected = isSelected && isSelected(item);
        return (
            <tr className={classnames({ "row-selected": selected }) }>
                {isSelected &&
                    <td className="col-selection" onClick={i => this.onSelectionCellClick(item)}>
                        <input
                            type="checkbox"
                            ref="selectionCheckbox"
                            checked={isSelected(item) }
                            onChange={(e: any) => this.onSelectionChanged(item, e.target.checked) }/>
                    </td>
                }
                {React.Children.map(children, (col: any, idx) => (
                    <td key={idx}>
                        {React.cloneElement(col, { item }) }
                    </td>
                )) }
            </tr>
        )
    }
}

export class LinkColumn extends Component<any, {}> {
    render() {
        const props = this.props;
        const { onClick, children, item, field } = props;
        return (
            <a onClick={onClick}>
                {React.Children.map(props.children, (child: any, idx) => React.cloneElement(child, props)) }
            </a>
        );
    }
}


export class Table extends Component<any, {}> {

    render() {
        const {
            children,
            list,
            sortBy,
            sortDescending,

            isRowSelected,
            isHeaderSelected,

            onSortingChanged,
            onSelectionChanged,
            onAllSelectionChanged,
            onItemClick,
        } = this.props;

        if (!list || list.length === 0) {
            return (<div>No data</div>);
        }

        return (
            <table className="table table-list">
                <thead>
                    <HeaderRow
                        children={children}
                        isSelected={isHeaderSelected}
                        sortBy={sortBy}
                        sortDescending={sortDescending}
                        onSortingChanged={onSortingChanged}
                        onAllSelectionChanged={onAllSelectionChanged}/>
                </thead>
                <tbody>
                    {list.map((i, index) =>
                        <DataRow
                            children={children}
                            key={i.Id || index}
                            item={i}
                            onItemClick={onItemClick}
                            isSelected={isRowSelected}
                            onSelectionChanged={onSelectionChanged}/>
                    ) }
                </tbody>
            </table>
        );
    }
}

export default Table;
