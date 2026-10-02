<template>
  <div class="app-layout">
    <TheNavbar />
    <div class="app-body">
      <TheSidebar />
      <main class="app-content">
        <div class="app-content-inner">
          <router-view />
        </div>
      </main>
    </div>
    <TheFooter />
  </div>
</template>

<script setup>
import TheNavbar from './components/layout/TheNavbar.vue'
import TheSidebar from './components/layout/TheSidebar.vue'
import TheFooter from './components/layout/TheFooter.vue'
</script>

<style>
/* Container interno — limita largura máxima do conteúdo como iFood/TudoGostoso */
.app-content-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
