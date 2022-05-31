<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片容器-->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-input v-model.trim="query" class="input-with-select ipt" clearable placeholder="请输入内容"
                @clear="loadUser">
        <el-button slot="append" icon="el-icon-search" @click="loadUser"></el-button>
      </el-input>
      <el-button type="primary" @click="addUserVisible=true">添加用户</el-button>
      <!--  添加用户 点击显示用户按钮-->
      <el-dialog
        :visible.sync="addUserVisible"
        title="添加用户信息"
        width="50%"
        @close="closeDialog"
      >

        <!--添加用户表单-->
        <el-form ref="addUserRef" :model="addUserForm" :rules="addUserRules" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model.trim="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="addUserForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model.trim.number="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
      </el-dialog>
      <!-- 表格内容区域 -->
      <el-table
        :data="userList"
        border
        stripe
        style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary"
                       @click="queryIdUser(scope.row.id)"></el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger"
                       @click="delUser(scope.row.id)"></el-button>
            <el-tooltip :enterable="false" content="分配角色" effect="dark" placement="top">
              <el-button icon="el-icon-setting" size="mini" type="warning"
                         @click="setRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改用户信息 -->
      <el-dialog
        :visible.sync="editUserVisible"
        title="修改用户信息"
        width="50%"
        @close="editUserDialog"
      >
        <!--修改用户表单-->
        <el-form ref="editUserRef" :model="editForm" :rules="editUserRules" label-width="80px">
          <el-form-item label="用户名称">
            <el-input v-model.trim="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model.trim.number="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser(editForm.id)">确 定</el-button>
  </span>
      </el-dialog>

      <!-- 用户分配角色 -->
      <el-dialog
        :visible.sync="assignRolesVisible"
        title="分配角色"
        width="50%"
        @close="closeSetRoleInfo">
        <p>当前用户：{{ userInfo.username }}</p>
        <br>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <br>
        <el-form ref="assignFormRes" :model="assignForm" label-width="90px">
          <el-form-item label="分配新角色">:
            <!--                        v-model 的值就是被选中的el-option的value的值-->
            <el-select v-model="selectId" placeholder="请选择">
              <el-option v-for="item in roleInfoList" :key="item.id" :label="item.roleName"
                         :value="item.id"></el-option>

            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="assignRolesVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveSetRoles">确 定</el-button>
  </span>
      </el-dialog>

      <!-- 分页器 -->
      <div class="block">
        <!-- 只有一页的时候隐藏 hide-on-single-page-->
        <el-pagination
          :current-page="pagenum"
          :page-size="pagesize"
          :page-sizes="[3,5,7,10]"
          :total="total"
          hide-on-single-page
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addUserAPI, assignRolesAPI, delUserAPI, editUserAPI, queryIdAPI, stateAPI, userAPI } from '@/api/user'
import { rolesAPI } from '@/api/ahthorityManagment'

export default {
  name: "userList",
  data() {
    // 自定义校验规则
    const checkMobile = (mobile, value, callback) => {
      if(!value) {
        return callback(new Error('手机号不能为空'));
      }
      setTimeout(() => {
        value = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)
        if(!value) {
          callback(new Error('手机格式错误'));
        } else {
          callback();
        }
      });
    };
    return {
      query: "",
      pagenum: 1,
      pagesize: 5,
      // 请求到的数据
      userList: [],
      total: 0,
      // 控制添加用户框是否显示，默认隐藏
      addUserVisible: false,
      // 控制用户信息更新框显示，默认不显示
      editUserVisible: false,
      // 分配角色显示框，默认隐藏
      assignRolesVisible: false,
      // 查询到的 用户对象
      editForm: {},
      // 查询到的角色列表
      assignForm: {},
      // 保存角色列表的数据
      roleInfoList: [],

      // 保存需要分配角色的用户信息
      userInfo: {},

      //  选中的角色id
      selectId: '',
      // 添加用户表单信息
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证
      addUserRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度不能少于3位', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '长度不能少于6位', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        mobile: [
          {validator: checkMobile, required: true, trigger: 'blur'}
        ],
      },

      // 修改用户信息表单验证
      editUserRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        mobile: [
          {validator: checkMobile, required: true, trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    // 请求用户数据
    this.loadUser()
  },
  methods: {
    async loadUser() {
      try {
        const {data: res} = await userAPI({query: this.query, pagenum: this.pagenum, pagesize: this.pagesize})
        // console.log('user', res.data)
        this.userList = res.data.users
        this.total = res.data.total
        // console.log('total', res.data.total)
      } catch(err) {
        this.$message.error(err.message)
      }
    },
    // 监听当前的 显示条数
    handleSizeChange(val) {
      this.pagesize = val
      this.loadUser()
    },
    // 监听页码的改变
    handleCurrentChange(val) {
      this.pagenum = val
      this.loadUser()
    },
    // 监听状态的修改
    async stateChange(val) {
      const {data: res} = await stateAPI(val)
      // console.log(res)
      if(res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('状态更新失败')
      }
      this.$message.success(res.meta.msg)
    },

    // 关闭表单就清空表单内容
    closeDialog() {
      this.$refs.addUserRef.resetFields()
    },
    // 关闭修改用户表单后清空内容
    editUserDialog() {
      this.$refs.editUserRef.resetFields()
    },
    // 添加用户
    async addUser() {
      // 发起添加请求
      const {data: res} = await addUserAPI(this.addUserForm)
      // console.log(res)
      if(res.meta.status !== 201) return this.$message.error('创建用户失败')
      this.$message.success(res.meta.msg)
      this.addUserVisible = false
      this.loadUser()
    },

    // 删除用户
    delUser(val) {
      this.$confirm('此操作将永久删除该数据, 是否继续', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: res} = await delUserAPI(val)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success(res.meta.msg)
        this.loadUser()
        this.$message({
          type: 'success',
          message: '已删除!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 根据用户ID查询用户信息
    async queryIdUser(val) {
      this.editUserVisible = true
      const {data: res} = await queryIdAPI(val)
      // console.log('查询',res)
      this.editForm = res.data
    },

    // 修改用户信息
    async editUser(val) {
      const {data: res} = await editUserAPI(val, {email: this.editForm.email, mobile: this.editForm.mobile})
      if(res.meta.status !== 200) return this.$message.error('更新失败')
      // 提示修改成功
      this.$message.success(res.meta.msg)
      // 关闭修改框
      this.editUserVisible = false
      // 重新渲染数据
      this.loadUser()
    },

    // 分配角色
    async setRoles(userInfo) {
      this.assignRolesVisible = true
      this.userInfo = userInfo
      const {data: res} = await rolesAPI()
      if(res.meta.status !== 200) return this.$message.error('角色列表获取失败')
      // console.log(res.data)
      this.roleInfoList = res.data
    },

    // 提交修改的角色信息
    async saveSetRoles() {
      if(!this.selectId) return this.$message.error('请选择一个角色')
      const {data: res} = await assignRolesAPI(this.userInfo.id, {rid: this.selectId})
      // console.log(res)
      // 关闭提示框
      this.assignRolesVisible = false
      this.loadUser()
    },

    // 关闭分配权限提示框，清空内容
    closeSetRoleInfo() {
      this.selectId = ''
      // this.userInfo = ''
    }
  }
}
</script>

<style lang='less' scoped>
.el-card {
  margin-top: 15px;

  .ipt {
    width: 33%;
    margin-right: 20px;
    margin-bottom: 15px;
  }

  .el-table {
    font-size: 12px;
  }

  .block {
    margin-top: 14px;
  }
}
</style>
