import { Component, PropTypes } from 'react';
import * as React from 'react';

export interface IDataColumnProperties {
    title: string,
    field: string,
    item?: any,
}

export class DataColumn extends Component<IDataColumnProperties,{}> {
    render() {
      const { item, field } = this.props;
      return (
        <span>{item[field]}</span>
      );
    }
}