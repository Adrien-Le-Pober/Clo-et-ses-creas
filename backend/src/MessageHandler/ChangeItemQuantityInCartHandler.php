<?php

namespace App\MessageHandler;

use App\Entity\Order\Order;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Sylius\Component\Order\Model\OrderInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Sylius\Component\Core\Repository\OrderRepositoryInterface;
use Sylius\Bundle\ApiBundle\Command\Cart\ChangeItemQuantityInCart;
use Sylius\Component\Core\Repository\OrderItemRepositoryInterface;

#[AsMessageHandler]
class ChangeItemQuantityInCartHandler
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private OrderItemRepositoryInterface $orderItemRepository,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger
    ) {}

    public function __invoke(ChangeItemQuantityInCart $command): OrderInterface
    {
        $order = $this->orderRepository->findCartByTokenValue($command->orderTokenValue);
        if (!$order) {
            throw new \RuntimeException('Cart not found');
        }
        if (!$order instanceof Order) {
            throw new \RuntimeException('Expected instance of Order, got ' . get_class($order));
        }

        $orderItem = $this->orderItemRepository->find($command->orderItemId);
        if (!$orderItem) {
            throw new \RuntimeException('Order Item not found');
        }

        $weightTotal = $this->calculateOrderWeightTotal($orderItem, $order->getWeightTotal(), $command->quantity);

        $this->updateOrderWeightTotal($order, $weightTotal);

        return $order;
    }

    private function calculateOrderWeightTotal(object|null $orderItem, null|float $orderWeightTotal, int $itemQuantity): int|float
    {
        $oldQuantity = $orderItem->getQuantity();
        $itemWeight = $orderItem->getVariant()->getWeight();

        $weightTotal = $orderWeightTotal ?: 0;
        $weightTotal -= $itemWeight * $oldQuantity; // Retire l'ancien poids
        $weightTotal += $itemWeight * $itemQuantity; // Ajoute le nouveau poids

        return $weightTotal;
    }

    private function updateOrderWeightTotal(Order $order, int|float $weightTotal): void
    {
        $order->setWeightTotal($weightTotal);

        $this->entityManager->persist($order);
        $this->entityManager->flush();
    }
}