// src/types/model-viewer.d.ts
// This file declares the custom <model-viewer> element for TypeScript.

declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src: string;
      alt?: string;
      "auto-rotate"?: boolean;
      "camera-controls"?: boolean;
      // Add other common attributes as needed, keeping it concise
      "ar"?: boolean;
      "ar-modes"?: string;
      "shadow-intensity"?: string;
      "environment-image"?: string;
      "poster"?: string;
      "loading"?: "eager" | "lazy";
      "disable-zoom"?: boolean;
      "autoplay"?: boolean;
      "loop"?: boolean;
    };
  }
}