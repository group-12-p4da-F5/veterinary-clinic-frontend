import React from 'react';
// Importa los módulos de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Importa los estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';

// Importa tus imágenes como variables
import carrusel1 from '../../shared/assets/Carrusel1.png';
import carrusel2 from '../../shared/assets/carrusel2.png';
import carrusel3 from '../../shared/assets/carrusel3.png';
import carrusel4 from '../../shared/assets/carrusel4.png';
import carrusel5 from '../../shared/assets/Carrusel1.png';

const images = [
    { id: 1, src: carrusel1, alt: 'foto1' },
    { id: 2, src: carrusel2, alt: 'foto2' },
    { id: 3, src: carrusel3, alt: 'oto 3' },
    { id: 4, src: carrusel4, alt: 'foto4' },
    { id: 5, src: carrusel5, alt: 'Dfoto5' },
];

function PhotoGallery() {
  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
      >
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-72 object-cover rounded-lg shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default PhotoGallery;