<template>
  <div class="addGoods_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <el-alert center show-icon title="添加商品信息" type="info"></el-alert>

      <!--// 进度条-->
      <el-steps :active="active-0" :space="350" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <!--// 左侧信息-->
      <el-form ref="addGoodsRef" :model="addGoodsFrom" :rules="addGoodsRules" label-position="top" label-width="80px">
        <el-tabs v-model="active" :before-leave="beforeLeave" tab-position="left" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model.trim="addGoodsFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsFrom.goods_cat"
                :options="cateList"
                :props="addGoodsProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="items in item.attr_vals" :label="items" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="actionURL"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodsFrom.goods_introduce">
            </quill-editor>
            <el-button class="addBtn" type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览框-->
    <el-dialog
      :visible.sync="previewDialogVisible"
      title="图片预览"
      width="50%">
      <img :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { addGoodsAPI, categoriesAPI, paramsListAPI } from '@/api/goods'
import _ from 'lodash'

export default {
  name: "AddGoods",
  data() {
    return {
      // 当前的活动标签
      active: '0',
      // 表单数据
      addGoodsFrom: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },

      // 校验规则
      addGoodsRules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '请选择商品分类', trigger: 'blur'}
        ],
      },
      // 接收分类数据
      cateList: [],
      addGoodsProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },

      // 动态参数
      manyData: [],
      // 静态参数
      onlyData: [],

      // 图片上传地址
      actionURL: 'http://liufusong.top:8899/api/private/v1/upload',
      // 上传图片的请求头信息对象
      headersObj: {
        Authorization: window.localStorage.getItem('shop_ht')
      },

      previewPath: '',
      previewDialogVisible: false
    }
  },

  created() {
    this.loadCateList()
  },
  methods: {
    async loadCateList() {
      const {data: res} = await categoriesAPI()
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.cateList = res.data
    },

    handleChange() {
      if(this.addGoodsFrom.goods_cat.length !== 3) {
        this.addGoodsFrom.goods_cat = []
      }
    },

    // 在切换tag前判断是否选择三级分类
    beforeLeave() {
      if(this.addGoodsFrom.goods_cat.length !== 3 && this.active === '0') {
        this.$message.error('请选择商品分类')
        return false
      }
    },

    async tabClick() {
      if(this.active === '1') {
        const {data: res} = await paramsListAPI(this.cateID, {sel: 'many'})
        if(res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        res.data.forEach(item => item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [])
        // console.log(res)
        this.manyData = res.data
      } else if(this.active === '2') {
        const {data: res} = await paramsListAPI(this.cateID, {sel: 'only'})
        if(res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        // console.log(res)
        this.onlyData = res.data
      }
    },
    // 预览图处理
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 删除图片处理
    handleRemove(file) {
      // 获取要删除的图片路径
      const filePath = file.response.data.tmp_path
      // 通过路径得到索引值
      let index = this.addGoodsFrom.pics.findIndex(item => item.pic === filePath)
      // 通过index删除pics中的图片
      this.addGoodsFrom.pics.splice(index, 1)
    },
    // 处理图片保存
    handleSuccess(response) {
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addGoodsFrom.pics.push(picInfo)
      // console.log(this.addGoodsFrom)
    },

    // 添加商品
    addGoods() {
      this.$refs.addGoodsRef.validate(async valid => {
        if(!valid) return this.$message.error('商品信息填写不完整')

        // 因为前面的级联选择框要绑定的是数据，添加的时候要将goods_cat转成以逗号分隔的字符串，所以使用lodash将表单信息深拷贝一份
        const addFrom = _.cloneDeep(this.addGoodsFrom)
        addFrom.goods_cat = addFrom.goods_cat.join(',')

        // 处理动态参数
        this.manyData.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(',')}
          this.addGoodsFrom.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyData.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
          this.addGoodsFrom.attrs.push(newInfo)
        })

        addFrom.attrs = this.addGoodsFrom.attrs
        console.log(addFrom)

        const {data: res} = await addGoodsAPI(addFrom)
        // console.log(res)
        if(res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 计算出分类id
    cateID() {
      if(this.addGoodsFrom.goods_cat.length === 3) return this.addGoodsFrom.goods_cat[2]
      return null
    }
  }
}
</script>

<style lang='less' scoped>
.el-card {
  margin-top: 15px;

}

.el-alert {
  margin-bottom: 15px;
}

.el-tabs {
  margin-top: 13px;
  color: #999;
}

.el-checkbox {
  margin-right: 5px !important;
}

.el-upload__tip {
  font-size: 13px;
}

.addBtn {
  margin-top: 15px;
}
</style>
