import { useState, useRef } from "react";
import { Swiper as Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import Button from "../components/button";

interface ProductImage {
    id: number;
    path: string;
    type?:string;
}

interface DesktopCarouselProps {
    images: ProductImage[];
}

export default function DesktopCarousel({ images }: DesktopCarouselProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (!images.length) return <p>Aucune image disponible</p>;

    return (
        <>
            <Swiper
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2 w-[500px] h-[500px] max-w-full max-h-full"
            >
                {images.map((img) => (
                    <SwiperSlide key={img.id}>
                        <img src={img.path} className="w-full h-full object-cover" alt={`Produit ${img.id}`} />
                    </SwiperSlide>
                ))}
            </Swiper>
            {images.length > 1 && (
                <div className="relative w-[500px] max-w-full mx-auto">
                    <Swiper
                        onSwiper={(swiper) => setThumbsSwiper(swiper)}
                        spaceBetween={10}
                        slidesPerView={3.5}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        className="mySwiper mt-2.5"
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={img.id}>
                                <img src={img.path} className="w-full h-full object-cover" alt={`Miniature ${img.id}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button ref={prevRef} className="swiper-button-prev absolute left-[-40px] top-16 text-primary" />
                    <button ref={nextRef} className="swiper-button-next absolute right-[-40px] top-16 text-primary" />
                </div>
            )}

            <div className="flex justify-center">
                <Button text="Ajouter au panier" width="w-[350px]" height="h-14" margin="mb-32 mt-14" fontSize="text-3xl"/>
            </div>
        </>
    );
}
