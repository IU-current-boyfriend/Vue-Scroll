<template>
  <div class="wrapper">
    <div class="one"
         id="one">one</div>
  </div>
</template>

<script setup> 
  import { onMounted} from 'vue';
  
  onMounted(() => {
    const observe = new IntersectionObserver((entries, observe) => {
      console.log('callbacks...');
      
    }, {
      root: null,
      rootMargin: '0px',
      // threshold: [0.5]
      threshold: 0.5
    });

    observe.observe(document.getElementById("one"));
    
  })
</script>

<style scoped>
  .wrapper {
    /* position: relative; */
    width: 200px;
    height: 2000px;
    background-color: yellow;
    overflow: hidden;
  }

  .one {
    /* position: absolute; */
    width: 100px;
    height: 100px;
    /* top: 1000px; */
    /* left: 50px; */
    background-color: #000;
    margin-top: 1000px;
  }
</style>