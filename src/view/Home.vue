<template>
  <el-container class="home-container">
    <el-header class="header">
      <div class="left_logo">
        <div class="pic">
          <img alt="" src="@/assets/vue-color-avatar.png">
        </div>
        <span style="color:#25d9d8">后台管理系统</span>
        <!-- /.pic -->
      </div>
      <!-- /.left -->
      <el-button @click="logout" type="primary">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isShow?'64px': '200px'">
        <div class="toggle" @click="isShow=!isShow">
          <i style="font-size: 35px;margin-top: 10px;color:#ccc" class="el-icon-s-operation"></i>
        </div>
        <!-- /.toggle -->
        <!--  -- unique-opened 一次只能打开一个子菜单-->
        <el-menu :collapse="isShow" :collapse-transition="false" :default-active="active" active-text-color="#25d9d8" background-color="#373d41" router text-color="#fff" unique-opened>
          <!-- 一级菜单 -->
          <el-submenu v-for="item of menusList" :key="item.id" :index="item.id+''">
            <template slot="title">
              <!--  一级图标-->
              <i :class="iconObj[item.id]" class="iconfont"></i>
              <!-- 一级文本-->
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="items of item.children" :key="items.id" :index="'/'+items.path" @click="savePath('/'+items.path)">
                <template slot="title">
                  <!--  二级图标-->
                  <i class="el-icon-menu"></i>
                  <!-- 二级文本-->
                  <span>{{ items.authName }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 一级占位符-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { menusAPI } from '@/api/login'

export default {
  name: 'home',
  data() {
    return {
      active: "",
      menusList: [],
      iconObj: {
        "125": 'iconfont icon-user',
        "103": 'iconfont icon-tijikongjian',
        "101": 'iconfont icon-shangpin',
        "102": 'iconfont icon-danju',
        "145": 'iconfont icon-baobiao'
      },
      isShow: false
    }
  },
  created() {
    this.loadMenus()
    // 网页刷新就直接获取高亮效果
    this.active = window.sessionStorage.getItem('ht_path')
  },
  methods: {
    async loadMenus() {
      try {
        const { data: res } = await menusAPI()
        // console.log(res.data)
        this.menusList = res.data
      } catch (err) {
        this.$message.error(err.message)
      }
    },

    // 退出功能
    async logout() {
      try {
        await this.$confirm('确定退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$store.dispatch('logout')
        this.$message.success('退出成功')
        this.$router.push('/login')
      } catch (err) {
        this.$message('已取消')
      }
    },

    // 保存当前路径，让对应的导航高亮
    savePath(val) {
      // 存入sessionStore中方便加载页面直接调用
      window.sessionStorage.setItem('ht_path', val)

    }

  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.header {
  background-color: #373d41;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;

  .left_logo {
    float: left;
    width: 291px;
    height: 56px;
    display: flex;
    justify-content: start;

    .pic {
      margin: 2px 10px 0 0;
      width: 61px;
      height: 56px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    span {
      font-size: 22px;
      color: #fff;
    }
  }

  .el-button {
    float: right;
    margin-top: 10px;
  }
}

.el-aside {
  background-color: #373d41;
}

.el-menu {
  border-right: 0;
}

.toggle {
  height: 40px;
  line-height: 40px;
  background-color: #373d41;
  text-align: center;
  letter-spacing: 0.2em;
  color: tomato;
  cursor: pointer;
}
</style>
