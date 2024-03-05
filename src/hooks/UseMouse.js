/**
 * useMouse React custom hook
 * Usage:
 *    const { mousePosition, mouseMovement } = useScroll();
 */

import { useState, useEffect, } from "react";

export function useMouse() {
   // storing this to get the scroll direction
  const [lastMousePosition, setLastMousePosition] = useState({x: 0, y: 0});
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
  const [normalisedPosition, setNormalisedPosition] = useState({x: 0, y: 0});
  const [mouseMovement, setMouseMovement] = useState({x: 0, y: 0});

  const listener = e => {
    setMousePosition({x: e.clientX, y: e.clientY})
    setNormalisedPosition( {
      x: ((e.clientX - window.innerWidth * 0.5) / window.innerWidth) * 2,
      y: ((e.clientY - window.innerHeight * 0.5) / window.innerHeight) * 2
    } )
    setMouseMovement({x: lastMousePosition.x - e.clientX, y: lastMousePosition.y - e.clientY})
    setLastMousePosition({x: e.clientX, y: e.clientY})
  };

  useEffect(() => {
    window.addEventListener("mousemove", listener);
    return () => {
      window.removeEventListener("mousemove", listener);
    };
  });

  return {
    mousePosition,
    normalisedPosition,
    mouseMovement
  };
}