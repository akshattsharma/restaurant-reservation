import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiStar } from "react-icons/fi";
import { getBookings, removeBooking } from "./storage";

const prettyDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
};

export default function MyBookings() {
  const [bookings, setBookings] = useState(() =>
    getBookings().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  );

  return (
    <div className="page">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <>
          <p className="muted">You haven't booked a table yet.</p>
          <Link to="/" className="btn primary">Find restaurants</Link>
        </>
      ) : (
        <div className="cards">
          {bookings.map((b) => (
            <article className="card" key={b.id}>
              <div className="card-top">
                <div>
                  <h3>{b.name}</h3>
                  <p className="addr">{b.address}, {b.city}, {b.state}</p>
                </div>
                <span className="rating"><FiStar aria-hidden="true" /> {b.rating !== "" ? b.rating : "–"}</span>
              </div>
              <p className="when">
                <span><FiCalendar aria-hidden="true" /> {prettyDate(b.date)}</span>
                <span><FiClock aria-hidden="true" /> {b.time}</span>
              </p>
              <button type="button" className="btn" onClick={() => setBookings(removeBooking(b.id))}>
                Cancel booking
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}