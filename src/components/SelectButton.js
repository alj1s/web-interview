import React from 'react'
import PropTypes from 'prop-types'

function SelectButton(props) {
  const className = `button ${props.isSelected ? 'selected' : ''}`
  return (
    <button onClick={() => props.onSelect()} className={className}>
      {props.children}
    </button>
  )
}

SelectButton.propTypes = {
  children: PropTypes.node,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
}

export default SelectButton
