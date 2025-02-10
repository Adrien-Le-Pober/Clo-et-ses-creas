<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Routing\Annotation\Route;

class AuthController
{
    #[Route('/api/v2/logout', methods: ['POST'])]
    public function logout(): Response
    {
        $response = new Response();

        $cookie = new Cookie(
            name: 'AUTH-TOKEN', 
            value: '',
            expire: time() - 3600,
            path: '/',
            domain: null,
            secure: true,
            httpOnly: true,
            sameSite: $_ENV['APP_ENV'] === 'prod' ? 'Lax' : 'None'
        );

        // On attache le cookie à la réponse
        $response->headers->setCookie($cookie);
        $response->setStatusCode(Response::HTTP_OK);
        return $response;
    }
}
