<?php

namespace App\MessageHandler;

use Sylius\Component\Mailer\Sender\SenderInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Sylius\Bundle\ApiBundle\Command\Account\RegisterShopUser;

#[AsMessageHandler]
class RegisterShopUserHandler
{
    public function __construct(private SenderInterface $mailer) {}

    public function __invoke(RegisterShopUser $message)
    {
        $this->mailer->send(
            'customer_registration',
            [$message->email],
            [
                'customer' => [
                    'firstName' => $message->firstName,
                    'email' => $message->email
                ]
            ]
        );
    }
}
