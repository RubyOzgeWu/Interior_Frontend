<template>
  <q-page class="flex flex-center">
    <div id="projects-wrapper">
      <h5>主要控制台</h5>
      <!-- filter -->
      <div class="filter">
        <q-btn color="grey-7" round flat icon="sort">
          排序方式
          <q-menu cover auto-close>
            <q-list>
              <q-item clickable @click="sortByDate">
                <q-item-section>依照日期排序</q-item-section>
              </q-item>
              <q-item clickable @click="sortByStatus">
                <q-item-section>依照狀態排序</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-input v-model="searchKeyword" dense clearable class="search">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- 提案階段 -->
      <div class="projects-container proposed">
        <div class="projects-show">
          <q-card class="show-card" flat>
            <q-card-section>
              <div class="info">
                <p>已提案</p>
                <div class="row">
                  <div class="projects-amount">{{ proposedProjectsAmount }}</div>
                  <div><span>已提案</span></div>
                </div>
              </div>
              <q-icon
                name="add"
                @click="openAddProjectDialog('提案階段')"
              ></q-icon>
            </q-card-section>
          </q-card>
        </div>

        <!-- 提案 projects -->
        <div class="projects">
          <q-card
            flat
            class="project-card"
            v-for="project in displayedProjects('提案階段')"
            :key="project._id"
            @click="selectProject(project)"
            @dblclick="goToProjectPage(project)"
          >
            <q-card-section class="row">
              <div class="col col-10">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-date">
                  {{ formatDate(project.date) }}
                </div>
                <div class="project-status">
                  <span :class="getStatusClass(project.status)">{{
                    project.status
                  }}</span>
                </div>
              </div>

              <div class="col col-2">
                <q-btn color="grey-7" round flat icon="more_horiz">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable @click="openEditDialog(project)">
                        <q-item-section>編輯</q-item-section>
                      </q-item>
                      <q-item clickable @click="confirmDelete(project)">
                        <q-item-section>刪除</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 設計階段 -->
      <div class="projects-container design">
        <div class="projects-show">
          <q-card class="show-card" flat>
            <q-card-section>
              <div class="info">
                <p>設計階段</p>
                <div class="row">
                  <div class="projects-amount">{{ designProjectsAmount }}</div>
                  <div><span>設計中</span></div>
                </div>
              </div>
              <q-icon
                name="add"
                @click="openAddProjectDialog('設計階段')"
              ></q-icon>
            </q-card-section>
          </q-card>
        </div>
        <!-- 設計 projects -->
        <div class="projects">
          <q-card
            flat
            class="project-card"
            v-for="project in displayedProjects('設計階段')"
            :key="project._id"
            @click="selectProject(project)"
            @dblclick="goToProjectPage(project)"
          >
            <q-card-section class="row">
              <div class="col col-10">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-date">
                  {{ formatDate(project.date) }}
                </div>
                <div class="project-status">
                  <span :class="getStatusClass(project.status)">{{
                    project.status
                  }}</span>
                </div>
              </div>

              <div class="col col-2">
                <q-btn color="grey-7" round flat icon="more_horiz">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable @click="openEditDialog(project)">
                        <q-item-section>編輯</q-item-section>
                      </q-item>
                      <q-item clickable @click="confirmDelete(project)">
                        <q-item-section>刪除</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 工程階段 -->
      <div class="projects-container construction">
        <div class="projects-show">
          <q-card class="show-card" flat>
            <q-card-section>
              <div class="info">
                <p>工程階段</p>
                <div class="row">
                  <div class="projects-amount">{{constructionProjectsAmount}}</div>
                  <div><span>工程中</span></div>
                </div>
              </div>
              <q-icon
                name="add"
                @click="openAddProjectDialog('工程階段')"
              ></q-icon>
            </q-card-section>
          </q-card>
        </div>
        <!-- 工程 projects -->
        <div class="projects">
          <q-card
            flat
            class="project-card"
            v-for="project in displayedProjects('工程階段')"
            :key="project._id"
            @click="selectProject(project)"
            @dblclick="goToProjectPage(project)"
          >
            <q-card-section class="row">
              <div class="col col-10">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-date">
                  {{ formatDate(project.date) }}
                </div>
                <div class="project-status">
                  <span :class="getStatusClass(project.status)">{{
                    project.status
                  }}</span>
                </div>
              </div>

              <div class="col col-2">
                <q-btn color="grey-7" round flat icon="more_horiz">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable @click="openEditDialog(project)">
                        <q-item-section>編輯</q-item-section>
                      </q-item>
                      <q-item clickable @click="confirmDelete(project)">
                        <q-item-section>刪除</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 完成度 Chart -->
      <div class="complete-container">
        <q-card class="complete-card" flat>
          <q-card-section>
            <h6>專案完成度</h6>
            <DoughnutChart :phase="selectedProjectPhase"></DoughnutChart>
            <div class="selectedProject">
              <div class="selectedProject-name">{{ selectedProject.name }}</div>
              <table class="selectedProject-table">
                <tr class="selectedProject-address">
                  <td>地址：</td>
                  <td>{{ selectedProject.address }}</td>
                </tr>
                <tr class="selectedProject-client">
                  <td>業主：</td>
                  <td>{{ selectedProject.client }}</td>
                </tr>
                <tr class="selectedProject-phone">
                  <td>聯絡電話：</td>
                  <td>{{ selectedProject.phone }}</td>
                </tr>
                <tr class="selectedProject-budget">
                  <td>預算：</td>
                  <td>{{ selectedProject.budget }}</td>
                </tr>
              </table>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 新增專案視窗 -->
    <q-dialog v-model="isDialogOpen" persistent>
      <q-card class="add-form">
        <q-card-section>
          <div class="text-h4" style="font-weight: 700; color: #2466e2">
            {{ isEditing ? "編輯專案" : "新增專案" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="projectForm.name" label="專案名稱" />
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
          />
          <q-select
            v-model="projectForm.phase"
            label="專案階段"
            :options="phaseOptions"
          />
          <q-select
            v-model="projectForm.owner"
            label="專案主管"
            :options="ownerOptions"
          />
          <q-input v-model="projectForm.client" label="業主姓名" />
          <q-input v-model="projectForm.phone" label="業主電話" />
          <q-input v-model="projectForm.address" label="專案地址" />
          <q-input v-model="projectForm.budget" label="專案預算" />
          <q-input
            v-model="projectForm.remark"
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
            @click="isEditing ? saveProject() : addProject()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { apiAuth, api } from "../boot/axios.js";
import DoughnutChart from "src/components/DoughnutChart.vue";
import { useRouter } from "vue-router";

/* 專案資料 */
const projects = ref([]);
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

/* 新增、編輯、刪除專案 */
const isDialogOpen = ref(false);
const isEditing = ref(false);
const openAddProjectDialog = (phase) => {
  isEditing.value = false;
  resetProjectForm();
  projectForm.phase = phase;
  isDialogOpen.value = true;
};
const openEditDialog = (project) => {
  isEditing.value = true;
  updateProjectForm(project);
  isDialogOpen.value = true;
};
const addProject = async () => {
  try {
    await apiAuth.post("/projects", projectForm);
    alert("新增成功");
    await init();
    isDialogOpen.value = false;
  } catch {
    alert("新增失敗");
  }
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
    isDialogOpen.value = false;
    await init();
  } catch {
    alert("儲存失敗");
  }
};
const confirmDelete = (project) => {
  const isConfirmed = confirm(`確定要刪除專案 "${project.name}" ？`);
  if (isConfirmed) {
    deleteProject(project._id);
  }
};
const deleteProject = async (projectId) => {
  try {
    await apiAuth.delete(`/projects/${projectId}`);
    alert("刪除成功");
    await init(); // Refresh the projects list after deleting the project
  } catch (error) {
    console.log(error);
    alert("刪除失敗");
  }
};

/* 顯示專案 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString(); // 格式化日期
};
const getStatusClass = (status) => {
  return {
    "status-preparing": status === "準備中",
    "status-in-progress": status === "進行中",
    "status-done": status === "已完成",
    "status-expired": status === "已逾期",
  };
};
/* 選擇專案 */
const selectedProjectPhase = ref("");
const selectedProject = ref([]);
const projectsInProposal = computed(() => {
  return projects.value.filter((project) => project.phase === "提案階段");
});
const projectsInDesign = computed(() => {
  return projects.value.filter((project) => project.phase === "設計階段");
});
const projectsInConstruction = computed(() => {
  return projects.value.filter((project) => project.phase === "工程階段");
});
const selectProject = (project) => {
  selectedProjectPhase.value = project.phase;
  selectedProject.value = project;
};
const resetProjectForm = () => {
  projectForm.name = "";
  projectForm.date = "2024/02/01";
  projectForm.status = "準備中";
  projectForm.phase = "";
  projectForm.owner = "";
  projectForm.client = "";
  projectForm.phone = "";
  projectForm.address = "";
  projectForm.budget = "";
  projectForm.remark = "";
};

/* filter */
const sortBy = ref("");
const searchKeyword = ref("");
const sortByDate = () => {
  sortBy.value = "date";
};
const sortByStatus = () => {
  sortBy.value = "status";
};
const getStatusPriority = (status) => {
  const priorities = {
    已逾期: 1,
    進行中: 2,
    準備中: 3,
    已完成: 4,
  };
  return priorities[status] || 99;
};

const displayedProjects = (phase) => {
  let sortedProjects;

  switch (phase) {
    case "提案階段":
      sortedProjects = projectsInProposal.value.slice();
      break;
    case "設計階段":
      sortedProjects = projectsInDesign.value.slice();
      break;
    case "工程階段":
      sortedProjects = projectsInConstruction.value.slice();
      break;
    default:
      sortedProjects = [];
  }

  if (sortBy.value === "date") {
    sortedProjects.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy.value === "status") {
    sortedProjects.sort(
      (a, b) => getStatusPriority(a.status) - getStatusPriority(b.status)
    );
  }
  if (searchKeyword.value) {
    sortedProjects = sortedProjects.filter((project) =>
      project.name.includes(searchKeyword.value)
    );
  }

  return sortedProjects;
};
/* 進入 projectControl 頁面 */
const router = useRouter();
const goToProjectPage = (project) => {
  router.push(`/ProjectControl/project/${project._id}`);
};

/* 計算案件數量 */
const proposedProjectsAmount = computed(() => {
  return countProjectsByPhase("提案階段");
});

const designProjectsAmount = computed(() => {
  return countProjectsByPhase("設計階段");
});

const constructionProjectsAmount = computed(() => {
  return countProjectsByPhase("工程階段");
});

const countProjectsByPhase = (phase) => {
  return projects.value.filter((project) => project.phase === phase).length;
};

const init = async () => {
  try {
    const [usersResponse, projectsResponse] = await Promise.all([
      apiAuth.get("/users/all"),
      api.get("/projects/all"),
    ]);

    // 取得 users
    const usersData = usersResponse.data;
    const getOwnerOptions = usersData.result.map((user) => ({
      label: user.account,
      value: user._id,
    }));
    ownerOptions.value = getOwnerOptions;

    // 取得 projects
    const projectsData = projectsResponse.data;
    projects.value = projectsData.result;
  } catch (error) {
    alert("error");
  }
};
init();
</script>
