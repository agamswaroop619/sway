"use client";
import { useEffect } from "react";

export default function CursorEffect() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "cursor-circle";
    document.body.appendChild(cursor);
    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cursor.remove();
    };
  }, []);
  return null;
}
