<?php

namespace App\Service\Shipment;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class MondialRelayShipment
{
    private string $apiUrl;
    private string $merchantId;
    private string $privateKey;

    public function __construct(
        private HttpClientInterface $httpClient,
    ) {
        $this->httpClient = $httpClient;
        $this->apiUrl = getenv("MONDIAL_RELAY_API_URL");
        $this->merchantId = getenv("MONDIAL_RELAY_MERCHANT_ID");
        $this->privateKey = getenv("MONDIAL_RELAY_PRIVATE_KEY");
    }

    public function getRelayPoints(string $postalCode, string $countryCode, string $orderWeight): array
    {
        $xml = '<?xml version="1.0" encoding="utf-8"?>' .
            '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' .
                '<soap12:Body>' .
                    '<WSI2_RecherchePointRelais xmlns="http://www.mondialrelay.fr/webservice/">' .
                        '<Enseigne>' . $this->merchantId . '</Enseigne>' .
                        '<Pays>' . $countryCode . '</Pays>' .
                        '<CP>' . $postalCode . '</CP>' .
                        '<Poids>' . $orderWeight . '</Poids>' .
                        '<Action>Recherche</Action>' .
                        '<Security>' . $this->privateKey . '</Security>' .
                    '</WSI2_RecherchePointRelais>' .
                '</soap12:Body>' .
            '</soap12:Envelope>';

        try {
            $response = $this->httpClient->request('POST', $this->apiUrl, [
                'headers' => [
                    'Content-Type' => 'application/soap+xml; charset=utf-8',
                ],
                'body' => $xml
            ]);

            $responseContent = $response->getContent();

            return $this->parseSoapResponse($responseContent);
        } catch (\Exception $e) {
            return ['error' => 'Failed to fetch relay points', 'details' => $e->getMessage()];
        }
    }

    private function parseSoapResponse(string $responseContent): array
    {
        $xml = simplexml_load_string($responseContent);
        
        $relayPoints = [];
        
        foreach ($xml->xpath('//PR*') as $point) {
            $adresse = (string) $point->LgAdr1;
            if ((string) $point->LgAdr2) $adresse .= ' ' . (string) $point->LgAdr2;
            if ((string) $point->LgAdr3) $adresse .= ' ' . (string) $point->LgAdr3;
            if ((string) $point->LgAdr4) $adresse .= ' ' . (string) $point->LgAdr4;

            $relayPoints[] = [
                'relayPointNumber' => (string) $point->Num,
                'adress' => $adresse,
                'postcode' => (string) $point->CP,
                'city' => (string) $point->Ville,
                'country' => (string) $point->Pays,
            ];
        }

        return $relayPoints;
    }
}
