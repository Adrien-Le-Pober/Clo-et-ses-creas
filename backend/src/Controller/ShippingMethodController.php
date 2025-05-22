<?php

namespace App\Controller;

use App\Entity\Order\Order;
use App\Repository\ShippingPriceRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Service\Shipment\MondialRelayShipment;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sylius\Component\Core\Repository\OrderRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sylius\Component\Addressing\Repository\CountryRepositoryInterface;
use Sylius\Component\Core\Repository\ShippingMethodRepositoryInterface;

#[Route('/api/v2/shop/shipping-methods', name: 'shop_shipping_method_')]
class ShippingMethodController extends AbstractController
{
    public function __construct(
        private ShippingMethodRepositoryInterface $shippingMethodRepository,
        private OrderRepositoryInterface $orderRepository,
        private CountryRepositoryInterface $countryRepository,
        private MondialRelayShipment $mondialRelayShipment,
        private ShippingPriceRepository $shippingPriceRepository
    ) {}

    #[Route('/{code}/orders/{orderTokenValue}/relay-points', name: 'get_relay_points', methods: ['POST'])]
    public function getRelayPoints(string $code, string $orderTokenValue, Request $request): JsonResponse
    {
        $shippingMethodCodes = [
            'mondial_relay',
        ];

        $shippingMethod = $this->shippingMethodRepository->findOneBy(['code' => $code]);

        if (!in_array($shippingMethod->getCode(), $shippingMethodCodes)) {
            return new JsonResponse(['error' => 'Mode de livraison invalide'], 400);
        }

        $order = $this->orderRepository->findCartByTokenValue($orderTokenValue);
        if (!$order instanceof Order) {
            return new JsonResponse(['error' => 'Type de commande invalide'], 400);
        }

        $data = json_decode($request->getContent(), true);

        $postalCode = $data['postcode'] ?? $order->getShippingAddress()->getPostcode();
        $countryCode = $data['countryCode'] ?? $order->getShippingAddress()->getCountryCode();
        $orderWeight = (string)$order->getWeightTotal();
        $latitude = $data['latitude'] ?? null;
        $longitude = $data['longitude'] ?? null;

        if (!$postalCode) return new JsonResponse(['error' => 'Code postal requis'], 400);

        $relayPoints = match($shippingMethod->getCode()) {
            'mondial_relay' => $this->mondialRelayShipment->getRelayPoints(
                $postalCode,
                $countryCode,
                $orderWeight,
                $latitude,
                $longitude
            ),
        };

        return new JsonResponse($relayPoints);
    }

    #[Route('/{code}/{orderTokenValue}/shipping-price', name: 'get_shipping_price', methods: ['GET'])]
    public function getShippingPrice(string $code, string $orderTokenValue): JsonResponse
    {
        $shippingMethodCodes = [
            'mondial_relay',
        ];

        $shippingMethod = $this->shippingMethodRepository->findOneBy(['code' => $code]);

        if (!in_array($shippingMethod->getCode(), $shippingMethodCodes)) {
            return new JsonResponse(['error' => 'Mode de livraison invalide'], 400);
        }

        $order = $this->orderRepository->findCartByTokenValue($orderTokenValue);
        if (!$order instanceof Order) {
            return new JsonResponse(['error' => 'Type de commande invalide'], 400);
        }

        $countryCode = $order->getShippingAddress()->getCountryCode();
        $country = $this->countryRepository->findOneBy(['code' => $countryCode]);
        $orderWeightTotal = $order->getWeightTotal();

        $shippingPrice = $this->shippingPriceRepository
                            ->findPrice($country, $orderWeightTotal, $shippingMethod);

        return new JsonResponse($shippingPrice);
    }
}
