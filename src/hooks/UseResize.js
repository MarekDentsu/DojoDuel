/**
 * useResize React custom hook
 * Usage:
 *    const { mousePosition, mouseMovement } = useScroll();
 */

import { useEffect, useState } from "react"

const useResize = () => {
  const [size, setSize] = useState({ width: 0, height: 0, ratio: 1 })
  const getSize = () =>
    setSize({ width: window.innerWidth, height: window.innerHeight, ratio: window.innerWidth/window.innerHeight })

  useEffect(() => {
    getSize();
    window.addEventListener("resize", getSize)
    return () => window.removeEventListener("resize", getSize)
  }, []);

  return size;
};


export default useResize;

