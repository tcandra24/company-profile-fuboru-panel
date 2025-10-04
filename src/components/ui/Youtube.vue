<template>
  <div>
    <LiteYouTubeEmbed :id="props.code!" title="" />
  </div>
</template>

<script setup lang="ts">
import LiteYouTubeEmbed from 'vue-lite-youtube-embed'
import 'vue-lite-youtube-embed/style.css'

const props = defineProps({
  code: String,
})
</script>
