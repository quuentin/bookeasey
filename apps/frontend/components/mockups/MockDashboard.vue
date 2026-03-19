<template>
  <MockBrowser url="slotybook.com/dashboard">
    <div class="flex min-h-[280px] sm:min-h-[320px]">
      <!-- Mini sidebar -->
      <div class="w-12 sm:w-14 bg-slate-50 border-r border-slate-100 py-3 flex flex-col items-center gap-3 shrink-0">
        <div class="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
          <span class="text-white font-bold text-[8px]">B</span>
        </div>
        <div class="w-5 h-5 rounded bg-brand-50 flex items-center justify-center mt-2">
          <div class="w-2.5 h-2.5 rounded-sm bg-brand-400" />
        </div>
        <div class="w-5 h-5 rounded flex items-center justify-center">
          <div class="w-2.5 h-2.5 rounded-sm bg-slate-300" />
        </div>
        <div class="w-5 h-5 rounded flex items-center justify-center">
          <div class="w-2.5 h-2.5 rounded-sm bg-slate-300" />
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1 p-3 sm:p-4 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <p class="text-xs sm:text-sm font-bold text-slate-900">Bonjour, Marie</p>
            <p class="text-[9px] sm:text-[10px] text-slate-400">Mardi 18 mars · 3 rendez-vous aujourd'hui</p>
          </div>
          <div class="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
            <span class="text-brand-700 font-bold text-[8px]">M</span>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
          <div class="rounded-lg bg-brand-50 p-2">
            <p class="text-[8px] sm:text-[9px] text-brand-400 font-medium">Aujourd'hui</p>
            <p class="text-sm sm:text-base font-bold text-brand-700">3</p>
          </div>
          <div class="rounded-lg bg-emerald-50 p-2">
            <p class="text-[8px] sm:text-[9px] text-emerald-400 font-medium">Semaine</p>
            <p class="text-sm sm:text-base font-bold text-emerald-700">12</p>
          </div>
          <div class="rounded-lg bg-amber-50 p-2">
            <p class="text-[8px] sm:text-[9px] text-amber-400 font-medium">Revenus</p>
            <p class="text-sm sm:text-base font-bold text-amber-700">485€</p>
          </div>
        </div>

        <!-- Appointments list -->
        <p class="text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Rendez-vous du jour</p>
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
            <div class="text-center min-w-[36px]">
              <p class="text-[10px] sm:text-xs font-bold text-slate-900">9:00</p>
              <p class="text-[8px] text-slate-400">9:30</p>
            </div>
            <div class="w-px h-5 bg-brand-200" />
            <div class="flex-1 min-w-0">
              <p class="text-[10px] sm:text-xs font-medium text-slate-800 truncate">Julie Martin</p>
              <p class="text-[8px] sm:text-[9px] text-slate-400 truncate">Coupe femme</p>
            </div>
            <span class="text-[8px] sm:text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">Confirmé</span>
          </div>

          <div class="flex items-center gap-2 p-2 rounded-lg bg-brand-50/50 border border-brand-100">
            <div class="text-center min-w-[36px]">
              <p class="text-[10px] sm:text-xs font-bold text-brand-700">10:00</p>
              <p class="text-[8px] text-brand-400">11:30</p>
            </div>
            <div class="w-px h-5 bg-brand-300" />
            <div class="flex-1 min-w-0">
              <p class="text-[10px] sm:text-xs font-medium text-brand-800 truncate">Marie Dupont</p>
              <p class="text-[8px] sm:text-[9px] text-brand-500 truncate">Coloration</p>
            </div>
            <span class="text-[8px] sm:text-[9px] font-medium text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded shrink-0">En cours</span>
          </div>

          <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
            <div class="text-center min-w-[36px]">
              <p class="text-[10px] sm:text-xs font-bold text-slate-900">14:00</p>
              <p class="text-[8px] text-slate-400">14:30</p>
            </div>
            <div class="w-px h-5 bg-amber-200" />
            <div class="flex-1 min-w-0">
              <p class="text-[10px] sm:text-xs font-medium text-slate-800 truncate">Léa Bernard</p>
              <p class="text-[8px] sm:text-[9px] text-slate-400 truncate">Brushing</p>
            </div>
            <span class="text-[8px] sm:text-[9px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">14h00</span>
          </div>
        </div>
      </div>
    </div>
  </MockBrowser>
</template>
