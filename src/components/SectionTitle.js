import React from 'react'
import PropTypes from 'prop-types'

function SectionTitle(props) {
  return (
    <div className="section-title">
      {props.children}
      <h2 className="section-title--header">{props.sectionName}</h2>
    </div>
  )
}

SectionTitle.propTypes = {
  children: PropTypes.node,
  sectionName: PropTypes.string,
}

export default SectionTitle
