<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Sylius\Component\Core\Model\ShopUserInterface;

final class DeleteAccountController
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager
    ) {}

    public function __invoke(): Response
    {
        /** @var ShopUserInterface|null $user */
        $user = $this->security->getUser();

        if (!$user) {
            return new Response(null, Response::HTTP_UNAUTHORIZED);
        }

        $customer = $user->getCustomer();

        if ($customer) {
            // Anonymisation RGPD
            $customer->setEmail(sprintf('deleted_%s@anon.local', uniqid()));
            $customer->setFirstName('Anonyme');
            $customer->setLastName('Utilisateur');
            $customer->setPhoneNumber(null);
            $customer->setSubscribedToNewsletter(false);
        }

        // Désactivation du compte
        $user->setEnabled(false);

        $this->entityManager->flush();

        // Suppression du cookie JWT
        $response = new Response(null, Response::HTTP_NO_CONTENT);
        $response->headers->setCookie(
            new Cookie(
                name: 'AUTH-TOKEN',
                value: '',
                expire: time() - 3600,
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: $_ENV['APP_ENV'] === 'prod' ? 'Lax' : 'None'
            )
        );

        return $response;
    }
}
