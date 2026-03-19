<template>
  <div class="space-y-3">
    <!-- Email confirmation -->
    <MockBrowser url="mail.google.com">
      <div class="p-3 sm:p-5">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
            <span class="text-brand-700 font-bold text-xs">B</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs sm:text-sm font-semibold text-slate-900">SlotyBook</p>
            <p class="text-[10px] sm:text-[11px] text-slate-400 truncate">noreply@slotybook.com</p>
          </div>
          <span class="ml-auto text-[10px] sm:text-[11px] text-slate-400 shrink-0">14:32</span>
        </div>
        <div class="rounded-lg bg-slate-50 border border-slate-100 p-3 sm:p-4">
          <p class="text-xs sm:text-sm font-semibold text-slate-900 mb-2">Votre rendez-vous est confirmé !</p>
          <div class="space-y-1.5 text-[11px] sm:text-xs text-slate-600">
            <div class="flex justify-between"><span class="text-slate-400">Service</span><span class="font-medium">Coloration</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Date</span><span class="font-medium">Jeudi 20 mars 2025</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Heure</span><span class="font-medium">14h00</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Chez</span><span class="font-medium">Salon Marie</span></div>
          </div>
        </div>
      </div>
    </MockBrowser>

    <!-- SMS reminder -->
    <div class="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-slate-800 p-3 sm:p-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <span class="text-[10px] sm:text-[11px] text-slate-400 font-medium">SMS · Rappel automatique J-1</span>
      </div>
      <div class="bg-emerald-500/10 rounded-lg px-3 py-2 inline-block max-w-[85%]">
        <p class="text-[11px] sm:text-xs text-emerald-100 leading-relaxed">Rappel : RDV demain à 14h00 chez Salon Marie (Coloration). À demain ! — SlotyBook</p>
      </div>
    </div>
  </div>
</template>
