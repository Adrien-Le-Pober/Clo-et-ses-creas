<?php

namespace App\MessageHandler;

use App\Entity\Order\Order;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Sylius\Component\Core\Model\OrderInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Sylius\Bundle\ApiBundle\Command\Cart\RemoveItemFromCart;
use Sylius\Component\Core\Repository\OrderRepositoryInterface;
use Sylius\Component\Core\Repository\OrderItemRepositoryInterface;

#[AsMessageHandler]
class RemoveItemFromCartHandler
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private OrderItemRepositoryInterface $orderItemRepository,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger
    ) {}

    public function __invoke(RemoveItemFromCart $command): OrderInterface
    {
        $order = $this->orderRepository->findCartByTokenValue($command->orderTokenValue);
        if (!$order) {
            throw new \RuntimeException('Cart not found');
        }
        if (!$order instanceof Order) {
            throw new \RuntimeException('Expected instance of Order, got ' . get_class($order));
        }

        $orderItem = $this->orderItemRepository->find($command->itemId);
        if (!$orderItem) {
            throw new \RuntimeException('Order Item not found');
        }

        $weightTotal = $this->calculateOrderWeightTotal($order, $orderItem);

        $this->updateOrderWeightTotal($weightTotal, $order);

        return $order;
    }

    private function calculateOrderWeightTotal(Order $order, object|null $orderItem): int|float
    {
        $itemWeight = $orderItem->getVariant()->getWeight();
        $itemQuantity = $orderItem->getQuantity();

        $weightTotal = $order->getWeightTotal() ?: 0;
        $weightTotal -= $itemWeight * $itemQuantity;

        return $weightTotal;
    }

    private function updateOrderWeightTotal(int|float $weightTotal, Order $order): void
    {
        $order->setWeightTotal(max($weightTotal, 0));

        $this->entityManager->persist($order);
        $this->entityManager->flush();
    }
}
