<template>
  <UBadge class="flex max-w-min min-w-max m-2">
    <Icon :name="icon" class="mr-2" />
    <slot />
  </UBadge>
</template>

<script lang="ts" setup>
defineProps({
  icon: String
})
</script>

<style></style>