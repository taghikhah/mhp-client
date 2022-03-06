import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);
    return _.get(item, column.path);
  };
  createKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  render() {
    const { data, columns, startNumber } = this.props;
    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            <th scope="row" className="align-middle">
              {data.indexOf(item) + startNumber + 1}
            </th>
            {columns.map((column) => (
              <td key={this.createKey(item, column)} className="align-middle">
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
