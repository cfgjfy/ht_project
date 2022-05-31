<template>
  <div class="params_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域 -->
    <el-card>
      <el-alert
        class="el-icon-warning"
        title="注意：只允许为第三级参数设置相关参数"
        type="warning">
      </el-alert>

      <!-- 选择商品分类表单-->
      <el-form ref="goodsCateRef">
        <el-form-item label="选择商品分类:">
          <div class="block">
            <el-cascader
              v-model="selectId"
              :options="CateList"
              :props="cascaderProps"
              @change="handleChange"></el-cascader>
          </div>
        </el-form-item>
      </el-form>

      <!-- 动态、静态选项卡-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="disabled" size="small" type="primary" @click="adddialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格显示区域-->
          <el-table :data="manyParams" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="item.id" closable @close="delTag(i,scope.row)">
                  {{ item }}
                </el-tag>
                <!--// 添加新的tag-->
                <el-input
                  v-if="scope.row.inputVisible"
                  ref="saveTagInput"
                  v-model="scope.row.inputValue"
                  class="input-new-tag"
                  size="small"
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>


              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="分类名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button icon="el-icon-edit" size="small" type="primary" @click="editParams(scope.row.attr_id)">编辑
                </el-button>
                <el-button icon="el-icon-delete" size="small" type="danger" @click="delParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="disabled" size="small" type="primary" @click="adddialogVisible=true">添加属性</el-button>
          <!-- 静态属性表格显示区域-->
          <el-table :data="onlyParams" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="item in scope.row.attr_vals" :key="item.id" closable>{{ item }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button icon="el-icon-edit" size="small" type="primary" @click="editParams(scope.row.attr_id)">编辑
                </el-button>
                <el-button icon="el-icon-delete" size="small" type="danger" @click="delParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--// 添加参数对话框-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form ref="addParamsRef" :model="addParamsForm" :rules="addParamsRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>

    <!--// 修改参数对话框-->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form ref="addParamsRef" :model="editParamsForm" :rules="editParamsRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setEditParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCateParamsAPI,
  addParamsAPI,
  categoriesAPI,
  delParamsAPI,
  paramsListAPI,
  queryIdParamsAPI,
  setParamsAPI
} from '@/api/goods'

export default {
  name: "params",
  data() {
    return {
      // 默认激活的是动态参数
      activeName: 'many',
      // 商品分类列表
      CateList: [],
      // 记录选中分类的id值
      selectId: [],
      // 级联选择器的配置项
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },

      // 选中分类的动态参数返回值
      manyParams: [],

      // 静态属性返回值
      onlyParams: [],
      // 弹出框，默认隐藏
      adddialogVisible: false,

      // 添加参数表单信息
      addParamsForm: {
        attr_name: ''
      },
      // 添加参数表单校验
      addParamsRules: {
        attr_name: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
      // 修改参数
      editDialogVisible: false,
      editParamsForm: {
        attr_name: ''
      },
      // 添加参数表单校验
      editParamsRules: {
        attr_name: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
      // 保存商品属性ID
      attrId: '',
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const {data: res} = await categoriesAPI()
      // console.log(res)
      if(res.meta.status !== 200) this.$message.error('获取分类列表失败')
      this.CateList = res.data
    },

    // 级联选择框发生变化会触发该函数
    handleChange() {
      // 判断是不是选择的三级分类
      if(this.selectId.length !== 3) {
        this.selectId = []
        this.manyParams = []
        this.onlyParams = []
        return
      }
      this.getParamsData()
    },

    handleClick() {
      // console.log(this.activeName);
      if(this.selectId.length === 0) return this.$message.error('请选择三级分类')
      this.getParamsData()
    },

    // 获取参数数据
    async getParamsData() {
      // 选择完毕发起参数列表请求
      const {data: res} = await paramsListAPI(this.cateID, {sel: this.activeName})
      console.log(res.data)
      if(res.meta.status !== 200) return false
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputValue = ''
        item.inputVisible = false
      })
      console.log(res.data)
      if(this.activeName === 'many') {
        this.manyParams = res.data
      } else {
        this.onlyParams = res.data
      }
    },

    // 关闭对话框，清空内容以及校验
    closeDialog() {
      this.$refs.addParamsRef.resetFields()
    },
    // 添加动态参数/静态属性
    async addParams() {
      const {data: res} = await addParamsAPI(this.cateID, {
        attr_name: this.addParamsForm.attr_name,
        attr_sel: this.activeName
      })
      // console.log(res)
      if(res.meta.status !== 201) return this.$message.error('添加失败')
      this.adddialogVisible = false
      this.getParamsData()
    },

    // 根据id获取分类参数
    async editParams(attrId) {
      this.editDialogVisible = true
      let id = this.cateID
      const {data: res} = await queryIdParamsAPI(id, attrId, {attr_sel: this.activeName})
      // console.log(res)
      this.editParamsForm.attr_name = res.data.attr_name
      this.attrId = res.data.attr_id
    },
    //  提交修改的数据
    async setEditParams() {
      let id = this.cateID
      let attrId = this.attrId
      const {data: res} = await setParamsAPI(id, attrId, {
        attr_name: this.editParamsForm.attr_name,
        attr_sel: this.activeName
      })
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success(res.meta.msg)
      this.editDialogVisible = false
      this.getParamsData()
    },

    // 删除参数
    delParams(attrId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 用户确认删除，发起请求
        const {data: res} = await delParamsAPI(this.cateID, attrId)
        // console.log(res)
        if(res.meta.status !== 200) return this.$message.error('删除参数失败')
        this.$message.success('删除成功')
        this.getParamsData()

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

    // handleInputConfirm
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      if(row.inputValue) {
        row.attr_vals.push(row.inputValue)
      }
      row.inputValue = ''
      row.inputVisible = false

      // 保存到后台
      this.saveAttrVals(row)
    },
    // 向后台保存的数据
    async saveAttrVals(row) {
      // 将参数保存到后台
      const {data: res} = await addCateParamsAPI(this.cateID, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('参数修改失败')
      this.$message.success('参数修改成功')
      this.getParamsData()
    },
    showInput(row) {
      row.inputVisible = true
      // 还没更新到页面，使用nextTick钩子函数
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 删除tag标签
    delTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },

  computed: {
    // 根据级联选择器的变化，判断添加参数、属性按钮是否禁用
    disabled() {
      if(this.selectId.length === 3) return false
      return true
    },

    // 获取选中的id分类
    cateID() {
      if(this.selectId.length === 3) return this.selectId[2]
      return null
    },

    // 根据activeName确定title
    titleText() {
      if(this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang='less' scoped>
.params_container {
  .el-card, .el-form, .el-table {
    margin-top: 15px;
  }

  .el-tag {
    margin: 0 5px;
  }

  .input-new-tag {
    width: 120px;
  }
}
</style>
