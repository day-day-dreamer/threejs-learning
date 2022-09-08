<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import routes from "@/router/router.js";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";

const router = useRouter();
const isCollapse = ref(false);
// import menuConfig from '@/common/menuConfig.js'

// const onSetRegion = () => {
//   router.push("/setRegion")
// }
// const linkTo = (path) => {
//   router.push(path)
// }
</script>
<template>
  <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :label="false">expand</el-radio-button>
    <el-radio-button :label="true">collapse</el-radio-button>
  </el-radio-group> -->
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    text-color="#fff"
    :collapse="isCollapse"
    default-openeds="[1]"
    @open="handleOpen"
    @close="handleClose"
    router="true"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>基础功能</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="item in routes"
          :key="item.path"
          :index="item.path"
          >{{item.name}}</el-menu-item
        >
      </el-menu-item-group>
      <!-- <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu> -->
    </el-sub-menu>
    <!-- <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item> -->
  </el-menu>
</template>
<style scoped lang="less">
/* .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
} */
.el-menu-vertical-demo {
  min-height: 100vh;
}
</style>
