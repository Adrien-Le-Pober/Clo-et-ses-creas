<?php

declare(strict_types=1);

namespace App\Entity\Addressing;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Sylius\Component\Core\Model\Address as BaseAddress;

#[ORM\Entity]
#[ORM\Table(name: 'sylius_address')]
class Address extends BaseAddress
{
    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(["address:read", "address:write"])]
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
