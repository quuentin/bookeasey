<template>
  <MockBrowser url="bookeasey.fr/salon-marie">
    <div>
      <!-- Cover -->
      <div class="h-16 sm:h-20" style="background: linear-gradient(135deg, #1f2533, #5b21b6)" />

      <!-- Profile card -->
      <div class="px-3 sm:px-4 -mt-6 sm:-mt-8 relative z-10">
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-3 sm:p-4">
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-brand-50 border-2 border-white shadow-xs flex items-center justify-center shrink-0">
              <span class="text-brand-600 font-bold text-sm sm:text-base">S</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-slate-900 text-xs sm:text-sm">Salon Marie</h3>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[9px] sm:text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">Coiffure</span>
                <span class="text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-0.5">
                  <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  Paris 11e
                </span>
              </div>
              <p class="text-[8px] sm:text-[9px] text-slate-400 mt-1 leading-relaxed line-clamp-2">Salon chaleureux au cœur du 11e. Coupes tendances, colorations naturelles, soins bio.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="px-3 sm:px-4 py-3">
        <p class="text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Réserver un créneau</p>
        <div class="space-y-1.5">
          <div class="flex items-center justify-between p-2 sm:p-2.5 rounded-lg border border-slate-100 hover:border-brand-200 transition-colors cursor-pointer group">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-brand-400" />
              <div>
                <p class="text-[10px] sm:text-xs font-medium text-slate-800 group-hover:text-brand-700 transition-colors">Coupe femme</p>
                <p class="text-[8px] sm:text-[9px] text-slate-400">45 min</p>
              </div>
            </div>
            <span class="text-[10px] sm:text-xs font-bold text-brand-600">35€</span>
          </div>

          <div class="flex items-center justify-between p-2 sm:p-2.5 rounded-lg border-2 border-brand-400 bg-brand-50/60 cursor-pointer">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <div>
                <p class="text-[10px] sm:text-xs font-medium text-brand-700">Coloration</p>
                <p class="text-[8px] sm:text-[9px] text-brand-400">1h30</p>
              </div>
            </div>
            <span class="text-[10px] sm:text-xs font-bold text-brand-600">80€</span>
          </div>

          <div class="flex items-center justify-between p-2 sm:p-2.5 rounded-lg border border-slate-100 cursor-pointer">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <div>
                <p class="text-[10px] sm:text-xs font-medium text-slate-800">Brushing</p>
                <p class="text-[8px] sm:text-[9px] text-slate-400">30 min</p>
              </div>
            </div>
            <span class="text-[10px] sm:text-xs font-bold text-brand-600">20€</span>
          </div>

          <div class="flex items-center justify-between p-2 sm:p-2.5 rounded-lg border border-slate-100 cursor-pointer">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <div>
                <p class="text-[10px] sm:text-xs font-medium text-slate-800">Coupe homme</p>
                <p class="text-[8px] sm:text-[9px] text-slate-400">30 min</p>
              </div>
            </div>
            <span class="text-[10px] sm:text-xs font-bold text-brand-600">25€</span>
          </div>
        </div>

        <p class="text-[8px] text-slate-300 text-center mt-3">Propulsé par BookEasy</p>
      </div>
    </div>
  </MockBrowser>
</template>
