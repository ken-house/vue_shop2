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
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加</el-button>
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
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" :id="scope.row.id"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        department_id: -999,
        real_name: '',
        page: 1,
        page_size: 5
      },
      tableData: [],
      count: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/v1/user/list', {
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
