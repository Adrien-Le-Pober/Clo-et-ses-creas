<?php

declare(strict_types=1);

namespace App\Entity\Order;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Sylius\Component\Core\Model\Order as BaseOrder;

#[ORM\Entity]
#[ORM\Table(name: 'sylius_order')]
class Order extends BaseOrder
{
    #[ORM\Column(type: 'float', nullable: true)]
    #[Groups(["sylius:shop:cart:show", "sylius:shop:cart:update"])]
    private ?float $weightTotal = 0;

    public function getWeightTotal(): ?float
    {
        return $this->weightTotal;
    }

    public function setWeightTotal(?float $weightTotal): void
    {
        $this->weightTotal = $weightTotal;
    }
}
