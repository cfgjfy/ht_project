<template>
  <div class="rights_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 表格内容区域 -->
      <el-table
        :data="rightsList"
        border
        stripe
        style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { rightsAPI } from '@/api/ahthorityManagment'

export default {
  name: "rights",
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    // 请求权限数据
    this.loadRights()
  },
  methods: {
    async loadRights() {
      const {data: res} = await rightsAPI()
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('数据获取失败')
      this.$message.success(res.meta.msg)
      this.rightsList = res.data

    }
  }
}
</script>

<style lang='less' scoped>

.rights_container {
  .el-card {
    margin-top: 15px;

    .el-table {
      margin-top: 15px;
    }
  }
}

</style>
