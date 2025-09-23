import React from 'react';

function PhotoGalleryItem({ src, alt }) {
  return (
    <div className="flex-shrink-0 w-full">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded-lg"
      />
    </div>
  );
}

export default PhotoGalleryItem;