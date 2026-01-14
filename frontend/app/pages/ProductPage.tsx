import { useParams } from "react-router";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from "~/ui/Loader";
import DesktopCarousel from "~/features/product/components/ProductCarouselDesktop";
import MobileCarousel from "~/features/product/components/ProductCarouselMobile";
import Product from "~/features/product/components/Product";
import { useCart } from "~/features/cart/CartContext";
import type { ProductDTO } from '~/features/product/types';

interface ProductDetails {
    code: string;
    name: string;
    description: string;
    price: string;
    images: ProductImage[];
}

interface ProductImage {
    id: number;
    path: string;
    type?:string;
}

export default function ProductPage() {
    const apiURI = `${import.meta.env.VITE_API_URI}`;
    const { slug } = useParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 1024 : false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
    const { addItem } = useCart();
    const [associatedProducts, setAssociatedProducts] = useState<ProductDTO[] | null>(null);

    const DESCRIPTION_LIMIT = 170;

    useEffect(() => {
        const handleResize = () => {
            typeof window !== "undefined" && setIsMobile(window.innerWidth < 1024);
        };

        typeof window !== "undefined" && window.addEventListener("resize", handleResize);
        
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                if (!slug) {
                    setError("Slug non valide.");
                    setLoading(false);
                    return;
                }
                const product = await fetchProductBySlug(slug);
                const productVariant = await fetchProductVariant(product.variants[0]);
                const associatedProducts = await fetchProductAssociations(product.associations);
    
                const formattedPrice = new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                }).format(productVariant.price / 100);
    
                setProductDetails({
                    code: productVariant.code,
                    name: product.name,
                    description: product.description,
                    price: formattedPrice,
                    images: product.images,
                });
    
                setAssociatedProducts(associatedProducts);
            } catch (err) {
                console.error(err);
                setError("Échec du chargement du produit.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchProduct();
    }, [slug]);
    

    const fetchProductBySlug = async (slug: string) => {
        const product = await axios.get(`${apiURI}shop/products-by-slug/${slug}`);
        return product.data;
    };
    
    const fetchProductVariant = async (variantUri: string) => {
        const cleanedUri = variantUri.replace(/^\/?api\/v2\//, "");
        const variant = await axios.get(`${apiURI}${cleanedUri}`);
        return variant.data;
    };
    
    const fetchProductAssociations = async (associationsUris: string[]) => {
        let associatedProductsUris: string[] = [];
    
        for (let productAssociationUri of associationsUris) {
            const cleanedUri = productAssociationUri.replace(/^\/?api\/v2\//, "");
            let productAssociation = await axios.get(`${apiURI}${cleanedUri}`);
            associatedProductsUris.push(...productAssociation.data.associatedProducts);
        }

        // Limiter à 3 produits
        associatedProductsUris = associatedProductsUris.slice(0, 3);
    
        let associatedProducts: ProductDTO[] = [];
        for (let productUri of associatedProductsUris) {
            const cleanedUri = productUri.replace(/^\/?api\/v2\//, "");
            let product = await axios.get(`${apiURI}${cleanedUri}`);

            const productVariantUri = product.data.variants[0]?.replace(/^\/?api\/v2\//, "");
            let productVariant = productVariantUri ? await axios.get(`${apiURI}${productVariantUri}`) : null;
    
            associatedProducts.push({
                id: productVariant?.data.id,
                code: productVariant?.data.code,
                name: product.data.name,
                description: product.data.description,
                images: product.data.images.map((img: any) => img.path),
                price: productVariant?.data.price / 100,
                taxon: product.data.mainTaxon,
                slug: product.data.slug,
            });
        }
    
        return associatedProducts;
    };

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
                    {productDetails?.code && (
                        isMobile ? (
                            <MobileCarousel images={productDetails?.images || []} code={productDetails.code} />
                        ) : (
                            <DesktopCarousel images={productDetails?.images || []} code={productDetails.code} />
                        )
                    )}
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

            {isMobile && (
                <div className="flex justify-center px-6 pb-10">
                    <button
                        onClick={() => productDetails?.code && addItem(productDetails.code)}
                        className="bg-primary text-white px-10 py-4 rounded-lg text-2xl w-full max-w-[400px] shadow"
                        type="button"
                    >
                        Ajouter au panier
                    </button>
                </div>
            )}

            {associatedProducts && associatedProducts.length > 0 && (
                <section className="my-12 text-center">
                    <h2 className="text-4xl mb-6">Vous pourriez aussi aimer</h2>
                    <div className="flex flex-col items-center lg:justify-center lg:flex-row">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {associatedProducts.map((product) => (
                                <Product key={product.id} {...product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}