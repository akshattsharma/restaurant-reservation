import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <nav className="nav">
      <Link to="/" className="brand" onClick={close}>TableFinder</Link>
      <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <FiX /> : <FiMenu />}
      </button>
      <div className={`nav-links${open ? " open" : ""}`}>
        <NavLink to="/" end onClick={close}>Find Restaurants</NavLink>
        <a href="/#locations" onClick={close}>Locations</a>
        <NavLink to="/my-bookings" onClick={close}>My Bookings</NavLink>
      </div>
    </nav>
  );
}