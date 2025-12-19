<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Controller\DeleteAccountController;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/shop/account/delete',
            controller: DeleteAccountController::class,
            read: false,
            write: false,
            output: false,
            name: 'shop_delete_account',
            security: 'is_granted("ROLE_USER")'
        )
    ],
    paginationEnabled: false
)]
final class DeleteAccount
{
}