<?php

namespace App\Controller;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Entity\Order\Order;
use Doctrine\ORM\EntityManagerInterface;
use Sylius\Component\Core\OrderPaymentStates;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sylius\Component\Payment\Model\PaymentInterface;
use Sylius\Component\Core\Repository\OrderRepositoryInterface;
use Sylius\Component\Core\Repository\PaymentRepositoryInterface;

class StripePaymentController
{
    #[Route('/api/v2/payment-intent', name: 'create_payment_intent', methods: ['POST'])]
    public function createPaymentIntent(Request $request, OrderRepositoryInterface $orderRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data['email'] || !$data['orderNumber']) {
            return new JsonResponse(['error' => 'Paramètres requis manquants.'], 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['error' => 'Email invalide.'], 400);
        }

        $order = $orderRepository->findOneBy(['tokenValue' => $data['orderNumber']]);
        if (!$order) return new JsonResponse(['error' => 'Commande introuvable.'], 404);

        if ($order->getTotal() !== (int)$data['amount']) return new JsonResponse(['error' => 'Montant incorrect.'], 400);

        try {
            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

            $paymentIntent = PaymentIntent::create([
                'amount' => $order->getTotal(),
                'currency' => 'eur',
                'receipt_email' => $data['email'],
                'metadata' => [
                    'order_id' => $order->getTokenValue(),
                ],
            ]);

            return new JsonResponse(['clientSecret' => $paymentIntent->client_secret]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de la création du paiement.'], 500);
        }
    }

    #[Route('/api/v2/mark-payment-completed', name: 'mark_payment_completed', methods: ['POST'])]
    public function markPaymentCompleted(
        Request $request,
        PaymentRepositoryInterface $paymentRepository,
        EntityManagerInterface $em, 
        OrderRepositoryInterface $orderRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $paymentId = $data['paymentId'] ?? null;
        if (!$paymentId) {
            return new JsonResponse(['error' => 'paymentId manquant'], 400);
        }

        $payment = $paymentRepository->find($paymentId);
        if (!$payment) {
            return new JsonResponse(['error' => 'Paiement introuvable'], 404);
        }

        $order = $orderRepository->find($payment->getOrder()->getId());

        if (!$order instanceof Order) {
            return new JsonResponse(['error' => 'Commande introuvable'], 404);
        }

        $order->setPaymentState(OrderPaymentStates::STATE_PAID);
        $payment->setState(PaymentInterface::STATE_COMPLETED);
        $em->flush();

        return new JsonResponse(['status' => 'ok']);
    }
}