<?php

namespace App\Repository;

use App\Entity\Shipping\ShippingPrice;
use Doctrine\Persistence\ManagerRegistry;
use Sylius\Component\Addressing\Model\Country;
use Sylius\Component\Core\Model\ShippingMethod;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

class ShippingPriceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShippingPrice::class);
    }

    public function findPrice(
        Country $country,
        int $orderWeightTotal,
        ShippingMethod $shippingMethod
    ): ?int
    {
        return $this->createQueryBuilder('sp')
            ->select('sp.price')
            ->andWhere('sp.country = :country')
            ->andWhere('sp.shippingMethod = :shippingMethod')
            ->andWhere('sp.weight >= :orderWeightTotal')
            ->setParameter('country', $country)
            ->setParameter('shippingMethod', $shippingMethod)
            ->setParameter('orderWeightTotal', $orderWeightTotal)
            ->orderBy('sp.weight', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
