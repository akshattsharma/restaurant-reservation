import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Dropdown({ id, label, value, options, onChange, placeholder, disabled, busy }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = () => !disabled && setOpen((o) => !o);
  const choose = (o) => {
    onChange(o);
    setOpen(false);
  };

  return (
    <div className="dd" ref={ref}>
      <span className="dd-label" id={`${id}-label`}>{label}</span>
      <div
        id={id}
        className={`dd-trigger${disabled ? " disabled" : ""}${value ? "" : " placeholder"}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <span>{busy ? "Loading…" : value || placeholder}</span>
        <FiChevronDown aria-hidden="true" />
      </div>
      {open && (
        <ul id={`${id}-list`} className="dd-list" role="listbox">
          {options.length === 0 && <li className="dd-empty">{busy ? "Loading…" : "No options"}</li>}
          {options.map((o) => (
            <li
              key={o}
              role="option"
              aria-selected={o === value}
              tabIndex={0}
              className={o === value ? "selected" : ""}
              onClick={() => choose(o)}
              onKeyDown={(e) => e.key === "Enter" && choose(o)}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}