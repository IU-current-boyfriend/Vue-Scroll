<template>
  <div class="nav-container">
    <template v-for="nav of categoryNav"
              :key="nav.id">
      <div class="parent-nav">
        <div class="parent-title"
             v-scroll-to="`#${nav.idName}`">{{nav.title}}</div>
        <template v-if="nav.children">
          <div v-for="child of nav.children"
               :key="child.id">
            <div class="child-title"
                 v-scroll-to="`#${child.idName}`">{{child.title}}</div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
  const props = defineProps({
    categoryNav: Array,
  });
</script>