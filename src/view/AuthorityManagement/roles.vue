<template>
  <div class="roles_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addRolesVisible=true">添加角色</el-button>

      <!--  添加角色 点击显示添加角色框-->
      <el-dialog
        :visible.sync="addRolesVisible"
        title="添加角色输入框"
        width="50%"
        @close="closeDialog"
      >

        <!--添加用户表单-->
        <el-form ref="addRolesRef" :model="addRolesForm" :rules="rules" label-width="70px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model.trim="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model.trim="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
      </el-dialog>

      <!-- 表格内容区域 -->
      <el-table
        :data="rolesList"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
                    :class="['bbottom',i1===0?'btop':'','tac']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag class="el_tag" closable @close="delTag(scope.row,item1.id)">{{
                    item1.authName
                  }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id"
                        :class="[i2===0?'':'btop','tac']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag closable type="success" @close="delTag(scope.row,item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" closable
                            type="warning" @close="delTag(scope.row,item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="queryRoles(scope.row.id)">编辑
            </el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="delRole(scope.row.id)">删除
            </el-button>
            <el-button icon="el-icon-setting" size="mini" type="warning" @click="setRights(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑角色对话框-->
    <el-dialog
      :visible.sync="editRolesVisible"
      title="修改用户信息"
      width="50%"
    >
      <!--修改用户表单-->
      <el-form ref="editUserRef" :model="queryRolesInfo" :rules="editRolesRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model.trim="queryRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model.trim="queryRolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoles(queryRolesInfo.roleId)">确 定</el-button>
  </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      :visible.sync="assignVisible"
      title="分配权限"
      width="50%"
      @close="closeRightsDialog"
    >
      <el-tree
        ref="rightRef"
        :data="rightsList"
        :default-checked-keys="defkeys"
        :default-expanded-keys="[2, 3]"
        :props="treeProps"
        node-key="id"
        show-checkbox>
      </el-tree>

      <span slot="footer" class="dialog-footer">
    <el-button @click="assignVisible = false">取 消</el-button>
    <el-button type="primary" @click="roleRight">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRolesAPI,
  delRoleAPI,
  delRolesAPI,
  editRolesAPI,
  queryRoleAPI,
  roleRightAPI,
  rolesAPI,
  setRightsAPI
} from '@/api/ahthorityManagment'

export default {
  name: 'roles',
  data() {
    return {
      // 接收角色数据
      rolesList: [],

      // 根据ID获取的角色对象信息
      queryRolesInfo: {},

      // 添加角色输入框默认隐藏
      addRolesVisible: false,

      // 编辑角色对话框默认false
      editRolesVisible: false,

      // 分配权限对话框 默认false
      assignVisible: false,

      //defkeys是默认的选中对应的ID值
      defkeys: [],

      // 点击分配权限，保存对应的角色对象
      roleInfo: '',

      // 接受所有的权限数据
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },

      // 添加角色信息
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },

      // 表单检验
      rules: {
        roleName: [
          {required: true, message: '请输入角色名信息', trigger: 'blur'},
        ]
      },
      // 校验编辑表单
      editRolesRules: {
        roleName: [
          {required: true, message: '内容不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    // 获取角色列表
    async loadRoles() {
      const {data: res} = await rolesAPI()
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      // this.$message.success(res.meta.msg)
      this.rolesList = res.data
    },

    // 添加角色信息
    async addRoles() {
      try {
        const {data: res} = await addRolesAPI(this.addRolesForm)
        // console.log(res)
        if(res.meta.status !== 201) return this.$message.error('添加失败')
        // 关闭信息框
        this.addRolesVisible = false
        // 重新渲染信息
        this.loadRoles()
        // 提示添加成功
        this.$message.success(res.meta.msg)
      } catch(error) {
        console.log(error.message)
      }
    },
    // 关闭添加角色框，清空输入框内容
    closeDialog() {
      this.$refs.addRolesRef.resetFields()
    },

    // 删除角色
    async delRole(val) {
      const {data: res} = await delRoleAPI(val)
      // console.log(res)
      this.loadRoles()
    },

    // 查询角色信息
    async queryRoles(val) {
      this.editRolesVisible = true
      const {data: res} = await queryRoleAPI(val)
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取角色信息失败')
      // 将根据ID获取的数据保存到data中
      this.queryRolesInfo = res.data
    },

    // 提交修改的角色信息
    async editRoles(val) {
      try {
        const {data: res} = await editRolesAPI(val, {
          roleName: this.queryRolesInfo.roleName,
          roleDesc: this.queryRolesInfo.roleDesc
        })
        if(res.meta.status !== 200) return this.$message.error('修改角色信息失败')
        this.$message.success('修改成功')
        // 关闭信息框
        this.editRolesVisible = false
        // 重新渲染数据
        this.loadRoles()
      } catch(err) {
        this.$message.error(err.message)
      }
      // console.log(res)
    },

    // 删除某个指定标签
    delTag(roles, rightId) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除操作
        const {data: res} = await delRolesAPI(roles, rightId)
        if(res.meta.status !== 200) return this.$message.error('删除权限失败')
        this.$message.success('删除权限成功')
        roles.children = res.data

        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 添加用户权限
    async setRights(roles) {
      // 将相应的角色信息保存到roleRight中
      this.roleInfo = roles
      const {data: res} = await setRightsAPI()
      // console.log(res)
      this.rightsList = res.data

      this.getLeafKeys(roles, this.defkeys)

      this.assignVisible = true
    },

    // 通过递归，获取权限保存到defkeys中
    getLeafKeys(node, arr) {
      // 判断node节点下是否包含children属性，不包含就是三级权限
      if(!node.children) {
        return arr.push(node.id)
      }
      // 如果node下面存在children属性，继续调用
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },

    // 关闭分配权限对话框，清空defkeys
    closeRightsDialog() {
      this.defkeys.splice(0)
    },

    // 为角色分配权限
    async roleRight() {
      let arr = [
        ...this.$refs.rightRef.getCheckedKeys(),
        ...this.$refs.rightRef.getHalfCheckedKeys()
      ]
      // console.log(arr)
      let strId = arr.join(',')
      const {data: res} = await roleRightAPI(this.roleInfo.id, {rids: strId})
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('添加权限失败')
      this.$message.success('添加角色权限成功')
      this.loadRoles()
      this.assignVisible = false

    }
  }
}
</script>

<style lang='less' scoped>
.roles_container {
  .el-card {
    margin-top: 15px;

    .el-table {
      margin-top: 15px;
    }

    .el_tag {
      margin: 10px 10px 10px 60px !important;
    }

    .el-tag {
      margin: 10px 10px 10px 0;
    }
  }
}

.btop {
  border-top: 1px solid #ccc;
}

.bbottom {
  border-bottom: 1px solid #ccc;
}

.tac {
  display: flex;
  align-items: center;

}
</style>
