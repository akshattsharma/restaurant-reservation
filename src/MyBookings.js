import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiStar } from "react-icons/fi";
import { getBookings, removeBookingAt } from "./Storage";

// Stored bookings may come from other code, so read fields loosely and never throw.
const norm = (k) => k.toLowerCase().replace(/[^a-z0-9]/g, "");
const pick = (obj, keys) => {
  const m = {};
  Object.keys(obj).forEach((k) => (m[norm(k)] = obj[k]));
  for (const k of keys) if (m[k] !== undefined && m[k] !== null) return m[k];
  return "";
};

const view = (b) => {
  const o = b && typeof b === "object" ? b : {};
  return {
    name: String(pick(o, ["restaurantname", "name", "restaurant"])),
    address: String(pick(o, ["address"])),
    city: String(pick(o, ["city"])),
    state: String(pick(o, ["state"])),
    rating: pick(o, ["overallrating", "rating"]),
    date: String(pick(o, ["bookingdate", "date", "reservationdate"])),
    time: String(pick(o, ["bookingtime", "time", "timeslot", "slot"])),
  };
};

const prettyDate = (s) => {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return s;
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
};

export default function MyBookings() {
  const [raw, setRaw] = useState(getBookings);
  const items = raw.map((b, i) => ({ i, id: b && b.id, ...view(b) }));

  return (
    <div className="page">
      <h1>My Bookings</h1>
      {items.length === 0 ? (
        <>
          <p className="muted">You haven't booked a table yet.</p>
          <Link to="/" className="btn primary">Find restaurants</Link>
        </>
      ) : (
        <div className="cards">
          {items.map((b) => (
            <article className="card" key={b.id ?? b.i}>
              <div className="card-top">
                <div>
                  <h3>{b.name}</h3>
                  <p className="addr">{[b.address, b.city, b.state].filter(Boolean).join(", ")}</p>
                </div>
                <span className="rating"><FiStar aria-hidden="true" /> {b.rating !== "" ? b.rating : "–"}</span>
              </div>
              <p className="when">
                {b.date && <span><FiCalendar aria-hidden="true" /> {prettyDate(b.date)}</span>}
                {b.time && <span><FiClock aria-hidden="true" /> {b.time}</span>}
              </p>
              <button type="button" className="btn" onClick={() => setRaw(removeBookingAt(b.i))}>
                Cancel booking
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}