<?php

declare(strict_types=1);

namespace App\Entity\Addressing;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;
use Sylius\Component\Core\Model\Address as BaseAddress;

#[ApiResource]
#[ORM\Entity]
#[ORM\Table(name: 'sylius_address')]
class Address extends BaseAddress
{
    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([
        "sylius:shop:address:index",
        "sylius:shop:address:show",
        "sylius:shop:address:create",
        "sylius:shop:address:update",
        "sylius:shop:cart:show",
        "sylius:shop:cart:update"
    ])]
    private ?string $addressAdditional = null;

    public function getAddressAdditional(): ?string
    {
        return $this->addressAdditional;
    }

    public function setAddressAdditional(?string $addressAdditional): void
    {
        $this->addressAdditional = $addressAdditional;
    }
}
