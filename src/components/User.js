import React from 'react'
import PropTypes from 'prop-types'

function User(props) {
  return (
    <div className="user">
      <img src={props.avatar} alt={`${props.lastName} `} />
      {props.firstName} {props.lastName}
      <button className="linkButton">Change</button>
    </div>
  )
}

User.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  avatar: PropTypes.string,
}

export default User
