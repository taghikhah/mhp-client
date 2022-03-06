import React, { Component } from "react";
import MessagesTable from "./messagesTable";
import TableMeta from "./common/tableMeta";
import Pagination from "./common/pagination";
import _ from "lodash";
import { paginate } from "../utils/paginate";
import { getMessages, getMetaDatas, getFiles } from "../services/dataService";

class Messages extends Component {
  state = {
    messages: [],
    metadats: [],
    files: [],
    currentPage: 1,
    pageSize: 30,
    // searchQuery: "",
    // selectedGenre: null,
    sortColumn: { path: "updated_at", order: "desc" },
  };

  // retrive data from the server
  async componentDidMount() {
    const { data: messages } = await getMessages();
    const { data: metadats } = await getMetaDatas();
    const { data: files } = await getFiles();
    // const genres = [{ _id: "", name: "All" }, ...data];

    this.setState({ messages, metadats, files });
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
      messages: allMessages,
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
    if (count === 0) return <p>There is no Message in the Database!</p>;

    const { startNumber, totalCount, data: messages } = this.getData();
    console.log(this.state);
    return (
      <div className="row">
        <div className="col">
          <MessagesTable
            messages={messages}
            sortColumn={sortColumn}
            startNumber={startNumber}
            //   onLike={this.handleLike}
            //   onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <div className="row">
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
