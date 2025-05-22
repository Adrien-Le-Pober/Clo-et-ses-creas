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
                'CP' => ($latitude && $longitude) ? "" : $postalCode,
                'Taille' => "",
                'Poids' => $orderWeight,
                'Action' => "",
                'DelaiEnvoi' => '0',
                'RayonRecherche' => "20",
            ];

            if ($latitude && $longitude) {
                $params['Latitude'] = $latitude ? number_format((float)$latitude, 6, '.', '') : '';
                $params['Longitude'] = $longitude ? number_format((float)$longitude, 6, '.', '') : '';
            }

            $code = implode("", $params) . $this->privateKey;
            $params["Security"] = md5($code);

            $response = $client->__soapCall("WSI3_PointRelais_Recherche", [$params]);

            return $this->parseSoapResponse($response);
        } catch (\SoapFault $e) {
            return ['error' => 'Failed to fetch relay points', 'details' => $e->getMessage()];
        }
    }

    // Transformation du résultat en tableau PHP
    private function parseSoapResponse($response): array
    {
        $relayPoints = [];
        foreach ($response->WSI3_PointRelais_RechercheResult->PointsRelais->PointRelais_Details as $point) {
            $adresse = trim("{$point->LgAdr1} {$point->LgAdr2} {$point->LgAdr3} {$point->LgAdr4}");

            $parseHours = function ($horaires): ?string {
                // Extraire le tableau de chaînes
                if (is_object($horaires) && isset($horaires->string)) {
                    $horaires = is_array($horaires->string) ? $horaires->string : [$horaires->string];
                } elseif (!is_array($horaires)) {
                    return null;
                }

                // Nettoyage et formatage en HH:MM
                $cleaned = array_values(array_filter(array_map(function ($entry) {
                    $entry = trim((string)$entry);
                    if (!$entry || $entry === '/') return null;

                    // Format 1000 => 10:00
                    if (preg_match('/^\d{4}$/', $entry)) {
                        return substr($entry, 0, 2) . ':' . substr($entry, 2, 2);
                    }

                    return $entry;
                }, $horaires)));

                if (empty($cleaned)) {
                    return 'Fermé';
                }

                // Regrouper les horaires deux par deux
                $formatted = [];
                for ($i = 0; $i < count($cleaned); $i += 2) {
                    if (isset($cleaned[$i + 1])) {
                        $formatted[] = "{$cleaned[$i]} - {$cleaned[$i + 1]}";
                    } else {
                        // Cas impair (ex: 09:00 seul)
                        $formatted[] = $cleaned[$i];
                    }
                }

                return implode(' / ', $formatted);
            };

            $relayPoints[] = [
                'relayPointNumber' => (string) $point->Num,
                'address' => $adresse,
                'postcode' => (string) $point->CP,
                'city' => (string) $point->Ville,
                'country' => (string) $point->Pays,
                // on remplace les virgules par des points pour éviter problème de cast
                'latitude' => isset($point->Latitude) ? (float) str_replace(',', '.', $point->Latitude) : null,
                'longitude' => isset($point->Longitude) ? (float) str_replace(',', '.', $point->Longitude) : null,
                'distance' => (float) $point->Distance,

                'openingHours' => [
                    'monday' => $parseHours($point->Horaires_Lundi ?? null),
                    'tuesday' => $parseHours($point->Horaires_Mardi ?? null),
                    'wednesday' => $parseHours($point->Horaires_Mercredi ?? null),
                    'thursday' => $parseHours($point->Horaires_Jeudi ?? null),
                    'friday' => $parseHours($point->Horaires_Vendredi ?? null),
                    'saturday' => $parseHours($point->Horaires_Samedi ?? null),
                    'sunday' => $parseHours($point->Horaires_Dimanche ?? null),
                ],
            ];
        }

        return $relayPoints;
    }
}