import React, { Component } from "react";
import MessagesTable from "./messagesTable";
import TableMeta from "./common/tableMeta";
import Pagination from "./common/pagination";
import _ from "lodash";
import { paginate } from "../utils/paginate";
import { getMessages, getMetaDatas, getFiles } from "../services/dataService";
import Card from "./card";

class Messages extends Component {
  // state = {
  //   messages: [],
  //   metadats: [],
  //   files: [],
  //   data: [],
  //   currentPage: 1,
  //   pageSize: 10,
  //   // intervalId: 0,
  //   currentCount: 100,
  //   sortColumn: { path: "updated_at", order: "desc" },
  // };
  constructor(props) {
    super(props);
    this.timer = this.timer.bind(this);
    this.state = {
      messages: [],
      metadats: [],
      files: [],
      data: [],
      currentPage: 1,
      pageSize: 10,
      // intervalId: 0,
      currentCount: 100,
      sortColumn: { path: "updated_at", order: "desc" },
    };
  }

  async timer() {
    const { data: messages } = await getMessages();
    const { data: metadats } = await getMetaDatas();
    const { data: files } = await getFiles();
    // const genres = [{ _id: "", name: "All" }, ...data];
    function totalTimeDiff(strt, end) {
      if (end) {
        var startDate = new Date(strt).getTime();
        var endDate = new Date(end).getTime();
        const result = (endDate - startDate) / 1000;

        return result;
      } else {
        return undefined;
      }
    }

    function getDtata(array, id) {
      const data = array.find((m) => m.blFileIdentifer === id);
      if (data) {
        return data.time;
      } else {
        return undefined;
      }
    }

    const messageData = messages.map(
      ({ updated_at, value, topic, partition }) => ({
        time: updated_at,
        blFileIdentifer: value.blFileIdentifer,
        topic: topic,
        partition: partition,
      })
    );

    const metaData = metadats.map(({ updated_at, data }) => ({
      time: updated_at,
      blFileIdentifer: data.artefaktTyp.slice(3, -4),
    }));

    const fileData = files.map(({ updated_at, name }) => ({
      time: updated_at,
      blFileIdentifer: name.slice(0, -4),
    }));
    var isDescending = true;
    const aggr = messageData
      .map(({ time, blFileIdentifer, topic, partition }) => ({
        topic: topic,
        partition: partition,
        blFileIdentifer: blFileIdentifer,
        messageTime: time,
        metaTime: getDtata(metaData, blFileIdentifer),
        fileTime: getDtata(fileData, blFileIdentifer),
        totalTime: totalTimeDiff(time, getDtata(fileData, blFileIdentifer)),
      }))
      .sort((a, b) =>
        isDescending
          ? new Date(b.messageTime).getTime() -
            new Date(a.messageTime).getTime()
          : new Date(a).getTime() - new Date(b).getTime()
      );

    // var intervalId = setInterval(this.timer, 1000);

    this.setState({
      messages: messageData,
      metadats: metaData,
      files: fileData,
      data: aggr,
      // intervalId: intervalId,
    });

    this.setState({
      currentCount: this.state.currentCount - 1,
    });
    if (this.state.currentCount < 1) {
      clearInterval(this.intervalId);
    }
  }

  // retrive data from the server
  async componentDidMount() {
    const { data: messages } = await getMessages();
    const { data: metadats } = await getMetaDatas();
    const { data: files } = await getFiles();
    // const genres = [{ _id: "", name: "All" }, ...data];
    function totalTimeDiff(strt, end) {
      if (end) {
        var startDate = new Date(strt).getTime();
        var endDate = new Date(end).getTime();
        const result = (endDate - startDate) / 1000;

        return result;
      } else {
        return undefined;
      }
    }

    function getDtata(array, id) {
      const data = array.find((m) => m.blFileIdentifer === id);
      if (data) {
        return data.time;
      } else {
        return undefined;
      }
    }

    const messageData = messages.map(
      ({ updated_at, value, topic, partition }) => ({
        time: updated_at,
        blFileIdentifer: value.blFileIdentifer,
        topic: topic,
        partition: partition,
      })
    );

    const metaData = metadats.map(({ updated_at, data }) => ({
      time: updated_at,
      blFileIdentifer: data.artefaktTyp.slice(3, -4),
    }));

    const fileData = files.map(({ updated_at, name }) => ({
      time: updated_at,
      blFileIdentifer: name.slice(0, -4),
    }));

    var isDescending = true;
    const aggr = messageData
      .map(({ time, blFileIdentifer, topic, partition }) => ({
        topic: topic,
        partition: partition,
        blFileIdentifer: blFileIdentifer,
        messageTime: time,
        metaTime: getDtata(metaData, blFileIdentifer),
        fileTime: getDtata(fileData, blFileIdentifer),
        totalTime: totalTimeDiff(time, getDtata(fileData, blFileIdentifer)),
      }))
      .sort((a, b) =>
        isDescending
          ? new Date(b.messageTime).getTime() -
            new Date(a.messageTime).getTime()
          : new Date(a).getTime() - new Date(b).getTime()
      );

    this.setState({
      messages: messageData,
      metadats: metaData,
      files: fileData,
      data: aggr,
    });
    this.intervalId = setInterval(this.timer.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handlePageChange = (page) => {
    //console.log(page);
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    //console.log(genre);
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };
  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getData = () => {
    const {
      currentPage,
      pageSize,
      data: allMessages,
      selectedGenre,
      searchQuery,
      sortColumn,
    } = this.state;

    const startNumber = (currentPage - 1) * pageSize;
    // filter option
    let filtered = allMessages;
    if (searchQuery)
      filtered = allMessages.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMessages.filter((m) => m.genre._id === selectedGenre._id);

    // sorting option
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    // pagination option
    const messages = paginate(sorted, currentPage, pageSize);
    return {
      startNumber: startNumber,
      totalCount: filtered.length,
      data: messages,
    };
  };

  render() {
    // refactoring this.state expression and apply length method to new object key.
    const { length: count } = this.state.messages;
    const { currentPage, pageSize, sortColumn, searchQuery } = this.state;
    // if (count === 0) return <p>There is no Message in the Database!</p>;

    const { startNumber, totalCount, data: messages } = this.getData();
    console.log(this.state);
    return (
      <div className="row">
        <div className="col">
          {messages.map((m) => (
            <Card
              id={m.blFileIdentifer}
              messageTime={m.messageTime}
              metaTime={m.metaTime}
              fileTime={m.fileTime}
              totalTime={m.totalTime}
            />
          ))}
          <hr />
          <div className="row mt-4 align-items-center">
            <div className="col-6">
              <Pagination
                //itemsCount={count}
                itemsCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePageChange}
              />
            </div>
            <div
              className="col-6"
              style={{
                textAlign: "right",
                verticalAlign: "button",
              }}
            >
              <TableMeta itemsCount={totalCount} total={count} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Messages;
