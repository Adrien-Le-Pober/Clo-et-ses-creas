<?php

namespace App\Entity\Shipping;

use Doctrine\ORM\Mapping as ORM;
use Sylius\Component\Addressing\Model\Country;
use Sylius\Component\Shipping\Model\ShippingMethodInterface;

#[ORM\Entity]
#[ORM\Table(name: "shipping_price")]
class ShippingPrice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\ManyToOne(targetEntity: ShippingMethodInterface::class)]
    #[ORM\JoinColumn(name: "shipping_method_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private ShippingMethodInterface $shippingMethod;

    #[ORM\Column(type: "float")]
    private float $weight;

    #[ORM\Column(type: "integer")]
    private int $price;

    #[ORM\ManyToOne(targetEntity: Country::class)]
    #[ORM\JoinColumn(name: "country_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private Country $country;

    public function getId(): int
    {
        return $this->id;
    }

    public function getShippingMethod(): ShippingMethodInterface
    {
        return $this->shippingMethod;
    }

    public function setShippingMethod(ShippingMethodInterface $shippingMethod): void
    {
        $this->shippingMethod = $shippingMethod;
    }

    public function getWeight(): float
    {
        return $this->weight;
    }

    public function setWeight(float $weight): void
    {
        $this->weight = $weight;
    }

    public function getPrice(): int
    {
        return $this->price;
    }

    public function setPrice(int $price): void
    {
        $this->price = $price;
    }

    public function getCountry(): Country
    {
        return $this->country;
    }

    public function setCountry(Country $country): void
    {
        $this->country = $country;
    }
}