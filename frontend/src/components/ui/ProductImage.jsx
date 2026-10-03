import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

const ProductImage = ({ src, alt, className = '', containerClassName = '' }) => {
  const [error, setError] = useState(false);
  const imageUrl = getImageUrl(src);

  if (!imageUrl || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-50 text-gray-300 ${containerClassName || className}`}>
        <ImageIcon size={32} className="mb-2 opacity-50" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{alt || 'No Image'}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || 'Product'}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default ProductImage;
