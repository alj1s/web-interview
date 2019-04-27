import React from 'react'
import PropTypes from 'prop-types'

function SectionBody(props) {
  return <div className="section-body">{props.children}</div>
}

SectionBody.propTypes = {
  children: PropTypes.node,
}

export default SectionBody
