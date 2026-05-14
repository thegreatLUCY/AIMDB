import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  children: React.ReactNode;
};

// Hero with the still as a heavily blurred, darkened backdrop and content overlaid.
// Edge-to-edge via negative margins to break out of the page container.
export default function Backdrop({ src, alt, children }: Props) {
  return (
    <section className="relative -mx-4 -mt-6 px-4 pt-8 pb-6 overflow-hidden isolate">
      {/* Background layer: blurred image + gradient. isolate on the parent creates a new stacking context. */}
      <div className="absolute inset-0 z-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority
          className="object-cover scale-110 blur-2xl brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-bg/60 to-bg" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
