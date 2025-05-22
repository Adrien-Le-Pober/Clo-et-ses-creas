<?php

namespace App\Shipping\Calculator;

use App\Entity\Order\Order;
use Sylius\Component\Shipping\Model\ShipmentInterface;
use Sylius\Component\Shipping\Calculator\CalculatorInterface;

class MondialRelayByWeightCalculator implements CalculatorInterface
{
    public function calculate(ShipmentInterface $shipment, array $configuration): int
    {
        /** @var Order $order */
        /** @var BaseShipmentInterface $shipment */
        $order = $shipment->getOrder();
        $weight = $order->getWeightTotal();

        if ($weight < 250) return 420;
        if ($weight < 500) return 430;
        if ($weight < 1000) return 540;
        if ($weight < 2000) return 660;
        if ($weight < 3000) return 790;
        if ($weight < 4000) return 890;
        if ($weight < 5000) return 1240;
        if ($weight < 7000) return 1440;
        if ($weight < 15000) return 2240;
        if ($weight < 25000) return 3240;
        return 3240;
    }

    public function getType(): string
    {
        return 'mondial_relay_by_weight';
    }
}