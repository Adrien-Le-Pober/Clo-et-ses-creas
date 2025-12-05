<?php

namespace App\Controller;

use App\ApiResource\UserMeOutput;
use Symfony\Bundle\SecurityBundle\Security;
use Sylius\Component\Core\Model\ShopUserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MeController extends AbstractController
{
    public function __invoke(Security $security): UserMeOutput
    {
        $user = $security->getUser();

        if (!$user instanceof ShopUserInterface) {
            throw new \LogicException("Invalid user type");
        }

        $customer = $user->getCustomer();

        $dto = new UserMeOutput();
        $dto->email = $customer->getEmail();
        $dto->firstName = $customer->getFirstName();
        $dto->lastName = $customer->getLastName();

        return $dto;
    }
}
