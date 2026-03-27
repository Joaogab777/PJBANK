"use client";

import { MeshGradient } from "@paper-design/shaders-react";

export default function Background() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#000000", "#1a1a1a", "#333333", "#676767"]}
        speed={0.5}

      />
    </div>
  );
}
