'use client';

import Image from 'next/image';
import { Product } from '@/lib/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const ProductPreview = ({ images }: { images: Product['images'] }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedImg = images[selectedIdx];

  if (!selectedImg) {
    return (
      <div className="h-full border flex-center rounded-md">
        <p className="p-muted">No Image Found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Image
        src={selectedImg}
        width={1000}
        height={1000}
        alt="hero image"
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex gap-2">
        {images.map((img, idx) => (
          <div
            key={img}
            className={cn(
              'border cursor-pointer hover:border-orange-600hover:border-orange-600',
              idx === selectedIdx && 'border-orange-500'
            )}
            onClick={() => setSelectedIdx(idx)}
          >
            <Image src={img} width={100} height={100} alt="preview image" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductPreview;
