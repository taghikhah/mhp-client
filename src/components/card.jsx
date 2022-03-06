import React from "react";

const changeDate = (date) => {
  var d = new Date(date);
  return d.toUTCString();
};
const Card = ({ id, messageTime, metaTime, fileTime, totalTime }) => {
  return (
    <div className="card w-100 my-4" key={id}>
      <div className="card-body">
        <h5 className="card-title">{id}</h5>

        <div
          className="alert alert-primary"
          role="alert"
          style={{ display: messageTime ? "" : "none" }}
          key={messageTime}
        >
          <p className="font-weight-bold">Message recieved at:</p>

          <p>{changeDate(messageTime)}</p>
        </div>
        <div
          className="alert alert-secondary"
          role="alert"
          style={{ display: metaTime ? "" : "none" }}
          key={metaTime || 1}
        >
          <p className="font-weight-bold">Framework Package downloaded at:</p>

          <p>{changeDate(metaTime)}</p>
        </div>
        <div
          className="alert alert-success"
          role="alert"
          style={{ display: fileTime ? "" : "none" }}
          key={fileTime || 2}
        >
          <p className="font-weight-bold">
            Framework Package uploaded to AWS S3 at:
          </p>
          <p>{changeDate(fileTime)}</p>
        </div>
        <div
          className="alert alert-warning"
          role="alert"
          style={{ display: totalTime ? "" : "none" }}
          key={totalTime || 3}
        >
          <p className="font-weight-bold">
            Total Elapsed Time: {totalTime} seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
