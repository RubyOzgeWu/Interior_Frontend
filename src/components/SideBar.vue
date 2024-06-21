<template>
  <div id="sidebar-container">
    <q-item class="user">
      <div class="account-info">
        <q-icon name="perm_identity"></q-icon>
        <div class="info-text">
          <p style="font-weight: 500; font-size: 1rem">
            {{ user.account }}
          </p>
          <p style="font-size: 0.75rem">{{ userRoleText }}</p>
        </div>
      </div>
      <div class="expand-icon" @click="toggleExpanded">
        <q-icon name="keyboard_arrow_down" v-show="!isExpanded" />
        <q-icon name="keyboard_arrow_up" v-show="isExpanded" />
      </div>
      <transition name="toggle">
        <q-card v-if="isExpanded" class="toggleDown">
          <q-card-section @click="logout">
            <p>登出</p>
          </q-card-section>
          <q-card-section>
            <p>個人設定</p>
          </q-card-section>
        </q-card>
      </transition>
    </q-item>
    <div class="menu">
      <router-link to="/MainControl" class="link-container">
        <q-icon name="dashboard"></q-icon>
        <span>主要控制台</span>
      </router-link>
      <router-link to="" class="link-container">
        <q-icon name="calendar_month"></q-icon>
        <span>團隊日曆</span>
      </router-link>
      <router-link to="" class="link-container">
        <q-icon name="call"></q-icon>
        <span>訪問紀錄</span>
      </router-link>
      <router-link to="" class="link-container">
        <q-icon name="collections_bookmark"></q-icon>
        <span>材料庫</span>
      </router-link>
      <router-link to="/" class="link-container">
        <q-icon name="web_asset"></q-icon>
        <span>公司網站</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "../stores/user.js";

const user = useUserStore();
const isExpanded = ref(false);

onMounted(() => {
  user.getUser();
});

/* eslint-disable indent */
const userRoleText = computed(() => {
  return user.userRole === 0
    ? "設計師"
    : user.userRole === 1
    ? "主管"
    : "訪客";
});
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

/* 登出 */
const { logout } = user;

defineOptions({
  name: "SideBar",
});
</script>
