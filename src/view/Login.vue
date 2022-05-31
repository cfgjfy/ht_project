<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img alt="" src="@/assets/vue-color-avatar.png" />
      </div>

      <!-- 表单区域 -->
      <el-form ref="loginForm" :model="ruleForm" :rules="rules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model.trim="ruleForm.username" :rules="rules" prefix-icon="iconfont icon-users"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model.trim="ruleForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="primary" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456',
      },

      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度必须为 2 到 6 位', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度必须在 6 到 16位', trigger: 'blur' },
        ],
      },
    }
  },

  methods: {
    // 提交表单信息
    async submitForm() {
      try {
        await this.$refs.loginForm.validate()
        await this.$store.dispatch('login', this.ruleForm)
        this.$router.push('/')
        this.$message.success('登录成功')
      } catch (error) {
        this.$message.error('登录失败')
      }
    },
    // 重置功能点击按钮清空表单信息
    resetForm() {
      // console.log(this.$refs)
      this.$refs.loginForm.resetFields()
    },
  },
}
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: skyblue;
}

.login_box {
  position: absolute;
  width: 450px;
  height: 304px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  .avatar_box {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    width: 130px;
    height: 130px;
    background-color: #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    padding: 0 20px;
    width: 100%;
    // 默认是box-sizing: content-box;
    box-sizing: border-box;
  }

  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
