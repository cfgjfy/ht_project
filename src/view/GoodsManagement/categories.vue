<template>
  <div class="cate_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片容器-->
    <el-card>
      <el-button style="margin-bottom: 15px" type="primary" @click="addCate">添加分类</el-button>

      <!-- 表格区域 -->
      <tree-table :columns="columns" :data="cateList" :expand-type="false" :selection-type="false"
                  border index-text="#" show-index>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted===false" class="el-icon-circle-check"
             style="font-size: 16px; color: mediumspringgreen"></i>
          <i v-else class="el-icon-circle-close" style="font-size: 16px; color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button icon="el-icon-edit" size="small" type="primary" @click="showEditCateDialog(scope.row.cat_id)">编辑
          </el-button>
          <el-button icon="el-icon-delete" size="small" type="danger" @click="delCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          :current-page="pagenum"
          :page-size="pagesize"
          :page-sizes="[3,5,7,10]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      :visible.sync="cateDialogVisible"
      title="添加分类"
      width="50%"
      @close="addCateDialog"
    >
      <el-form ref="addCateRef" :model="addCateForm" :rules="addCateRules" class="demo-ruleForm" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectKetsId"
            :options="parentCateList"
            :props="cascaderProps"
            change-on-select
            clearable
            @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addShopCate">确 定</el-button>
  </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog :visible.sync="editCateDialogVisible" title="编辑分类" width="50%">
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addCate, addCateAPI, categoriesAPI, delCateAPI, editCateAPI, queryCateId } from '@/api/goods'

export default {
  name: "categories",
  data() {
    return {
      // 商品列表数据
      cateList: [],
      // 显示商品数据的页码
      pagenum: 1,
      // 每页显示的数据
      pagesize: 5,
      // 请求的数据条数
      total: 0,
      // 表格各列数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      // 添加分类对话框,默认false不显示
      cateDialogVisible: false,
      // 添加分类的表单对象
      addCateForm: {
        // 添加分类名称
        cate_name: '',
        // 父类Id
        cat_pid: 0,
        // 父类层级
        cat_level: 0
      },
      // 添加分类的表单验证
      addCateRules: {
        cat_name: [{required: true, message: '不能为空', trigger: 'blur'}]
      },

      // 父级分类列表
      parentCateList: [],
      // 级联选择器的配置项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中项的ID保存到数组中
      selectKetsId: [],

      // 编辑对话框 控制
      editCateDialogVisible: false,
      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      // 编辑表单 绑定对象
      editCateForm: {}
    }
  },
  created() {
    // 调用商品列表数据
    this.loadCateList()
  },

  methods: {
    // 调用商品列表数据
    async loadCateList() {
      const {data: res} = await categoriesAPI({pagenum: this.pagenum, pagesize: this.pagesize})
      // console.log(res.data)
      if(res.meta.status !== 200) return this.$message.error('获取商品列表数据失败')
      this.total = res.data.total
      this.cateList = res.data.result
    },
    // 分页事件
    handleSizeChange(val) {
      // console.log(val)
      this.pagesize = val
      this.loadCateList()
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.pagenum = val
      this.loadCateList()
    },

    // 添加商品分类
    async addCate() {
      this.cateDialogVisible = true

      const {data: res} = await addCateAPI({type: 2})
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.parentCateList = res.data
    },
    parentCateChange(value) {
      console.log(value);
      if(this.selectKetsId.length > 0) {
        this.addCateForm.cat_pid = this.selectKetsId[this.selectKetsId.length - 1]
        this.addCateForm.cat_level = this.selectKetsId.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 关闭添加分类对话框，清空内容
    addCateDialog() {
      this.$refs.addCateRef.resetFields()
      this.selectKetsId = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },

    // 添加商品分类
    async addShopCate() {
      const {data: res} = await addCate(this.addCateForm)
      console.log(res)
      if(res.meta.status !== 201) return this.$message.error('添加分类失败')
      this.cateDialogVisible = false
      this.loadCateList()
    },

    // 删除分类
    // todo 这里二级三级分类删除没做
    delCate(val) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        // 发请求
        const {data: res} = await delCateAPI(val)
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success(res.meta.msg)
        this.loadCateList()

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

    // 显示编辑对话框
    async showEditCateDialog(val) {
      this.editCateDialogVisible = true
      const {data: res} = await queryCateId(val)
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.editCateForm = res.data
    },

    // 编辑分类并提交分类
    async editCate() {
      const {data: res} = await editCateAPI(this.editCateForm.cat_id, {cat_name: this.editCateForm.cat_name})
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('更新分类名失败！')
      this.$message.success('更新分类名成功！')
      this.loadCateList()
      this.editCateDialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.cate_container {
  .el-card {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;

    .el-cascader-menu__wrap {
      height: 350px !important;
    }
  }

}
</style>
