<?php

declare(strict_types=1);

namespace App;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250521124844 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE shipping_price (id INT AUTO_INCREMENT NOT NULL, country_id INT DEFAULT NULL, shipping_method_id INT DEFAULT NULL, weight DOUBLE PRECISION NOT NULL, price DOUBLE PRECISION NOT NULL, INDEX IDX_2457FF63F92F3E70 (country_id), INDEX IDX_2457FF635F7D6850 (shipping_method_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE shipping_price ADD CONSTRAINT FK_2457FF63F92F3E70 FOREIGN KEY (country_id) REFERENCES sylius_country (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE shipping_price ADD CONSTRAINT FK_2457FF635F7D6850 FOREIGN KEY (shipping_method_id) REFERENCES sylius_shipping_method (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE shipping_price DROP FOREIGN KEY FK_2457FF63F92F3E70');
        $this->addSql('ALTER TABLE shipping_price DROP FOREIGN KEY FK_2457FF635F7D6850');
        $this->addSql('DROP TABLE shipping_price');
    }
}
