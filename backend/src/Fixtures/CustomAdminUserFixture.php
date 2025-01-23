<?php

namespace App\Fixtures;

use App\Entity\User\AdminUser;
use Doctrine\ORM\EntityManagerInterface;
use Sylius\Bundle\FixturesBundle\Fixture\AbstractFixture;
use Sylius\Bundle\FixturesBundle\Fixture\FixtureInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;

class CustomAdminUserFixture extends AbstractFixture implements FixtureInterface
{
    private EntityManagerInterface $manager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(
        EntityManagerInterface $manager,
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->manager = $manager;
        $this->passwordHasher = $passwordHasher;
    }

    public function getName(): string
    {
        return 'custom_admin_user';
    }

    public function load(array $options): void
    {
        $adminUser = new AdminUser();
        $adminUser->setEmail($options['email']);
        $adminUser->setUsername($options['username']);
        $adminUser->setPassword(
            $this->passwordHasher->hashPassword($adminUser, $options['password'])
        );
        $locale = $options['locale_code'] ?? 'en_US';
        $adminUser->setLocaleCode($locale);

        $adminUser->setEnabled(true);

        foreach ($options['roles'] as $role) {
            $adminUser->addRole($role);
        }

        $this->manager->persist($adminUser);
        $this->manager->flush();
    }

    protected function configureOptionsNode(ArrayNodeDefinition $optionsNode): void
    {
        $optionsNode
            ->children()
                ->scalarNode('email')->isRequired()->end()
                ->scalarNode('locale_code')->isRequired()->end()
                ->scalarNode('username')->isRequired()->end()
                ->scalarNode('password')->isRequired()->end()
                ->scalarNode('enabled')->isRequired()->end()
                ->arrayNode('roles')
                    ->prototype('scalar')->end()
                    ->defaultValue(['ROLE_ADMIN'])
                ->end()
            ->end();
    }
}
