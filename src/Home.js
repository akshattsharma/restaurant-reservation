import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Dropdown from "./Dropdown";
import { fetchStates, fetchCities } from "./Api";

const OFFERS = [
  { title: "Reservations are always free", text: "No booking fees, no hidden charges." },
  { title: "Book up to a week ahead", text: "Pick a day and a time slot that suits you." },
  { title: "Restaurants across the USA", text: "Choose a state and city to see what's open." },
];

export default function Home() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState("");
  const latest = useRef("");

  useEffect(() => {
    fetchStates()
      .then(setStates)
      .catch(() => setError("Couldn't load states. Refresh the page to try again."))
      .finally(() => setLoadingStates(false));
  }, []);

  const pickState = (s) => {
    setState(s);
    setCity("");
    setCities([]);
    setError("");
    latest.current = s;
    setLoadingCities(true);
    fetchCities(s)
      .then((list) => latest.current === s && setCities(list))
      .catch(() => latest.current === s && setError("Couldn't load cities for that state."))
      .finally(() => latest.current === s && setLoadingCities(false));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!state || !city) return;
    navigate(`/search?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <>
      <section className="hero">
        <h1>Find a table and reserve it in seconds</h1>
        <p className="lead">Choose where you're eating and we'll show you who has space.</p>

        <form className="search-card" onSubmit={submit}>
          <Dropdown id="state" label="State" value={state} options={states} onChange={pickState}
            placeholder="Select state" busy={loadingStates} />
          <Dropdown id="city" label="City" value={city} options={cities} onChange={setCity}
            placeholder="Select city" busy={loadingCities} disabled={!state} />
          <button type="submit" id="searchBtn" className="btn primary" disabled={!state || !city}>
            Search
          </button>
        </form>
        {loadingStates && <p className="hint">Loading states… the server can take up to a minute to wake up.</p>}
        {error && <p className="error" role="alert">{error}</p>}
      </section>

      <section className="section">
        <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={16}
          slidesPerView={1} breakpoints={{ 700: { slidesPerView: 2 }, 1000: { slidesPerView: 3 } }}
          className="offers">
          {OFFERS.map((o) => (
            <SwiperSlide key={o.title}>
              <div className="offer">
                <h2>{o.title}</h2>
                <p>{o.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="section" id="locations">
        <h2>Locations</h2>
        {states.length === 0 ? (
          <p className="muted">Locations will appear once the list loads.</p>
        ) : (
          <Swiper slidesPerView="auto" spaceBetween={10} freeMode className="chips">
            {states.map((s) => (
              <SwiperSlide key={s} className="chip-slide">
                <button type="button" className={`chip${s === state ? " active" : ""}`}
                  onClick={() => { pickState(s); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                  {s}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>
    </>
  );
}