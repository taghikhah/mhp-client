import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import Actions from "./common/actions";
// import Like from "./common/like";
import Table from "./common/table";
// import Twin from "./common/twin";
import DateView from "./common/date";

class MessagesTable extends Component {
  columns = [
    {
      key: "updated_at",
      label: "Time",
      content: (message) => <DateView date={message.updated_at} />,
    },
    { path: "value.blFileIdentifer", label: "blFileIdentifer" },
    { path: "topic", label: "Topic" },
    { path: "partition", label: "Partition" },
  ];
  render() {
    const { messages, startNumber, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={messages}
        sortColumn={sortColumn}
        onSort={onSort}
        startNumber={startNumber}
      />
    );
  }
}

export default MessagesTable;
