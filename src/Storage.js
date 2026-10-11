const KEY = "bookings";

export function getBookings() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

const save = (list) => localStorage.setItem(KEY, JSON.stringify(list));

export function addBooking(booking) {
  const list = getBookings();
  const entry = { id: Date.now() + Math.random().toString(16).slice(2), ...booking };
  save([...list, entry]);
  return entry;
}

export function removeBooking(id) {
  const list = getBookings().filter((b) => b.id !== id);
  save(list);
  return list;
}

export function hasBooking({ name, address, date, time }) {
  return getBookings().some(
    (b) => b.name === name && b.address === address && b.date === date && b.time === time
  );
}

export function removeBookingAt(index) {
  const list = getBookings().filter((_, i) => i !== index);
  save(list);
  return list;
}