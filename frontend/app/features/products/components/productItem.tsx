import Button from "~/ui/button";
import { useNavigate } from "react-router";
import { useCart } from "~/features/cart/CartContext";

interface ProductItemProps {
    id: string;
    code: string;
    name: string;
    images: string[];
    price: number;
    slug: string;
}

export default function ProductItem({ code, name, images, price, slug }: ProductItemProps) {
    const formattedPrice = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(price);

    const navigate = useNavigate();

    const { addItem } = useCart();

    const handleClick = () => {
        navigate(`/produit/${slug}`);
    }

    return (
        <div 
            className="flex flex-col w-64 md:w-72 xl:w-80 hover:cursor-pointer"
            onClick={handleClick}
        >
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
            <Button 
                text="Ajouter au panier"
                height="h-14"
                fontSize="text-3xl"
                onClick={(event) => {
                    event.stopPropagation();
                    addItem(code);
                }}
            />
        </div>
    );
}