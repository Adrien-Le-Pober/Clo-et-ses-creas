<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripePaymentController
{
    #[Route('/api/v2/payment-intent', name: 'create_payment_intent', methods: ['POST'])]
    public function createPaymentIntent(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        $paymentIntent = PaymentIntent::create([
            'amount' => $data['amount'],
            'currency' => 'eur',
            'receipt_email' => $data['email'],
            'metadata' => [
                'order_id' => $data['orderId'] ?? 'N/A',
            ],
        ]);

        return new JsonResponse(['clientSecret' => $paymentIntent->client_secret]);
    }
}