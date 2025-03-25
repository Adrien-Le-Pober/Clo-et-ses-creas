<?php

namespace App\Controller;

use App\Entity\Order\Order;
use Symfony\Component\HttpFoundation\Request;
use App\Service\Shipment\MondialRelayShipment;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sylius\Component\Core\Repository\ShippingMethodRepositoryInterface;

#[Route('/api/v2/shop/shipping-methods', name: 'shop_shipping_method_')]
class ShippingMethodController extends AbstractController
{
    public function __construct(
        private ShippingMethodRepositoryInterface $shippingMethodRepository,
        private MondialRelayShipment $mondialRelayShipment
    ) {}

    #[Route('/{code}/relay-points', name: 'get_relay_points', methods: ['POST'])]
    public function getRelayPoints(string $code, Request $request): JsonResponse
    {
        $shippingMethodCodes = [
            'mondial_relay',
        ];

        $shippingMethod = $this->shippingMethodRepository->findOneBy(['code' => $code]);

        if (!in_array($shippingMethod->getMethod()->getCode(), $shippingMethodCodes)) {
            return new JsonResponse(['error' => 'Mode de livraison invalide'], 400);
        }

        $order = $shippingMethod->getOrder();

        if (!$order instanceof Order) {
            return new JsonResponse(['error' => 'Type de commande invalide'], 400);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['postcode'], $data['countryCode'])) {
            return new JsonResponse(['error' => 'Code postal et pays requis'], 400);
        }

        $postalCode = $data['postcode'] ?? $order->getShippingAddress()->getPostcode();
        $countryCode = $data['countryCode'] ?? $order->getShippingAddress()->getCountryCode();
        $orderWeight = (string)$order->getWeightTotal();

        if (!$postalCode) return new JsonResponse(['error' => 'Code postal requis'], 400);

        $relayPoints = match($shippingMethod->getMethod()->getCode()) {
            'mondial_relay' => $this->mondialRelayShipment->getRelayPoints($postalCode, $countryCode, $orderWeight),
        };

        return new JsonResponse($relayPoints);
    }
}
