<script setup>
import { ref } from "vue";
import routes from "@/router/router.js";
import { Location } from "@element-plus/icons-vue";

const isCollapse = ref(false);
const onExpand = () => {
  isCollapse.value = !isCollapse.value;
  if (isCollapse.value) {
    setTimeout(() => {
      window.globalMap.updateSize();
    }, 500);
  }
};
const hash = location.hash?.slice(1);
</script>
<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    text-color="#fff"
    :collapse="isCollapse"
    :default-openeds="[1]"
    :default-active="hash"
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
          >{{ item.name }}</el-menu-item
        >
      </el-menu-item-group>
    </el-sub-menu>
    <el-icon class="expand-icon" :size="20" color="#fff" @click="onExpand">
      <Expand v-if="isCollapse" />
      <Fold v-else />
    </el-icon>
  </el-menu>
</template>
<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 100vh;
  position: relative;
  padding-bottom: 30px;
  width: 200px;
}
.el-menu--collapse {
  min-height: 100vh;
}
.expand-icon {
  display: block;
  width: 100%;
  text-align: center;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
}
</style>
