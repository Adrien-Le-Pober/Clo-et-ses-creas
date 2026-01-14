export interface ProductDTO {
    id: string;
    code: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    taxon: string;
    slug: string;
}