import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiMapPin, FiStar } from "react-icons/fi";
import { fetchRestaurants } from "./Api";
import BookingPanel from "./BookingPanel";

export default function Results() {
  const [params] = useSearchParams();
  const state = params.get("state") || "";
  const city = params.get("city") || "";
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(Boolean(state && city));
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!state || !city) return;
    let ignore = false;
    setLoading(true);
    setError("");
    setOpenId(null);
    fetchRestaurants(state, city)
      .then((r) => !ignore && setList(r))
      .catch(() => !ignore && setError("Couldn't load restaurants. Please try again."))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [state, city]);

  if (!state || !city) {
    return (
      <div className="page">
        <p className="muted">Choose a state and city to see restaurants.</p>
        <Link to="/" className="btn primary">Start a search</Link>
      </div>
    );
  }

  return (
    <div className="page">
      {loading && <p className="hint">Finding restaurants… the server can take up to a minute to respond.</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && (
        <>
          <h1>{`${list.length} restaurants available in ${city}`}</h1>
          <p className="muted"><FiMapPin aria-hidden="true" /> {city}, {state}</p>
          <div className="cards">
            {list.map((r) => (
              <article className="card" key={r.id}>
                <div className="card-top">
                  <div>
                    <h3>{r.name}</h3>
                    <p className="addr">{r.address}, {r.city}, {r.state}</p>
                  </div>
                  <span className="rating" title="Overall rating">
                    <FiStar aria-hidden="true" /> {r.rating !== "" ? r.rating : "–"}
                  </span>
                </div>
                <button type="button" className="btn primary"
                  aria-expanded={openId === r.id}
                  onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                  Book FREE Reservation
                </button>
                {openId === r.id && <BookingPanel restaurant={r} />}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}