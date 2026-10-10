type AtmosphereProps = {
  src: string;
  alt: string;
  eager?: boolean;
};

export function Atmosphere({ src, alt, eager = false }: AtmosphereProps) {
  return (
    <>
      <div className="world-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
        />
      </div>
      <div className="world-wash" aria-hidden />
    </>
  );
}
