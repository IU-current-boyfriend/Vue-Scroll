<template>
  <div class="section-container">
    <template v-for="section of category"
              :key="section.id">
      <div class="section"
           :id="section.idName"
           :style="{height:`${section.height}px`, marginBottom: '30px'}">
        <h3 class="section-title">{{section.title}}</h3>
        <template v-if="section.children">
          <div class="section-child"
               v-for="child of section.children"
               :key="child.id"
               :id="child.idName"
               :style="{
                        height: `${child.height}px`,
                        lineHeight: `${child.height}px`,
                        textAlign: 'center', 
                        backgroundColor: getRandomRgbColor()
                      }">
            {{child.title}}
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
  defineProps({
    category: Array
  })

  const getRandomRgbColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
</script>