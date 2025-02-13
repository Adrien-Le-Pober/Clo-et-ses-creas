import { useParams } from "react-router";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from "~/components/loader";

interface ProductDetails {
    name: string;
    description: string;
    price: string;
    images: string[];
}

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

    const DESCRIPTION_LIMIT = 170;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await axios.get(`${import.meta.env.VITE_API_URI}shop/products-by-slug/${slug}`);
                const productVariantUri = product.data.variants[0].replace(/^\/?api\/v2\//, "");
                const productVariant = await axios.get(`${import.meta.env.VITE_API_URI}${productVariantUri}`);

                const formattedPrice = new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                }).format(productVariant.data.price / 100);

                const productDetails: ProductDetails = {
                    name: product.data.name,
                    description: product.data.description,
                    price: formattedPrice,
                    images: product.data.images,
                }

                setProductDetails(productDetails);
                console.log(productDetails);
            } catch(err) {
                console.error(err);
                setError("Echec du chargement du produit.");
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, []);

    const handleReadMore = () => {
        setShowFullDescription(true);
    };

    const truncatedDescription =
        productDetails?.description && productDetails?.description?.length > DESCRIPTION_LIMIT
            ? productDetails.description.slice(0, DESCRIPTION_LIMIT) + "..."
            : productDetails?.description;

    if (loading) return <Loader/>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <>
            <div className="grid lg:grid-cols-2 pt-24">
                <section>

                </section>
                <section className="flex flex-col px-14">
                    <h1 className="text-3xl lg:text-4xl pb-3.5 lg:pb-12">{productDetails?.name}</h1>
                    <div className="pb-10 order-3 lg:order-2">
                        <p className="text-2xl text-[#A9636C]">
                            {isMobile && !showFullDescription ? truncatedDescription : productDetails?.description}
                        </p>
                        {isMobile && !showFullDescription && (productDetails?.description?.length ?? 0) > DESCRIPTION_LIMIT && (
                            <p className="text-primary text-xl text-center cursor-pointer" onClick={handleReadMore}>
                                Afficher plus
                            </p>
                        )}
                    </div>
                    
                    <p className="text-2xl lg:text-3xl text-[#A9636C] order-2 pb-10 lg:pb-12 lg:order-3">{productDetails?.price}</p>
                </section>
            </div>
            <section></section>
        </>
    );
}