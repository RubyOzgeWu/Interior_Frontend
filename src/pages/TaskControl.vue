<template>
  <q-page>
    <div id="task-control">
      <div class="task-wrapper">
        <!-- header -->
        <div class="header">
          <h5>
            {{ task.name }}
            <span class="task-status" :class="getStatusClass(task.status)">{{
              task.status
            }}</span>
          </h5>
          <q-btn
            class="btn-comments"
            @click="toggleRightDrawer"
            icon="assignment"
            ><span>留言板</span></q-btn
          >
        </div>

        <!-- content -->
        <div class="content">
          <!-- q-card 佔滿 task-info -->
          <p class="task-date">交付日期：{{ task.date }}</p>
          <q-card class="task-info" flat>
            <q-btn
              icon="edit"
              @click="openEditTaskDialog(task)"
              flat
              dense
              round
            ></q-btn>
            <q-card-section>
              <div class="task-remark">
                {{ task.remark }}
              </div>
            </q-card-section>
          </q-card>

          <q-btn
            class="btn-add-files"
            icon="add"
            dense
            @click="triggerFileInput"
          />

          <div class="uploaded-files">
            <q-card
              v-for="file in uploadedFiles"
              :key="file"
              flat
              class="uploaded-file"
              @dblclick="downloadFile(file._id)"
            >
              <q-card-section class="row items-center">
                <q-icon name="upload_file" class="col-1"></q-icon>
                <p class="col-10">{{ file.fileName }}</p>
                <q-btn
                  class="btn-delete-files col-1"
                  icon="close"
                  flat
                  dense
                  @click="confirmDeleteFile(file._id)"
                />
              </q-card-section>
            </q-card>
          </div>
          <!-- 文件上傳表單 -->
          <form v-show="showForm" @submit.prevent="uploadFile">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              style="display: none"
            />
          </form>
        </div>
      </div>

      <!-- pad 留言板側邊欄 -->
      <q-drawer
        v-model="rightDrawerOpen"
        side="right"
        bordered
        :width="500"
        class="pad-comments-board-wrapper"
      >
        <h5>留言板</h5>
        <q-card
          ref="padCommentsContainer"
          class="pad-comments-container row"
          flat
        >
          <q-card-section>
            <div
              class="comments-container column"
              v-for="comments in allComments"
              :key="comments"
              :class="{ 'my-comment': comments.account === user.account }"
            >
              <div
                v-if="comments.account !== user.account"
                class="comments-account row"
              >
                <p>{{ comments.account }}</p>
              </div>
              <div
                class="comments-text row"
                :class="{ 'my-comment': comments.account === user.account }"
              >
                <p>{{ comments.text }}</p>
              </div>
            </div>
            <div ref="scrollMarkerPad"></div>
          </q-card-section>
        </q-card>

        <q-input
          v-model="comment"
          label="輸入訊息"
          type="textarea"
          filled
          autogrow
        >
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              @click="addComment(user.id)"
            /> </template
        ></q-input>
      </q-drawer>

      <!-- 留言板 -->
      <div class="comments-board-wrapper">
        <div class="comments-board-header row justify-between items-center">
          <h5>留言板</h5>
        </div>
        <q-card
          ref="commentsBoardContent"
          class="comments-board-content row"
          flat
        >
          <q-card-section>
            <div
              class="comments-container column"
              v-for="comments in allComments"
              :key="comments"
              :class="{ 'my-comment': comments.account === user.account }"
            >
              <div
                v-if="comments.account !== user.account"
                class="comments-account row"
              >
                <p>{{ comments.account }}</p>
              </div>
              <div
                class="comments-text row"
                :class="{ 'my-comment': comments.account === user.account }"
              >
                <p>{{ comments.text }}</p>
              </div>
            </div>
            <div ref="scrollMarker"></div>
          </q-card-section>
        </q-card>
        <q-input
          v-model="comment"
          label="輸入訊息"
          type="textarea"
          filled
          autogrow
          dense
        >
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              @click="addComment(user.id)"
            /> </template
        ></q-input>
      </div>
    </div>

    <!-- 編輯任務視窗 -->
    <q-dialog v-model="isTaskDialogOpen" persistent>
      <q-card class="add-form">
        <q-card-section>
          <div class="text-h4" style="font-weight: 700; color: #2466e2">
            編輯任務
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="taskForm.name" label="任務名稱" />
          <q-input v-model="taskForm.date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="taskForm.date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
            v-model="taskForm.status"
            label="任務狀態"
            :options="statusOptions"
          />
          <q-select
            v-model="taskForm.owner"
            label="專案主管"
            :options="ownerOptions"
          />
          <q-input
            v-model="taskForm.remark"
            label="備註"
            type="textarea"
            clearable
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn class="btn-cancel" flat label="取消" v-close-popup />
          <q-btn class="btn-save" flat label="儲存" @click="saveTask()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { apiAuth, api } from "../boot/axios.js";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { useUserStore } from "../stores/user.js";

const route = useRoute();
const taskId = ref("");
const projectId = ref("");
const commentsBoardContent = ref(null);
const scrollMarker = ref(null);
const padCommentsContainer = ref(null);
const scrollMarkerPad = ref(null);

const task = ref({
  _id: "",
  name: "",
  date: "",
  status: "準備中",
  owner: {
    label: "",
    value: "",
  },
  remark: "",
  files: [],
  __v: 0,
});

