import React from "react";

const DateView = ({ date }) => {
  var d = new Date(date);
  // console.log(d.toString());

  return <p>{d.toUTCString()}</p>;
};

export default DateView;
