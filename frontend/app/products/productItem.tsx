import Button from "~/components/button";

interface ProductItemProps {
    id: string;
    name: string;
    images: string[];
    price: number;
}

export default function ProductItem({ name, images, price }: ProductItemProps) {
    const formattedPrice = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(price);

    return (
        <div className="flex flex-col w-64 md:w-72 xl:w-80">

            {images.length > 0 ? (
                <img
                    src={images[0]}
                    alt={name}
                    className="w-full h-64 md:h-72 xl:w-80 object-cover"
                />
            ) : (
                <div className="w-full h-64 md:h-72 xl:w-80 flex items-center justify-center border-2">
                    <span>Pas d'image</span>
                </div>
            )}

            <p className="text-3xl">{name}</p>
            <span className="place-self-end text-3xl">{formattedPrice}</span>
            <Button text="Ajouter au panier" height="h-14" fontSize="text-3xl" />
        </div>
    );
}