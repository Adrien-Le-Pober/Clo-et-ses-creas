<?php

namespace App\MessageHandler;

use Sylius\Component\User\Model\UserInterface;
use Sylius\Component\Mailer\Sender\SenderInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Sylius\Component\User\Repository\UserRepositoryInterface;
use Sylius\Bundle\ApiBundle\Command\Account\SendResetPasswordEmail;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsMessageHandler]
class SendResetPasswordEmailHandler
{
    public function __construct(
        private UserRepositoryInterface $shopUserRepository,
        private SenderInterface $mailer,
        private ParameterBagInterface $params
    ) {}

    public function __invoke(SendResetPasswordEmail $message)
    {
        $user = $this->shopUserRepository->findOneByEmail($message->email);

        if (!$user instanceof UserInterface || !$user->getPasswordResetToken()) {
            return;
        }

        $resetToken = $user->getPasswordResetToken();
        $frontendUrl = $_ENV['APP_FRONTEND_URL'];
        $resetUrl = sprintf('%s/connexion/nouveau-mot-de-passe?token=%s', $frontendUrl, $resetToken);

        $this->mailer->send(
            'custom_password_reset',
            [$message->email],
            ['resetUrl' => $resetUrl]
        );
    }
}
