import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { API_ENDPOINT } from '../config'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = { user: {} }
  }

  componentDidMount() {
    fetch(`${API_ENDPOINT}/users/${this.props.userId}`)
      .then(res => {
        if (res.ok) return res.json()
        else throw Error(res.statusText)
      })
      .then(json => this.setState({ user: json, error: undefined }))
      .catch(err => {
        console.log('log', err)
        this.setState({ error: 'Could not load user details' })
      })
  }

  render() {
    return (
      <div className="user">
        {!this.state.error && (
          <div className="user-details">
            <img
              className="user-avatar"
              src={this.state.user.avatar}
              alt={`${this.state.user.firstName} ${
                this.state.user.lastName
              } avatar`}
            />
            <span className="user-name">
              {this.state.user.firstName} {this.state.user.lastName}
            </span>
          </div>
        )}
        {this.state.error && (
          <span className="user-name error">{this.state.error}</span>
        )}
        <button className="change-user-button">Change</button>
      </div>
    )
  }
}

User.propTypes = {
  userId: PropTypes.number,
}

export default User
