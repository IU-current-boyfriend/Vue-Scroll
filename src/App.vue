<template>
  <div class="container">
    <header class="header">Header</header>
    <main class="main">
      <aside class="aside-nav">
        <AsideNav :categoryNav="categoryNav" />
      </aside>
      <section class="sections">
        <NavSection :category="categoryNav" />
      </section>
    </main>
  </div>
  <!-- <div>
    <ScrollDemo />
  </div> -->
</template>

<script setup>
  import { ref } from 'vue';
  import AsideNav from './components/AsideNav.vue';
  import NavSection from './components/NavSection.vue';
  import ScrollDemo from './components/ScrollDemo.vue';

  const categoryNav = ref([
    {
      id: 0,
      title: "工厂函数类目",
      idName: "factory-function",
      height: 600,
      parentIdName: null,
      children: [
        {
          id: 1,
          title: "特比的函数",
          idName: "tb-function-1",
          height: 200,
          parentIdName: "factory-function"
        },
        {
          id: 2,
          title: "帅到好久啊",
          idName: "tb-function-2",
          height: 400,
          parentIdName: "factory-function"
        }
      ]
    },
    {
      id: 3,
      title: "JavaScript函数",
      idName: "js-function",
      height: 400,
      parentIdName: null,
      children: [
        {
          id: 4,
          title: "审核多久啊",
          idName: "js-function-1",
          height: 100,
          parentIdName: "js-function",
        },
        {
          id: 5,
          title: "上世纪大婚",
          idName: "js-function-2",
          height: 200,
          parentIdName: "js-function",
        },
        {
          id: 6,
          title: "轻微恍惚啊",
          idName: "js-function-3",
          height: 100,
          parentIdName: "js-function",
        }
      ]
    },
    {
      id: 7,
      title: "Java函数",
      idName: "java-function",
      height: 600,
      parentIdName: null,
      children: [
        {
          id: 8,
          title: "圣诞节啊刷空间",
          idName: "java-function-1",
          height: 200,
          parentIdName: "java-function",
        },
         {
          id: 9,
          title: "全为UI气味",
          idName: "java-function-2",
          height: 100,
          parentIdName: "java-function",
        },
         {
          id: 10,
          title: "自粗iu现场",
          idName: "java-function-3",
          height: 100,
          parentIdName: "java-function",
        },
        {
          id: 11,
          title: "爱呕气诶哦去",
          idName: "java-function-4",
          height: 200,
          parentIdName: "java-function",
        },
      ]
    },
    {
      id: 12, 
      title: "系统管理",
      idName: "sys-manager",
      height: 300,
      parentIdName: null,
      children: [
        {
          id: 13,
          title: "偶iu气味",
          idName: "sys-manager-1",
          height: 100,
          parentIdName: "sys-manager",
        },
          {
          id: 14,
          title: "再重新注册",
          idName: "sys-manager-2",
          height: 100,
          parentIdName: "sys-manager"
        },
          {
          id: 15,
          title: "阿玛尼科学家肯德基",
          idName: "sys-manager-3",
          height: 100,
          parentIdName: "sys-manager"
        },
      ]
    }
  ]);


</script>

<style>

</style>