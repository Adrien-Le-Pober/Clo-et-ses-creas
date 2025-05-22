<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class MondialRelayShippingGatewayType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('merchant_id', TextType::class, [
                'label' => 'Merchant ID (Code Enseigne)',
                'required' => true,
            ])
            ->add('private_key', TextType::class, [
                'label' => 'Clé privée',
                'required' => true,
            ])
            ->add('brand_code', TextType::class, [
                'label' => 'Code marque',
                'required' => true,
            ])
            ->add('api_url', TextType::class, [
                'label' => 'URL API',
                'required' => true,
            ]);
    }
}
