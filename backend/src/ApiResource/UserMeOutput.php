<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\Get;
use App\Controller\MeController;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/shop/me',
            controller: MeController::class,
            read: false,
            name: 'api_me',
            security: 'is_granted("ROLE_USER")'
        )
    ],
    paginationEnabled: false
)]
class UserMeOutput
{
    public ?int $customerId = null;
    public ?string $email = null;
    public ?string $firstName = null;
    public ?string $lastName = null;
}