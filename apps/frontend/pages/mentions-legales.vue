<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Mentions légales - SlotyBook' })
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
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">Mentions légales</h1>

      <div class="prose prose-slate prose-sm max-w-none space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 class="text-lg font-semibold text-slate-900">1. Éditeur du site</h2>
          <p>Le site <strong>slotybook.com</strong> est édité par :</p>
          <ul class="list-none space-y-1 pl-0">
            <li><strong>Raison sociale :</strong> Innov'Dev</li>
            <li><strong>Forme juridique :</strong> EURL</li>
            <li><strong>Siège social :</strong> 200 Rue De La Croix Nivert, 75015 Paris, France</li>
            <li><strong>Représentant légal :</strong> Le Gérant</li>
            <li><strong>Email :</strong> contact@slotybook.com</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">2. Hébergeur</h2>
          <ul class="list-none space-y-1 pl-0">
            <li><strong>Nom :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
            <li><strong>Site web :</strong> vercel.com</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">3. Propriété intellectuelle</h2>
          <p>L'ensemble du contenu du site slotybook.com (textes, images, graphismes, logo, icônes, logiciels, etc.) est la propriété exclusive d'Innov'Dev ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
          <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable d'Innov'Dev.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">4. Limitation de responsabilité</h2>
          <p>Innov'Dev s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, Innov'Dev ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le site.</p>
          <p>En conséquence, Innov'Dev décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">5. Liens hypertextes</h2>
          <p>Le site slotybook.com peut contenir des liens hypertextes vers d'autres sites internet. Innov'Dev ne dispose d'aucun moyen de contrôle du contenu de ces sites tiers et n'assume aucune responsabilité quant à leur contenu.</p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-slate-900">6. Droit applicable</h2>
          <p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </section>
      </div>
    </div>
  </div>
</template>