/* 顯示狀態 */
const getStatusClass = (status) => {
  return {
    "status-preparing": status === "準備中",
    "status-in-progress": status === "進行中",
    "status-done": status === "已完成",
    "status-expired": status === "已逾期",
  };
};
const ownerOptions = ref([]);
const statusOptions = ["準備中", "進行中", "已完成", "已逾期"];

/* 編輯任務視窗 */
const isTaskDialogOpen = ref(false);
const taskForm = reactive({
  _id: "",
  name: "",
  date: "2024/02/01",
  status: "準備中",
  owner: "",
  remark: "",
});
const openEditTaskDialog = (task) => {
  updateTaskForm(task);
  isTaskDialogOpen.value = true;
};
const updateTaskForm = (task) => {
  for (const key in taskForm) {
    if (
      Object.prototype.hasOwnProperty.call(taskForm, key) &&
      Object.prototype.hasOwnProperty.call(task, key)
    ) {
      taskForm[key] = task[key];
    }
  }
};
const saveTask = async () => {
  const updateData = {
    name: taskForm.name,
    date: taskForm.date,
    status: taskForm.status,
    owner: {
      label: taskForm.owner.label,
      value: taskForm.owner.value,
    },
    remark: taskForm.remark,
  };
  try {
    await apiAuth.patch(
      `/projects/${projectId.value}/tasks/${taskForm._id}`,
      updateData
    );
    alert("儲存成功");
    isTaskDialogOpen.value = false;
    await init();
  } catch {
    alert("儲存失敗");
  }
};

/* 上傳檔案 */
const showForm = ref(false);
const fileInput = ref(null);
const uploadedFiles = ref([]);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async () => {
  if (fileInput.value.files.length > 0) {
    await uploadFile();
  }
};

const uploadFile = async () => {
  const file = fileInput.value.files[0];
  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("taskId", taskId.value);

  try {
    const response = await api.post(
      `/projects/${projectId.value}/tasks/${taskId.value}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    alert("上傳成功");
    uploadedFiles.value.push(response.data.file);
    await init();
  } catch (error) {
    alert("上傳失敗");
  }
};

/* 刪除檔案 */
const confirmDeleteFile = (fileId) => {
  const isConfirmed = confirm("確定要刪除檔案 ？");
  if (isConfirmed) {
    deleteFile(fileId);
  }
};
const deleteFile = async (fileId) => {
  try {
    await apiAuth.delete(
      `/projects/${projectId.value}/tasks/${taskId.value}/files/${fileId}`
    );
    alert("刪除成功");
    await init();
  } catch (error) {
    throw new Error("刪除文件出錯:", error);
  }
};

/* 下載檔案 */
const downloadFile = async (fileId) => {
  try {
    const response = await api.get(
      `/projects/${projectId.value}/tasks/${taskId.value}/files/${fileId}`,
      {
        responseType: "blob",
      }
    );

    let fileName = "downloaded_file";

    // 從響應頭中獲取文件名
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename\*?=([^;]+)/);
      if (matches && matches[1]) {
        // 如果文件名包含編碼，進行解碼
        fileName = decodeURIComponent(matches[1].replace(/^UTF-8''/, ""));
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // 使用後端發送的文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert("下載成功");
  } catch (error) {
    alert("下載失敗");
  }
};

/* 留言板視窗 */
const $q = useQuasar();
const rightDrawerOpen = ref(!$q.screen.lt.lg); // 在電腦尺寸下默認打開右側抽屜
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
const allComments = ref([]);

/* 新增留言 */
const user = useUserStore();
const comment = ref("");
const addComment = async (userId) => {
  try {
    const data = { comment: comment.value };
    await apiAuth.post(
      `/projects/${projectId.value}/tasks/${taskId.value}/${userId}/comment`,
      data
    );
    // 清空評論輸入
    comment.value = "";

    await init();
    nextTick(() => {
      if (scrollMarker.value) {
        scrollMarker.value.scrollIntoView({ behavior: "smooth" });
      }
      if (scrollMarkerPad.value) {
        scrollMarkerPad.value.scrollIntoView({ behavior: "smooth" });
      }
    });
  } catch (error) {
    alert("新增失敗");
    console.error(error);
  }
};

const init = async () => {
  try {
    projectId.value = route.params.projectId;
    taskId.value = route.params.taskId;

    // 取得任務
    const { data } = await api.get(
      `/projects/${projectId.value}/tasks/${taskId.value}`
    );
    // const { data } = await api.get("/tasks/" + route.params.id);
    task.value = data;
    taskId.value = data._id;

    const [usersResponse, filesResponse, commentsResponse] = await Promise.all([
      apiAuth.get("/users/all"),
      apiAuth.get(`/projects/${projectId.value}/tasks/${taskId.value}/files`),
      apiAuth.get(
        `/projects/${projectId.value}/tasks/${taskId.value}/comments`
      ),
    ]);

    // 取得使用者
    const usersData = usersResponse.data;
    const getOwnerOptions = usersData.result.map((user) => ({
      label: user.account,
      value: user._id,
    }));
    ownerOptions.value = getOwnerOptions;
    /* 取得上傳檔案 */
    uploadedFiles.value = filesResponse.data.files;

    // 取得所有使用者的留言
    const commentsData = commentsResponse.data;
    commentsData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    allComments.value = commentsData;
  } catch (error) {
    alert("載入錯誤");
  }
};
init();
</script>
