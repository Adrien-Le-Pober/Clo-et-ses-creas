import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface ProductImage {
    id: number;
    path: string;
    type?: string;
}

interface MobileCarouselProps {
    images: ProductImage[];
    code: string;
}

export default function MobileCarousel({ images, code }: MobileCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images.length) return <p>Aucune image disponible</p>;

    return (
        <div className="w-full max-w-[400px] mx-auto relative pb-9">
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1.5}
                centeredSlides={true}
                spaceBetween={10}
                navigation={{
                    nextEl: ".custom-next",
                    prevEl: ".custom-prev",
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-[400px]"
            >
                {images.map(img => (
                    <SwiperSlide key={img.id}>
                        <img src={img.path} className="w-full h-full object-cover cursor-pointer" alt={`Produit ${img.id}`} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="flex justify-center items-center gap-4 mt-4 text-lg">
                <button className="custom-prev text-primary text-2xl">{"<"}</button>

                <span>
                    {activeIndex + 1}/{images.length}
                </span>

                <button className="custom-next text-primary text-2xl">{">"}</button>
            </div>
        </div>
    );
}
