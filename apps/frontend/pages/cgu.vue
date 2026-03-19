<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Conditions Générales d\'Utilisation - SlotyBook' })
</script>

<template>
  <div class="min-h-screen bg-white">
    <nav class="border-b border-slate-100 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center"><span class="text-white font-bold text-xs">B</span></div>
          <span class="font-bold text-slate-900">SlotyBook</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Conditions Générales d'Utilisation</h1>
      <p class="text-sm text-slate-400 mb-8">Dernière mise à jour : mars 2026</p>

      <div class="prose prose-slate prose-sm max-w-none space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 class="text-lg font-semibold text-slate-900">1. Objet</h2>
          <p>Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les modalités et conditions d'utilisation de la plateforme SlotyBook (ci-après "le Service"), éditée par la société Innov'Dev, EURL dont le siège social est situé au 200 Rue De La Croix Nivert, 75015 Paris.</p>
          <p>L'inscription sur la plateforme implique l'acceptation pleine et entière des présentes CGU.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">2. Description du Service</h2>
          <p>SlotyBook est une plateforme de prise de rendez-vous en ligne permettant aux professionnels indépendants de :</p>
          <ul>
            <li>Créer une page publique présentant leur activité et leurs services</li>
            <li>Gérer leur agenda et leurs disponibilités</li>
            <li>Recevoir des réservations de la part de leurs clients</li>
            <li>Envoyer des rappels automatiques</li>
            <li>Encaisser des paiements en ligne (plan Premium)</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">3. Inscription et compte</h2>
          <p>L'inscription au Service est gratuite. Le professionnel s'engage à fournir des informations exactes et à jour lors de son inscription. Il est responsable de la confidentialité de ses identifiants de connexion.</p>
          <p>Tout usage du Service effectué avec les identifiants d'un utilisateur sera réputé avoir été effectué par celui-ci.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">4. Plans et tarification</h2>
          <p>Le Service est proposé en deux plans :</p>
          <ul>
            <li><strong>Plan Gratuit :</strong> accès limité aux fonctionnalités de base (1 calendrier, 5 services, rappels email)</li>
            <li><strong>Plan Premium :</strong> 12€/mois HT, sans engagement, accès à l'ensemble des fonctionnalités (services illimités, paiement en ligne, SMS, sync Google Calendar, etc.)</li>
          </ul>
          <p>Les tarifs sont affichés sur le site et peuvent être modifiés à tout moment. Toute modification sera notifiée aux utilisateurs avec un préavis de 30 jours.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">5. Paiements</h2>
          <p>Les paiements sont gérés par Stripe, prestataire de paiement sécurisé. Innov'Dev n'a jamais accès aux données bancaires des utilisateurs ni de leurs clients.</p>
          <p>L'abonnement Premium est facturé mensuellement. L'utilisateur peut résilier à tout moment depuis son espace, sans frais. La résiliation prend effet à la fin de la période en cours.</p>
          <p>Les paiements encaissés par les professionnels via SlotyBook (acomptes, paiements de prestations) sont versés directement sur leur compte Stripe. SlotyBook ne prélève aucune commission sur ces transactions.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">6. Obligations du professionnel</h2>
          <p>Le professionnel s'engage à :</p>
          <ul>
            <li>Utiliser le Service conformément à sa destination</li>
            <li>Fournir des informations exactes sur son activité et ses services</li>
            <li>Respecter la législation en vigueur applicable à son activité</li>
            <li>Honorer les rendez-vous pris par ses clients via la plateforme</li>
            <li>Ne pas utiliser le Service à des fins illicites ou contraires aux bonnes mœurs</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">7. Responsabilité</h2>
          <p>SlotyBook est un outil de mise en relation. Innov'Dev n'est pas partie aux relations entre les professionnels et leurs clients. Innov'Dev ne saurait être tenue responsable des litiges pouvant survenir entre un professionnel et ses clients.</p>
          <p>Innov'Dev s'engage à mettre en œuvre tous les moyens raisonnables pour assurer la disponibilité et le bon fonctionnement du Service, sans obligation de résultat.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">8. Résiliation</h2>
          <p>L'utilisateur peut supprimer son compte à tout moment en contactant le support à contact@slotybook.com. La suppression du compte entraîne la suppression de toutes les données associées dans un délai de 30 jours.</p>
          <p>Innov'Dev se réserve le droit de suspendre ou résilier tout compte en cas de non-respect des présentes CGU.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">9. Modification des CGU</h2>
          <p>Innov'Dev se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email de toute modification substantielle. L'utilisation du Service après notification vaut acceptation des nouvelles CGU.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">10. Droit applicable et juridiction</h2>
          <p>Les présentes CGU sont régies par le droit français. Tout litige relatif à l'interprétation ou l'exécution des présentes sera soumis aux tribunaux compétents de Paris.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">11. Contact</h2>
          <p>Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l'adresse : <strong>contact@slotybook.com</strong></p>
        </section>
      </div>
    </div>
  </div>
</template>
