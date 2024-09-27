<template>
  <div>
    <div class="flex justify-between px-8">
      <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
      <div class="p-2 min-w-max">
        <UButton @click="clear_data()">Clear Data</UButton>
      </div>
    </div>
    <div class="flex flex-col items-center w-full p-8">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Context',
  icon: 'i-mdi:robot',
  to: '/context'
}]

const clear_data = () => {
  navigateTo("/")
  // reload 0.5 seconds after logout
  setTimeout(() => {
    window.location.reload();
  }, 500)
  localStorage.clear()
}
</script>