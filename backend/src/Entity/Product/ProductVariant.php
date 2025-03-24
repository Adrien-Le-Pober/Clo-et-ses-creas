<?php

declare(strict_types=1);

namespace App\Entity\Product;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Sylius\Component\Core\Model\ProductVariant as BaseProductVariant;
use Sylius\Component\Product\Model\ProductVariantTranslationInterface;

#[ORM\Entity]
#[ORM\Table(name: 'sylius_product_variant')]
class ProductVariant extends BaseProductVariant
{
    #[Groups(["sylius:shop:product_variant:show", "sylius:shop:cart:show"])]
    public function getWeight(): ?float
    {
        return parent::getWeight();
    }

    protected function createTranslation(): ProductVariantTranslationInterface
    {
        return new ProductVariantTranslation();
    }
}
