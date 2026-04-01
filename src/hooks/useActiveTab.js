import { useState } from "react";

export function useActiveTab(initial) {
  const [active, setActive] = useState(initial);
  return { active, setActive };
}
