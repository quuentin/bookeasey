<template>
  <div class="min-h-screen flex">
    <!-- Left: gradient panel -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden" style="background: linear-gradient(135deg, #1f2533 0%, #2e1065 50%, #4c1d95 100%)">
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px); background-size: 24px 24px;" />
      <div class="relative z-10 flex flex-col justify-center px-16 text-white">
        <div class="flex items-center gap-3 mb-12">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <span class="text-white font-bold text-lg">B</span>
          </div>
          <span class="font-bold text-xl">SlotyBook</span>
        </div>
        <h1 class="text-4xl font-bold leading-tight mb-4">Simplifiez vos<br>réservations</h1>
        <p class="text-white/60 text-lg leading-relaxed max-w-md">Créez votre page de réservation en ligne et laissez vos clients prendre rendez-vous en autonomie, 24h/24.</p>
        <div class="mt-12 flex gap-8 text-sm text-white/40">
          <div><span class="block text-2xl font-bold text-white/80">5 min</span>de configuration</div>
          <div><span class="block text-2xl font-bold text-white/80">24/7</span>réservation</div>
          <div><span class="block text-2xl font-bold text-white/80">0€</span>pour commencer</div>
        </div>
      </div>
    </div>
    <!-- Right: form -->
    <div class="flex-1 flex items-center justify-center px-4 py-8 sm:p-6 bg-slate-50">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
