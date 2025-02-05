/**
 * Get a boolean state indicating whether the component is mounted.
 * 
 * @returns {boolean} mounted
 */

import { useEffect, useState } from "react";

export const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
};
