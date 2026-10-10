type PhotoSlotProps = {
  src?: string;
  alt: string;
  caption: string;
};

export function PhotoSlot({ src, alt, caption }: PhotoSlotProps) {
  return (
    <figure className="photo-slot">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} />
      ) : (
        <div className="photo-slot-empty">
          <span className="photo-slot-todo">TODO — photo slot</span>
          <p>{caption}</p>
        </div>
      )}
    </figure>
  );
}
