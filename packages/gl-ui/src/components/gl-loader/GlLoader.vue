<script lang="ts">
export default {
  name: 'GlLoader'
}
</script>

<template>
  <div class="gl-loader">
    <div class="gl-loader-dot"></div>
    <div class="gl-loader-dot"></div>
    <div class="gl-loader-dot"></div>
    <div class="gl-loader-dot"></div>
    <div class="gl-loader-dot"></div>
  </div>
</template>

<style>
/**
 *  加载动画
 */
.gl-loader {
  display: flex;
  justify-content: space-between;
  height: 50px;
  padding-top: 10px;
}

.gl-loader-dot {
  margin-left: 3px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: var(--color);
  animation: gl-loader-bounce 1.6s infinite alternate;
}

@keyframes gl-loader-bounce {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.gl-loader-dot:nth-child(1) {
  animation-delay: -0.8s;
  --color: #0e72cc;
}

.gl-loader-dot:nth-child(2) {
  animation-delay: -0.6s;
  --color: #6ca30f;
}

.gl-loader-dot:nth-child(3) {
  animation-delay: -0.4s;
  --color: #f59311;
}

.gl-loader-dot:nth-child(4) {
  animation-delay: -0.2s;
  --color: #fa4343;
}

.gl-loader-dot:nth-child(5) {
  animation-delay: 0s;
  --color: #16afcc;
}
</style>