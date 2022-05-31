<template>
  <div class="goods_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--// 卡片区域-->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-input v-model.trim="goodsInfo.query" clearable placeholder="请输入内容"
                @clear="loadGoodsData">
        <el-button slot="append" icon="el-icon-search" @click="loadGoodsData"></el-button>
      </el-input>
      <!-- 添加商品 -->
      <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>

      <!-- 数据表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="700px"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="150px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="150px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">{{ scope.row.add_time | formatTimer }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" size="small" type="primary" @click="">编辑</el-button>
            <el-button icon="el-icon-delete" size="small" type="danger" @click="delGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页器-->
      <div class="block">
        <el-pagination
          :current-page="goodsInfo.pagenum"
          :page-size="goodsInfo.pagesize"
          :page-sizes="[3, 5, 7, 10]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
import { delGoodsAPI, goodsListAPI } from '@/api/goods'
import dayjs from 'dayjs'

export default {
  name: "GoodsList",
  data() {
    return {
      // 商品数据请求参数
      goodsInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1,
      },
      // 保存返回的商品数据列表
      goodsList: [],
      // 保存返回的商品总数
      total: 0,
    }
  },
  created() {
    // 调用商品列表
    this.loadGoodsData()
  },

  methods: {
    // 请求商品数据
    async loadGoodsData() {
      const {data: res} = await goodsListAPI(this.goodsInfo)
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取商品数据失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },

    // 处理显示条数的改变
    handleSizeChange(val) {
      this.goodsInfo.pagesize = val
      this.loadGoodsData()
    },
    // 控制当前页的变化
    handleCurrentChange(val) {
      this.goodsInfo.pagenum = val
      this.loadGoodsData()
    },

    // 删除商品信息
    delGoods(row) {
      this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: res} = await delGoodsAPI(row.goods_id)
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.error('删除商品失败')
        this.loadGoodsData()

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
    }
  },

  filters: {
    formatTimer(value) {
      return dayjs(value).format('2022-03-DD HH:mm:ss');
    }
  }
}
</script>

<style lang='less' scoped>

.el-card {
  margin-top: 15px;
}

.el-input {
  width: 33%;
  margin-right: 20px;
  margin-bottom: 15px;
}
</style>
