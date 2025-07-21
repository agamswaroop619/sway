"use client";
import { useEffect } from "react";

export default function CursorEffect() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "cursor-circle";
    document.body.appendChild(cursor);
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;
    const speed = 0.16; // Lower = more delay

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    function animate() {
      circleX += (mouseX - circleX) * speed;
      circleY += (mouseY - circleY) * speed;
      cursor.style.left = `${circleX}px`;
      cursor.style.top = `${circleY}px`;
      requestAnimationFrame(animate);
    }
    window.addEventListener("mousemove", move);
    animate();
    return () => {
      window.removeEventListener("mousemove", move);
      cursor.remove();
    };
  }, []);
  return null;
}
