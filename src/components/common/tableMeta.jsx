import React from "react";

const TableMeta = ({ itemsCount, total }) => {
  return <h6>{renderMeta(itemsCount, total)}</h6>;
};

const renderMeta = (itemsCount, total) => {
  if (itemsCount === total) return `Showing all of ${total} records.`;
  else return `Showing ${itemsCount} of total ${total} records.`;
};

export default TableMeta;
