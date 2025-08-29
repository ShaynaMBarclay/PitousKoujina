import { useState } from "react";

function LazyImage({ src, alt, className, onClick }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onClick={onClick}
      className={`${className} ${loaded ? "fade-in" : "loading"}`}
    />
  );
}

export default LazyImage;
