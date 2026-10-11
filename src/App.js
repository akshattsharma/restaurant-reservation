import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Results from "./Results";
import MyBookings from "./MyBookings";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Results />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}