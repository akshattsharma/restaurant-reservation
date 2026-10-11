import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { addBooking, hasBooking } from "./Storage";

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const fmtTime = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
};
const range = (from, to) => {
  const out = [];
  for (let m = from; m <= to; m += 30) out.push({ label: fmtTime(m), min: m });
  return out;
};

const PERIODS = [
  { name: "Morning", slots: range(11 * 60, 11 * 60 + 30) },
  { name: "Afternoon", slots: range(12 * 60, 16 * 60 + 30) },
  { name: "Evening", slots: range(17 * 60, 21 * 60) },
];

export default function BookingPanel({ restaurant }) {
  const days = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return {
        iso: iso(d),
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" }),
        sub: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    });
  }, []);

  const [date, setDate] = useState(days[0].iso);
  const [time, setTime] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isToday = date === days[0].iso;

  const confirm = () => {
    const booking = {
      name: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      rating: restaurant.rating,
      date,
      time,
    };
    if (hasBooking(booking)) {
      setMessage({ type: "error", text: "You've already booked this slot." });
      return;
    }
    addBooking(booking);
    setTime("");
    setMessage({ type: "success", text: `Table booked for ${days.find((d) => d.iso === date).sub} at ${booking.time}.` });
  };

  return (
    <div className="booking">
      <Swiper slidesPerView="auto" spaceBetween={10} className="days">
        {days.map((d) => (
          <SwiperSlide key={d.iso} className="day-slide">
            <button type="button" className={`day${d.iso === date ? " active" : ""}`}
              aria-pressed={d.iso === date}
              onClick={() => { setDate(d.iso); setTime(""); setMessage({ type: "", text: "" }); }}>
              <p>{d.label}</p>
              <span>{d.sub}</span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {PERIODS.map((p) => (
        <div className="period" key={p.name}>
          <p className="period-name">{p.name}</p>
          <div className="slots">
            {p.slots.map((s) => {
              const past = isToday && s.min <= nowMin;
              return (
                <button key={s.label} type="button" disabled={past}
                  className={`slot${time === s.label ? " active" : ""}`}
                  aria-pressed={time === s.label}
                  onClick={() => { setTime(s.label); setMessage({ type: "", text: "" }); }}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="booking-actions">
        <button type="button" className="btn primary" disabled={!time} onClick={confirm}>
          Confirm Booking
        </button>
        {message.text && (
          <span className={`msg ${message.type}`} role="status">
            {message.text}{" "}
            {message.type === "success" && <Link to="/my-bookings">View my bookings</Link>}
          </span>
        )}
      </div>
    </div>
  );
}