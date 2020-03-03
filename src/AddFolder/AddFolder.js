import React from "react";
import ApiContext from "../ApiContext";
import NotefulForm from "../NotefulForm/NotefulForm";

import config from '../config'
import uuidv4 from 'uuid/v4';

import './AddFolder.css'

export default class AddFolder extends React.Component {
  state = {
    folderName: { value: "", touched: false }
  };

  setFolderName = name => {
    this.setState({ folderName: { value: name, touched: true } });
  };

  static contextType = ApiContext;

  handleFormSubmit(event) {
    event.preventDefault();

    let folder = {
        id: uuidv4(),
        name: this.state.folderName.value
    }

    fetch(`${config.API_ENDPOINT}/folders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(folder)
    })
    .then(resp => {
        if(!resp.ok) {
            return resp.json().then(e => Promise.reject(e));
        }
        return resp.json();
    })
    .then(() => {
        this.context.addFolder(folder);

        this.props.history.goBack();
    })
    .catch(error => {
        console.log({ error });
    })
  }

  validateName = () => {
    let name = this.state.folderName.value;
    if (name.length <= 3) {
      return "Name must be at least 4 characters";
    }
  };

  render() {
    return (
      <section className="AddFolder-container">
        <h2>Add New Folder</h2>
        <NotefulForm
          className="AddFolder"
          onSubmit={event => this.handleFormSubmit(event)}
        >
          <label htmlFor="folder-name">
            Folder Name
            {this.state.folderName.touched && 
                <p className="error">{this.validateName()}</p>}
          </label>
          <input
            id="folder-name"
            type="text"
            placeholder="New Folder"
            value={this.state.folderName.value}
            onChange={e => this.setFolderName(e.target.value)}
          />
          <button type="submit" disabled={this.validateName()}>Submit Folder</button>
        </NotefulForm>
      </section>
    );
  }
}
