<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.real_name" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" stripe style="width: 100%" :border="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="employee_number" label="工号">
        </el-table-column>
        <el-table-column prop="real_name" label="姓名">
        </el-table-column>
        <el-table-column prop="phone" label="手机号">
        </el-table-column>
        <el-table-column prop="post_id" label="岗位">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="userStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.queryInfo.page" :page-sizes="[1, 2, 5, 10]" :page-size="this.queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper" :total="this.count">
      </el-pagination>
    </el-card>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确邮箱'))
    }
    return {
      queryInfo: {
        department_id: -999,
        real_name: '',
        page: 1,
        page_size: 5
      },
      tableData: [],
      count: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        email: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度为3-20', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        email: ''
      },
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度为3-20', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/v1/user-manage/list', {
        params: this.queryInfo
      })
      if (res.error) return this.$message.error(res.error.message)
      this.tableData = res.data.userList
      this.count = res.data.count
    },
    handleSizeChange (pageSize) {
      this.queryInfo.page_size = pageSize
      this.getUserList()
    },
    handleCurrentChange (pageNum) {
      this.queryInfo.page = pageNum
      this.getUserList()
    },
    async userStatusChange (userInfo) {
      const userStatus = userInfo.status ? 1 : 0
      const { data: res } = await this.$http.post('/v1/user-manage/status', {
        status: userStatus,
        uid: userInfo.id
      })
      if (res.error) {
        userInfo.status = !userInfo.status
        return this.$message.error(res.error.message)
      }
      return this.$message.success(res.data.message)
    },
    addFormClose () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/v1/user-manage/add', this.addForm)
        if (res.error) {
          return this.$message.error(res.error.message)
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    editFormClose () {
      this.$refs.editFormRef.resetFields()
    },
    showEditDialog (userInfo) {
      this.editForm = userInfo
      this.editDialogVisible = true
    },
    editUser () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/v1/user-manage/edit', this.editForm)
        console.log(res)
        if (res.error) {
          return this.$message.error(res.error.message)
        }
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    async removeUser (uid) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$http.post('/v1/user-manage/delete', {
        uid: uid
      })
      if (res.error) return this.$message.error(res.error.message)
      this.$message.success(res.data.message)
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
