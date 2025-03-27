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
        $this->apiUrl = $_ENV["MONDIAL_RELAY_API_URL"];
        $this->merchantId = $_ENV["MONDIAL_RELAY_MERCHANT_ID"];
        $this->privateKey = $_ENV["MONDIAL_RELAY_PRIVATE_KEY"];
    }

    public function getRelayPoints(
        string $postalCode,
        string $countryCode,
        string $orderWeight,
        ?string $latitude = null,
        ?string $longitude = null
    ): array {
        try {
            $client = new \SoapClient($this->apiUrl . "?WSDL");

            $params = [
                'Enseigne' => $this->merchantId,
                'Pays' => $countryCode,
                'Ville' => "",
                'CP' => $postalCode,
                'Taille' => "",
                'Poids' => $orderWeight,
                'Action' => "",
                'DelaiEnvoi' => '0',
                'RayonRecherche' => "20",
            ];

            if ($latitude && $longitude) {
                $params['Latitude'] = $latitude;
                $params['Longitude'] = $longitude;
            }

            $code = implode("", $params) . $this->privateKey;
            $params["Security"] = md5($code);

            $response = $client->__soapCall("WSI3_PointRelais_Recherche", [$params]);

            // Transformation du résultat en tableau PHP
            return $this->parseSoapResponse($response);
        } catch (\SoapFault $e) {
            return ['error' => 'Failed to fetch relay points', 'details' => $e->getMessage()];
        }
    }

    private function parseSoapResponse($response): array
    {
        $relayPoints = [];
        foreach ($response->WSI3_PointRelais_RechercheResult->PointsRelais->PointRelais_Details as $point) {
            $adresse = trim("{$point->LgAdr1} {$point->LgAdr2} {$point->LgAdr3} {$point->LgAdr4}");

            $relayPoints[] = [
                'relayPointNumber' => (string) $point->Num,
                'address' => $adresse,
                'postcode' => (string) $point->CP,
                'city' => (string) $point->Ville,
                'country' => (string) $point->Pays,
                'latitude' => (float) $point->Latitude,
                'longitude' => (float) $point->Longitude,
                'distance' => (float) $point->Distance,
            ];
        }

        return $relayPoints;
    }
}