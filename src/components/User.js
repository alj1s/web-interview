import React from 'react'
import PropTypes from 'prop-types'

function User(props) {
  return (
    <div className="user">
      <div className="user-details">
        <img
          className="user-avatar"
          src={props.avatar}
          alt={`${props.firstName} ${props.lastName} avatar`}
        />
        <span className="user-name">
          {props.firstName} {props.lastName}
        </span>
      </div>
      <button className="change-user-button">Change</button>
    </div>
  )
}

User.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  avatar: PropTypes.string,
}

export default User
