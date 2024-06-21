<template>
  <q-page>
    <div id="project-control" class="column">
      <!-- header -->
      <div class="header col-1">
        <h5>專案控制台</h5>
        <q-btn class="btn-bulletin" @click="toggleRightDrawer" icon="assignment"
          ><span>公告欄</span></q-btn
        >
      </div>
      <!-- content -->
      <div class="content col-11">
        <!-- project -->
        <div class="project-wrapper">
          <!-- q-card 佔滿 project-info -->
          <q-card class="project-info" flat>
            <q-btn
              icon="edit"
              @click="openEditProjectDialog(project)"
              flat
              dense
              round
            ></q-btn>
            <q-card-section>
              <div class="info row">
                <div class="row col-12 project-title">
                  <span class="project-name">{{ project.name }} </span>
                  <span
                    class="project-status"
                    :class="getStatusClass(project.status)"
                    >{{ project.status }}</span
                  >
                </div>
                <div class="column col-6">
                  <div class="project-date col">
                    {{ formatDate(project.date) }}
                  </div>
                  <div class="project-owner col column">
                    {{ project.owner.label }}
                  </div>
                </div>
                <div class="column col-6">
                  <div class="project-address col">{{ project.address }}</div>
                  <div class="project-client col">{{ project.client }}</div>
                  <div class="project-phone col">{{ project.phone }}</div>
                </div>
              </div>
              <div class="complete-container">
                <DoughnutChart :phase="project.phase"></DoughnutChart>
              </div>
            </q-card-section>
          </q-card>
          <div class="btn-add">
            <q-btn
              icon="add"
              flat
              dense
              round
              @click="openAddTaskDialog"
            ></q-btn>
          </div>
          <!-- q-card 佔滿 tasks-container-->
          <q-card class="tasks-container" flat>
            <q-stepper v-model="step" vertical color="primary">
              <q-step
                icon="settings"
                v-for="task in tasks"
                :key="task._id"
                :title="task.name"
              >
                <q-card
                  class="task-card row"
                  @dblclick="goToTaskPage(projectId, task)"
                >
                  <p class="task-date col-12">{{ task.date }}</p>
                  <q-btn
                    color="grey-7"
                    round
                    flat
                    icon="more_horiz"
                    class="btn-menu"
                  >
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item clickable @click="openEditTaskDialog(task)">
                          <q-item-section>編輯</q-item-section>
                        </q-item>
                        <q-item clickable @click="confirmDeleteTask(task)">
                          <q-item-section>刪除</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  <p class="task-status">
                    <span :class="getStatusClass(task.status)">{{
                      task.status
                    }}</span>
                  </p>
                  <p class="task-owner">{{ task.owner.label }}</p>
                </q-card>
              </q-step>
            </q-stepper>
          </q-card>
        </div>
        <!-- bulletin board -->
        <div class="bulletin-board-wrapper">
          <div class="bulletin-header row justify-between items-center">
            <h5>公告欄</h5>
            <q-btn
              icon="add"
              flat
              dense
              round
              @click="openAddAnnounceDialog"
            ></q-btn>
          </div>
          <div class="bulletin-content">
            <q-card
              class="announcement-card"
              v-for="announcement in project.announcements"
              :key="announcement.title"
              flat=""
              @dblclick="openAnnouncement(announcement)"
            >
              <q-card-section>
                <div
                  class="announcement-header row justify-between items-center"
                >
                  <p class="announcement-title">{{ announcement.title }}</p>
                  <q-btn
                    color="grey-7"
                    round
                    flat
                    icon="more_horiz"
                    class="btn-menu"
                  >
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item
                          clickable
                          @click="openEditAnnounceDialog(announcement)"
                        >
                          <q-item-section>編輯</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          @click="confirmDeleteAnnouncement(announcement)"
                        >
                          <q-item-section>刪除</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>

                <div class="announcement-content">
                  {{ announcement.content }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <!-- pad 公告側邊欄 -->
      <q-drawer
        v-model="rightDrawerOpen"
        side="right"
        bordered
        :width="500"
        class="pad-bulletin-board-wrapper"
      >
        <div class="bulletin-header row justify-between items-center">
          <h5>公告欄</h5>
          <q-btn
            icon="add"
            flat
            dense
            round
            @click="openAddAnnounceDialog"
          ></q-btn>
        </div>
        <div class="bulletin-content">
          <q-card
            class="announcement-card"
            v-for="announcement in project.announcements"
            :key="announcement.title"
            flat=""
            @dblclick="openAnnouncement(announcement)"
          >
            <q-card-section>
              <div class="announcement-header row justify-between items-center">
                <p class="announcement-title">{{ announcement.title }}</p>
                <q-btn
                  color="grey-7"
                  round
                  flat
                  icon="more_horiz"
                  class="btn-menu"
                >
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item
                        clickable
                        @click="openEditAnnounceDialog(announcement)"
                      >
                        <q-item-section>編輯</q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="confirmDeleteAnnouncement(announcement)"
                      >
                        <q-item-section>刪除</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>

              <div class="announcement-content">
                {{ announcement.content }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-drawer>
    </div>

    <!-- 編輯專案視窗 -->
    <q-dialog v-model="isProjectDialogOpen" persistent>
      <q-card class="add-form">
        <q-card-section>
          <div class="text-h4" style="font-weight: 700; color: #2466e2">
            編輯專案
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="projectForm.name"
            label="專案名稱"
            :rules="[rules.required]"
          />
          <q-input v-model="projectForm.date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="projectForm.date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
            v-model="projectForm.status"
            label="專案狀態"
            :options="statusOptions"
            :rules="[rules.required]"
          />
          <q-select
            v-model="projectForm.phase"
            label="專案階段"
            :options="phaseOptions"
            :rules="[rules.required]"
          />
          <q-select
            v-model="projectForm.owner"
            label="專案主管"
            :options="ownerOptions"
            :rules="[rules.required]"
          />
          <q-input
            v-model="projectForm.client"
            label="業主姓名"
            :rules="[rules.required]"
          />
          <q-input
            v-model="projectForm.phone"
            label="業主電話"
            :rules="[rules.required]"
          />
          <q-input
            v-model="projectForm.address"
            label="專案地址"
            :rules="[rules.required]"
          />
          <q-input
            v-model="projectForm.budget"
            label="專案預算"
            :rules="[rules.required]"
          />
          <q-input
            v-model="projectForm.remark"
            label="備註"
            type="textarea"
            clearable
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn class="btn-cancel" flat label="取消" v-close-popup />
          <q-btn class="btn-save" flat label="儲存" @click="saveProject()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 新增、編輯任務視窗 -->
    <q-dialog v-model="isTaskDialogOpen" persistent>
      <q-card class="add-form">
        <q-card-section>
          <div class="text-h4" style="font-weight: 700; color: #2466e2">
            {{ isEditing ? "編輯任務" : "新增任務" }}
          </div>
        </q-card-section>

        <q-form ref="taskFormRef" @submit.prevent="submitTaskForm">
          <q-card-section>
            <q-input
              v-model="taskForm.name"
              label="任務名稱"
              :rules="[rules.required]"
            />
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
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
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
              :rules="[rules.required]"
            />
            <q-select
              v-model="taskForm.owner"
              label="任務負責人"
              :options="ownerOptions"
              :rules="[rules.required]"
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
            <q-btn
              class="btn-save"
              flat
              :label="isEditing ? '儲存' : '新增'"
              @click="submitTaskForm"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- 新增、編輯公告欄視窗 -->
    <q-dialog v-model="isBulletinDialogOpen" persistent>
      <q-card class="add-form bulletin-dialog">
        <q-card-section>
          <div class="text-h4" style="font-weight: 700; color: #2466e2">
            {{ isEditing ? "編輯公告" : "新增公告" }}
          </div>
        </q-card-section>

        <q-form ref="BulletinBoardRef" @submit.prevent="submitAnnouncement">
          <q-card-section>
            <q-input
              v-model="announcementForm.title"
              label="標題"
              :rules="[rules.required]"
            />
            <q-input
              v-model="announcementForm.content"
              label="內容"
              type="textarea"
              clearable
              input-class="custom-textarea"
              :rules="[rules.required]"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn class="btn-cancel" flat label="取消" v-close-popup />
            <q-btn
              class="btn-save"
              flat
              :label="isEditing ? '儲存' : '新增'"
              @click="submitAnnouncement"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- 公告視窗 -->
    <q-dialog v-model="isAnnouncementOpen">
      <q-card class="announcement-board">
        <q-card-section>
          <h4 class="title" style="font-weight: 700; color: black">
            {{ selectedAnnouncement.title }}
          </h4>
          <div class="content">{{ selectedAnnouncement.content }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiAuth, api } from "../boot/axios.js";
import DoughnutChart from "src/components/DoughnutChart.vue";
import { useQuasar } from "quasar";

const route = useRoute();
const projectId = ref("");
const rules = reactive({
  required(v) {
    return !!v || "必填";
  },
});
const taskFormRef = ref(null);
const BulletinBoardRef = ref(null);

const project = ref({
  owner: {
    label: "",
    value: "",
  },
  _id: "",
  name: "",
  date: "",
  status: "準備中",
  phase: "",
  client: "",
  address: "",
  phone: "",
  budget: "",
  remark: "",
  announcements: [],
  __v: 0,
});
const formatDate = (date) => {
  return new Date(date).toLocaleDateString(); // 格式化日期
};

/* 編輯專案 */
const isProjectDialogOpen = ref(false);
const projectForm = reactive({
  _id: "",
  name: "",
  date: "2024/02/01",
  status: "準備中",
  phase: "",
  owner: "",
  client: "",
  phone: "",
  address: "",
  budget: "",
  remark: "",
});
const ownerOptions = ref([]);
const statusOptions = ["準備中", "進行中", "已完成", "已逾期"];
const phaseOptions = ["提案階段", "設計階段", "工程階段"];
const openEditProjectDialog = (project) => {
  updateProjectForm(project);
  isProjectDialogOpen.value = true;
};
const updateProjectForm = (project) => {
  for (const key in projectForm) {
    if (
      Object.prototype.hasOwnProperty.call(projectForm, key) &&
      Object.prototype.hasOwnProperty.call(project, key)
    ) {
      projectForm[key] = project[key];
    }
  }
};

const saveProject = async () => {
  const updateData = {
    name: projectForm.name,
    date: projectForm.date,
    status: projectForm.status,
    phase: projectForm.phase,
    owner: {
      label: projectForm.owner.label,
      value: projectForm.owner.value,
    },
    client: projectForm.client,
    phone: projectForm.phone,
    address: projectForm.address,
    budget: projectForm.budget,
    remark: projectForm.remark,
  };
  try {
    await apiAuth.patch(`/projects/${projectForm._id}`, updateData);
    alert("儲存成功");
    isProjectDialogOpen.value = false;
    await init();
  } catch {
    alert("儲存失敗");
  }
};

/* 顯示狀態 */
const getStatusClass = (status) => {
  return {
    "status-preparing": status === "準備中",
    "status-in-progress": status === "進行中",
    "status-done": status === "已完成",
    "status-expired": status === "已逾期",
  };
};

/* 任務視窗 */
const tasks = ref([]);
const isTaskDialogOpen = ref(false);
const isEditing = ref(false);

const openAddTaskDialog = (phase) => {
  isEditing.value = false;
  resetTaskForm();
  projectForm.phase = phase;
  isTaskDialogOpen.value = true;
};
const resetTaskForm = () => {
  taskForm._id = "";
  taskForm.name = "";
  taskForm.date = "2024/02/01";
  taskForm.status = "準備中";
  taskForm.owner = "";
  taskForm.remark = "";
};
const taskForm = reactive({
  _id: "",
  name: "",
  date: "2024/02/01",
  status: "準備中",
  owner: "",
  remark: "",
});
const sortTasksByDate = () => {
  tasks.value.sort((a, b) => new Date(a.date) - new Date(b.date));
};
const submitTaskForm = () => {
  taskFormRef.value
    .validate()
    .then((success) => {
      if (success) {
        if (isEditing.value) {
          saveTask();
        } else {
          addTask(projectId.value);
        }
      }
    })
    .catch((err) => {
      console.error("表單驗證失敗:", err);
    });
};
/* 新增任務 */
const addTask = async (projectId) => {
  try {
    await apiAuth.post(`/projects/${projectId}/tasks`, taskForm);
    alert("新增成功");
    await init();
    isTaskDialogOpen.value = false;
  } catch {
    alert("新增失敗");
  }
};

/* 編輯任務 */
const openEditTaskDialog = (task) => {
  console.log(task);
  isEditing.value = true;
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
    _id: taskForm._id,
    name: taskForm.name,
    date: taskForm.date,
    status: taskForm.status,
    owner: {
      label: taskForm.owner.label,
      value: taskForm.owner.value,
    },
    remark: taskForm.remark,
  };

  console.log(updateData);
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

/* 刪除任務 */
const confirmDeleteTask = (task) => {
  const isConfirmed = confirm(`確定要刪除任務 "${task.name}" ？`);
  if (isConfirmed) {
    deleteTask(task._id);
  }
};
const deleteTask = async (taskId) => {
  try {
    await apiAuth.delete(`/projects/${projectId.value}/tasks/${taskId}`);
    alert("刪除成功");
    await init();
  } catch (error) {
    console.log(error);
    alert("刪除失敗");
  }
};

/* 進入 TaskControl */
const router = useRouter();
const goToTaskPage = (projectId, task) => {
  router.push(`/TaskControl/project/${projectId}/tasks/${task._id}`);
};

/* 公告欄視窗 */
const $q = useQuasar();
const rightDrawerOpen = ref(!$q.screen.lt.lg); // 在電腦尺寸下默認打開右側抽屜
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
const submitAnnouncement = () => {
  BulletinBoardRef.value
    .validate()
    .then((success) => {
      if (success) {
        if (isEditing.value) {
          saveAnnouncement();
        } else {
          addAnnouncement();
        }
      }
    })
    .catch((err) => {
      console.error("表單驗證失敗:", err);
    });
};

/* 新增公告 */
const isBulletinDialogOpen = ref(false);
const announcementForm = reactive({
  _id: "",
  title: "",
  content: "",
});
const openAddAnnounceDialog = () => {
  isEditing.value = false;
  resetAnnounceForm();
  isBulletinDialogOpen.value = true;
};
const resetAnnounceForm = () => {
  announcementForm.title = "";
  announcementForm.content = "";
};
const addAnnouncement = async () => {
  try {
    await apiAuth.post(
      `/projects/${projectId.value}/announcements`,
      announcementForm
    );
    alert("新增成功");
    await init();
    isBulletinDialogOpen.value = false;
  } catch (error) {
    alert("新增失敗");
  }
};

/* 編輯公告 */
const openEditAnnounceDialog = (announcement) => {
  isEditing.value = true;
  updateAnnouncementForm(announcement);
  isBulletinDialogOpen.value = true;
};
const updateAnnouncementForm = (announcement) => {
  for (const key in announcementForm) {
    if (
      Object.prototype.hasOwnProperty.call(announcementForm, key) &&
      Object.prototype.hasOwnProperty.call(announcement, key)
    ) {
      announcementForm[key] = announcement[key];
    }
  }
  if (announcement.id) {
    announcementForm._id = announcement.id;
  }
};
const saveAnnouncement = async () => {
  const updateData = {
    id: announcementForm._id,
    title: announcementForm.title,
    content: announcementForm.content,
  };
  try {
    await apiAuth.patch(
      `/projects/${projectId.value}/announcements`,
      updateData
    );
    alert("儲存成功");
    isBulletinDialogOpen.value = false;
    await init();
  } catch {
    alert("儲存失敗");
  }
};

/* 刪除公告 */
const confirmDeleteAnnouncement = (announcement) => {
  const isConfirmed = confirm("確定要刪除公告？");
  if (isConfirmed) {
    deleteAnnouncement(projectId.value, announcement.id);
  }
};

const deleteAnnouncement = async (projectId, announcementId) => {
  try {
    await apiAuth.delete(
      `/projects/${projectId}/announcements/${announcementId}`
    );
    alert("刪除成功");
    await init(); // Refresh the projects list after deleting the project
  } catch (error) {
    console.log(error);
    alert("刪除失敗");
  }
};

/* 公告視窗 */
const isAnnouncementOpen = ref(false);
const selectedAnnouncement = ref({ title: "", content: "" });
const openAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement;
  isAnnouncementOpen.value = true;
};

const init = async () => {
  try {
    // 取得 projects
    const { data } = await api.get("/projects/" + route.params.id);
    project.value = data.result;
    projectId.value = data.result._id;

    const [usersResponse, tasksResponse] = await Promise.all([
      apiAuth.get("/users/all"),
      api.get(`/projects/${projectId.value}/tasks/all`),
    ]);

    // 取得 users
    const usersData = usersResponse.data;
    const getOwnerOptions = usersData.result.map((user) => ({
      label: user.account,
      value: user._id,
    }));
    ownerOptions.value = getOwnerOptions;

    // 取得 tasks
    const tasksData = tasksResponse.data;
    tasks.value = tasksData.result;
    console.log(tasks.value);
    sortTasksByDate();

    // 公告欄 announcements
    if (data.result.announcements) {
      project.value.announcements = data.result.announcements.map(
        (announcement) => ({
          id: announcement._id,
          title: announcement.title,
          content: announcement.content,
        })
      );
    }
  } catch (error) {
    alert("載入錯誤");
  }
};
init();
</script>
