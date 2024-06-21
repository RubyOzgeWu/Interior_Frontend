<template>
  <q-layout view="lHh Lpr lFf" id="main-layout">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          v-if="isTablet"
          @click="toggleLeftDrawer"
        />
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          aria-label="Menu"
          @click="goBack"
          class="main-btn-back"
        />
      </q-toolbar>
    </q-header>

    <!--側邊欄 SideBar -->
    <q-drawer v-model="leftDrawerOpen" bordered :width="250">
      <q-list>
        <q-item-label
          header
          :style="{
            background: 'linear-gradient(to right, #2466e2, #5453a9)',
            '-webkit-background-clip': 'text',
            'background-clip': 'text',
            color: 'transparent',
          }"
        >
          HomeYoung Inc.
        </q-item-label>
        <SideBar />
      </q-list>
    </q-drawer>
    <!-- 主要內容區 -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import SideBar from "components/SideBar.vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "MainLayout",
});

// const leftDrawerOpen = ref(true);
const $q = useQuasar();
const isTablet = ref($q.screen.lt.lg);
const leftDrawerOpen = ref(!$q.screen.lt.lg); // 在电脑尺寸下默认打开左侧抽屉
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
const route = useRoute();
const router = useRouter();
const isProjectControl = ref(route.path.startsWith("/ProjectControl/project"));
const goBack = () => {
  router.go(-1); // 返回上一页
};
// 监听路由变化
watch(
  () => route.path,
  () => {
    isProjectControl.value = route.path.startsWith("/ProjectControl/project");
  }
);
</script>
