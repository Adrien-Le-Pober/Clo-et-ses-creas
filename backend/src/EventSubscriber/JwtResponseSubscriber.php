<?php

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;

class JwtResponseSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            'lexik_jwt_authentication.on_authentication_success' => 'onAuthenticationSuccess',
        ];
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $token = $data['token'];

        $cookie = Cookie::create('AUTH-TOKEN')
            ->withValue($token)
            ->withExpires(strtotime('+1 hour'))
            ->withSecure(true)  // HTTPS obligatoire
            ->withHttpOnly(true)  // Protège contre XSS
            ->withSameSite($_ENV['APP_ENV'] === 'prod' ? 'Lax' : 'None');

        $response = $event->getResponse();
        $response->headers->setCookie($cookie);

        // Retirer le token de la réponse JSON (pour éviter qu'il soit exposé au frontend)
        unset($data['token']);
        $event->setData($data);
    }
}
