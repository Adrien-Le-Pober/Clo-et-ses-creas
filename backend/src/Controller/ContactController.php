<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

class ContactController extends AbstractController
{
    #[Route('/api/v2/contact', name: 'api_contact', methods: ['POST'])]
    public function contact(
        Request $request,
        ValidatorInterface $validator,
        MailerInterface $mailer
    ): JsonResponse {
        
        $data = json_decode($request->getContent(), true) ?? [];

        // Honeypot anti-spam
        if (!empty($data['website'])) {
            return new JsonResponse(['success' => false, 'error' => 'Spam détecté'], 400);
        }

        // Validation
        $constraints = new Assert\Collection([
            'name' => [new Assert\NotBlank(), new Assert\Length(['min' => 2])],
            'email' => [new Assert\NotBlank(), new Assert\Email()],
            'message' => [new Assert\NotBlank(), new Assert\Length(['min' => 10])],
            'phone' => [],
            'website' => [] // honeypot
        ]);

        $violations = $validator->validate($data, $constraints);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[$violation->getPropertyPath()] = $violation->getMessage();
            }

            return new JsonResponse(['success' => false, 'errors' => $errors], 400);
        }

        // Envoi email
        $email = (new TemplatedEmail())
            ->from($data['email'])
            ->to($_ENV['ADMIN_EMAIL'])
            ->subject('Nouveau message depuis le formulaire de contact')
            ->htmlTemplate('email/contact_message.html.twig')
            ->context([
                'name' => $data['name'],
                'senderEmail' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'message' => nl2br($data['message']),
            ]);

        $mailer->send($email);

        return new JsonResponse(['success' => true]);
    }
}
