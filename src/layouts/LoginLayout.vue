<template>
  <!-- 登入帳號 -->
  <div v-if="isLogin" id="login-container">
    <div class="logo"><img src="../assets/HomeYoung_logo.png" alt="" /></div>
    <q-form class="login-form" @submit.prevent="login">
      <q-input
        class="login-account"
        v-model="LoginForm.account"
        outlined
        label="帳號"
        :rules="rules.account"
      ></q-input>
      <q-input
        class="login-password"
        v-model="LoginForm.password"
        outlined
        label="密碼"
        :type="isPwd ? 'password' : 'text'"
        :rules="rules.password"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          /> </template
      ></q-input>
      <q-btn
        dense
        type="submit"
        size="22px"
        class="q-px-xl q-py-xs submit-btn"
        style="
          background-image: linear-gradient(to right, #2466e2, #5453a9);
          color: white;
        "
        label="登入"
      />
      <a
        class="register-link"
        href="#"
        style="display: block"
        @click="showRegisterForm"
        >註冊帳號</a
      >
    </q-form>
  </div>

  <!-- 註冊帳號 -->
  <div v-else id="register-container">
    <q-form class="register-form" @submit.prevent="register" v-model="valid">
      <p>註冊會員</p>
      <q-input
        class="register-account"
        v-model="RegisterForm.name"
        outlined
        label="姓名"
      ></q-input>
      <q-input
        class="register-email"
        v-model="RegisterForm.email"
        outlined
        label="信箱"
        :rules="rules.email"
      ></q-input>
      <q-input
        class="register-account"
        v-model="RegisterForm.account"
        outlined
        label="帳號"
        :rules="rules.account"
      ></q-input>
      <q-input
        class="register-password"
        v-model="RegisterForm.password"
        outlined
        label="密碼"
        :type="isPwd ? 'password' : 'text'"
        :rules="rules.password"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          /> </template
      ></q-input>
      <div class="user-role">
        <q-radio
          val="0"
          label="設計師"
          :rules="rules.role"
          v-model="RegisterForm.userRole"
        />
        <q-radio
          val="1"
          label="主管"
          :rules="rules.role"
          v-model="RegisterForm.userRole"
        />
      </div>

      <q-btn
        dense
        type="submit"
        size="22px"
        class="q-px-xl q-py-xs submit-btn"
        style="
          background-image: linear-gradient(to right, #2466e2, #5453a9);
          color: white;
        "
        label="註冊"
      />
      <a class="login-link" href="#" @click="showLoginForm">登入帳號</a>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { isEmail } from "validator";
import { useUserStore } from "../stores/user";
import { api } from "../boot/axios.js";

// 設定在前端儲存 user 資料庫
const user = useUserStore();
const isLogin = ref(true);
const isPwd = ref(true);
const rules = reactive({
  name: [
    (v) => !!v || "請輸入姓名",
    (v) => /^[a-zA-Z0-9]+$/.test(v) || "姓名應為英文字元或數字",
  ],
  account: [
    (v) => !!v || "請輸入帳號",
    (v) => (v.length >= 4 && v.length <= 20) || "帳號應為4-20個字元",
    (v) => /^[a-zA-Z0-9]+$/.test(v) || "帳號應為英文字元或數字",
  ],
  password: [
    (v) => !!v || "請輸入密碼",
    (v) => (v.length >= 4 && v.length <= 20) || "密碼應為4-20個字元",
    (v) => /^[a-zA-Z0-9]+$/.test(v) || "密碼應為英文字元或數字",
  ],
  email: [
    (v) => !!v || "請輸入信箱",
    (v) => isEmail(v) || "請輸入正確的信箱格式",
  ],
  role: [(v) => v !== null || "請選擇設計師或主管"],
});

const LoginForm = reactive({
  account: "",
  password: "",
});
const RegisterForm = reactive({
  name: "",
  account: "",
  password: "",
  email: "",
  userRole: null,
});

const showRegisterForm = () => {
  isLogin.value = false;
};
const showLoginForm = () => {
  isLogin.value = true;
};

/* 註冊 */
const register = async () => {
  try {
    await api.post("/users", RegisterForm);
    alert("註冊成功");
    isLogin.value = true;
    clearRegisterForm();
  } catch (error) {
    alert("註冊失敗");
  }
};

const clearRegisterForm = () => {
  RegisterForm.name = "";
  RegisterForm.account = "";
  RegisterForm.password = "";
  RegisterForm.email = "";
  RegisterForm.userRole = null;
};

const login = () => {
  user.login(LoginForm);
};
</script>
