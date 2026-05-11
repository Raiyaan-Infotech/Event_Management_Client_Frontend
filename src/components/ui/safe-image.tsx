'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

const PLACEHOLDER = '/images/placeholder.svg';

type SafeImageProps = Omit<ImageProps, 'onError'>;

export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(PLACEHOLDER)}
      unoptimized={typeof imgSrc === 'string' && imgSrc === PLACEHOLDER ? true : (props.unoptimized ?? false)}
    />
  );
}
