<template>
  <MockBrowser url="bookeasey.fr/salon-marie">
    <div class="p-4 sm:p-6">
      <!-- Service recap -->
      <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
        <div class="w-2 h-2 rounded-full bg-violet-400" />
        <div class="flex-1">
          <p class="text-xs sm:text-sm font-medium text-slate-800">Coloration</p>
          <p class="text-[10px] sm:text-[11px] text-slate-400">Jeu. 20 mars à 14h00 · 1h30</p>
        </div>
        <span class="text-xs sm:text-sm font-bold text-brand-600">80€</span>
      </div>

      <!-- Client info filled -->
      <div class="space-y-2.5 mb-4">
        <div>
          <p class="text-[10px] sm:text-[11px] font-medium text-slate-500 mb-1">Nom</p>
          <div class="px-2.5 py-1.5 sm:py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800">Marie Dupont</div>
        </div>
        <div>
          <p class="text-[10px] sm:text-[11px] font-medium text-slate-500 mb-1">Email</p>
          <div class="px-2.5 py-1.5 sm:py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800">marie@email.com</div>
        </div>
      </div>

      <!-- Payment section -->
      <div class="rounded-xl bg-brand-50 border border-brand-200 p-3 sm:p-4 mb-4">
        <div class="flex items-center gap-2 mb-2.5">
          <svg class="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <p class="text-xs sm:text-sm font-semibold text-brand-700">Acompte requis</p>
        </div>
        <div class="flex items-center justify-between text-xs sm:text-sm">
          <span class="text-brand-600">Acompte de 30% à la réservation</span>
          <span class="font-bold text-brand-700">24€</span>
        </div>
      </div>

      <!-- Stripe-like button -->
      <button class="w-full py-2.5 sm:py-3 rounded-xl bg-brand-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Payer 24€ et confirmer
      </button>

      <p class="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        Paiement sécurisé via Stripe
      </p>
    </div>
  </MockBrowser>
</template>
