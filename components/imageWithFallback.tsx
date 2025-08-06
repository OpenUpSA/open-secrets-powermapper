import { Image } from '@imagekit/next';
import { useState } from 'react';

type Transformation = {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp';
};

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className: string;
  width: number;
  height: number;
  transformation: Transformation[];
};

export default function ImageWithFallback({
  src,
  alt,
  className,
  transformation,
  width,
  height,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = '/images/fallback.webp';

  return (
    <Image
      urlEndpoint={
        hasError
          ? process.env.NEXT_PUBLIC_URL : 'https://ik.imagekit.io/powermapper/'}
      src={
        hasError
          ? fallbackSrc
          : src
      }
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="eager"
      transformation={transformation}
      responsive={false}
      onError={() => setHasError(true)}
    />
  );
}
