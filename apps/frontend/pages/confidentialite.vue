<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Politique de confidentialité - BookEasy' })
</script>

<template>
  <div class="min-h-screen bg-white">
    <nav class="border-b border-slate-100 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center"><span class="text-white font-bold text-xs">B</span></div>
          <span class="font-bold text-slate-900">BookEasy</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Politique de confidentialité</h1>
      <p class="text-sm text-slate-400 mb-8">Dernière mise à jour : mars 2026</p>

      <div class="prose prose-slate prose-sm max-w-none space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 class="text-lg font-semibold text-slate-900">1. Responsable du traitement</h2>
          <p>Le responsable du traitement des données est la société Innov'Dev, EURL, dont le siège social est situé au 200 Rue De La Croix Nivert, 75015 Paris, France.</p>
          <p>Contact : <strong>contact@bookeasey.fr</strong></p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <h3 class="text-base font-semibold text-slate-800 mt-4">Pour les professionnels (utilisateurs inscrits) :</h3>
          <ul>
            <li>Nom, prénom, adresse email, mot de passe (hashé)</li>
            <li>Nom de l'activité, secteur, adresse, téléphone</li>
            <li>Données liées aux services proposés et aux rendez-vous</li>
          </ul>
          <h3 class="text-base font-semibold text-slate-800 mt-4">Pour les clients (visiteurs qui réservent) :</h3>
          <ul>
            <li>Nom, adresse email, numéro de téléphone</li>
            <li>Données liées aux rendez-vous pris</li>
          </ul>
          <h3 class="text-base font-semibold text-slate-800 mt-4">Données de navigation :</h3>
          <ul>
            <li>Adresse IP, type de navigateur, pages consultées</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">3. Finalités du traitement</h2>
          <ul>
            <li>Fourniture et gestion du Service (création de compte, réservations, rappels)</li>
            <li>Gestion des paiements via Stripe</li>
            <li>Communication avec les utilisateurs (support, notifications)</li>
            <li>Amélioration du Service et statistiques d'utilisation</li>
            <li>Respect des obligations légales</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">4. Base légale du traitement</h2>
          <ul>
            <li><strong>Exécution du contrat :</strong> les données nécessaires à la fourniture du Service</li>
            <li><strong>Intérêt légitime :</strong> amélioration du Service, statistiques</li>
            <li><strong>Obligation légale :</strong> conservation des données de facturation</li>
            <li><strong>Consentement :</strong> communications marketing (opt-in)</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">5. Durée de conservation</h2>
          <ul>
            <li><strong>Données de compte :</strong> conservées pendant la durée du compte, puis 30 jours après suppression</li>
            <li><strong>Données de rendez-vous :</strong> 3 ans après le rendez-vous</li>
            <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
            <li><strong>Données de navigation :</strong> 13 mois</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">6. Partage des données</h2>
          <p>Vos données ne sont jamais vendues. Elles peuvent être partagées avec :</p>
          <ul>
            <li><strong>Stripe :</strong> pour le traitement des paiements</li>
            <li><strong>Vercel :</strong> hébergement de l'application</li>
            <li><strong>Resend :</strong> envoi des emails transactionnels</li>
          </ul>
          <p>Tous nos sous-traitants sont conformes au RGPD.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">7. Hébergement des données</h2>
          <p>Les données sont hébergées en Union Européenne et aux États-Unis (Vercel, Stripe). Les transferts hors UE sont encadrés par les clauses contractuelles types de la Commission européenne.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">8. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger vos données</li>
            <li><strong>Droit de suppression :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
          </ul>
          <p>Pour exercer vos droits, contactez-nous à : <strong>contact@bookeasey.fr</strong></p>
          <p>Vous avez également le droit d'introduire une réclamation auprès de la CNIL (cnil.fr).</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">9. Cookies</h2>
          <p>Le site utilise uniquement des cookies strictement nécessaires au fonctionnement du Service (authentification, préférences). Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">10. Sécurité</h2>
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des mots de passe (bcrypt), communications HTTPS, accès restreint aux données.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">11. Contact</h2>
          <p>Pour toute question relative à la protection de vos données : <strong>contact@bookeasey.fr</strong></p>
        </section>
      </div>
    </div>
  </div>
</template>
