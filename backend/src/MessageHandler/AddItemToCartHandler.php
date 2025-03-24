<?php

namespace App\MessageHandler;

use App\Entity\Order\Order;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Sylius\Component\Order\Model\OrderInterface;
use Sylius\Bundle\ApiBundle\Command\Cart\AddItemToCart;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Sylius\Component\Core\Repository\OrderRepositoryInterface;
use Sylius\Component\Core\Repository\ProductVariantRepositoryInterface;

#[AsMessageHandler]
class AddItemToCartHandler
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private ProductVariantRepositoryInterface $productVariantRepository,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger
    ) {}

    public function __invoke(AddItemToCart $command): OrderInterface
    {
        $order = $this->orderRepository->findCartByTokenValue($command->orderTokenValue);
        if (!$order) {
            throw new \RuntimeException('Cart not found');
        }
        if (!$order instanceof Order) {
            throw new \RuntimeException('Expected instance of Order, got ' . get_class($order));
        }

        $variant = $this->productVariantRepository->findOneBy(['code' => $command->productVariantCode]);
        if (!$variant) {
            throw new \RuntimeException('Product variant not found');
        }

        $weightTotal = $this->calculateOrderWeightTotal($order->getWeightTotal(), $variant->getWeight(), $command->quantity);

        $this->updateOrderWeightTotal($weightTotal, $order);

        return $order;
    }

    
    private function calculateOrderWeightTotal(float|null $orderWeightTotal, float|null $variantWeight, int $commandQuantity): int|float
    {
        $weightTotal = $orderWeightTotal ?: 0;
        $weightTotal += $variantWeight * $commandQuantity;

        return $weightTotal;
    }

    private function updateOrderWeightTotal(int|float $weightTotal, Order $order): void
    {
        $order->setWeightTotal($weightTotal);

        $this->entityManager->persist($order);
        $this->entityManager->flush();
    }
}