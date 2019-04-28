import React from 'react'
import { FaBars } from 'react-icons/fa'

import logo from '../logo.png'

function Header(props) {
  return (
    <header className="app-header">
      <FaBars />
      <img src={logo} className="app-logo" alt="Babylon Health" />
      <div className="icon">NU</div>
    </header>
  )
}

Header.propTypes = {}

export default Header
