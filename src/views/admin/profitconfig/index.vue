<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="permissions.member_profitconfig_add" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form>

      <div class="avue-crud">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading">
            <el-table-column
              prop="id"
              header-align="center"
              align="center"
              label="ID">
            </el-table-column>
            <el-table-column
              prop="name"
              header-align="center"
              align="center"
              label="配置模板名称">
            </el-table-column>
            <el-table-column
              prop="profitSwitch"
              header-align="center"
              align="center"
              label="推广分佣状态">
              <template slot-scope="scope">
                  <span v-if="scope.row.profitSwitch == 0">关闭</span>
                  <span v-if="scope.row.profitSwitch == 1">开启</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="profitType"
              header-align="center"
              align="center"
              label="分佣模式（1.一级代理分佣 2.级代理分佣 3.普通用户）">
            </el-table-column> -->
            <el-table-column
              prop="agentProfitRate"
              header-align="center"
              align="center"
              label="分佣比例">
            </el-table-column>
            <!-- <el-table-column
                    prop="agentMaxProfitRate"
                    header-align="center"
                    align="center"
                    label="代理最高分佣比率">
            </el-table-column> -->
                      
             <!-- <el-table-column
                    prop="secondProfitRate"
                    header-align="center"
                    align="center"
                    label="二级代理分佣比率">
            </el-table-column>
                      <el-table-column
                    prop="secondMaxProfitRate"
                    header-align="center"
                    align="center"
                    label="二级代理最高分佣比率">
            </el-table-column> -->
            
            <el-table-column
              prop="createTime"
              header-align="center"
              align="center"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="updateTime"
              header-align="center"
              align="center"
              label="修改时间">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="permissions.member_profitconfig_add" type="text" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button v-if="permissions.ProfitConfig_profitconfig_del" type="text" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <div class="avue-crud__pagination">
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                background
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></table-form>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList, delObj} from '@/api/admin/profitconfig'
  import TableForm from './profitconfig-form'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        secondMaxProfitRate: '0',
        secondProfitRate: '0'
      }
    },
    components: {
      TableForm
    },
    created () {
      this.getDataList()
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        fetchList(Object.assign({
          current: this.pageIndex,
          size: this.pageSize
        })).then(response => {
          this.dataList = response.data.data.records
          this.totalPage = response.data.data.total
        })
        this.dataListLoading = false
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm('是否确认删除ID为' + id, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(id)
        }).then(data => {
          this.$message.success('删除成功')
          this.getDataList()
        })
      }
    }
  }
</script>
