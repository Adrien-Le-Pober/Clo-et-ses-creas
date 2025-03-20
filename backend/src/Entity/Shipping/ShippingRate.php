<?php

namespace App\Entity\Shipping;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'shipping_rate')]
class ShippingRate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string', length: 48)]
    private string $carrier;

    #[ORM\Column(type: 'string', length: 2)]
    private string $countryCode;

    #[ORM\Column(type: 'float')]
    private float $maxWeight;

    #[ORM\Column(type: 'float')]
    private float $price;

    public function getCarrier(): string {
        return $this->carrier;
    }

    public function setCarrier(string $carrier): void {
        $this->carrier = $carrier;
    }

    public function getCountryCode(): string {
        return $this->countryCode;
    }

    public function setCountryCode(string $countryCode): void {
        $this->countryCode = $countryCode;
    }

    public function getMaxWeight(): float {
        return $this->maxWeight;
    }

    public function setMaxWeight(float $maxWeight): void {
        $this->maxWeight = $maxWeight;
    }

    public function getPrice(): float {
        return $this->price;
    }

    public function setPrice(float $price): void {
        $this->price = $price;
    }
}