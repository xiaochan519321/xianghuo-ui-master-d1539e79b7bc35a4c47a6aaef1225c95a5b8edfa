<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="代理：">
            <el-input v-model="dataForm.agentName" type="text" placeholder="请输入代理用户名"></el-input>
        </el-form-item>
        <el-form-item label="下单时间：">
			<el-date-picker
				v-model="dataForm.payTime"
				type="daterange"
				range-separator="至"
				format="yyyy-MM-dd"
				value-format="yyyy-MM-dd"
				start-placeholder="开始日期"
				end-placeholder="结束日期">
			</el-date-picker>
        </el-form-item>
        <el-form-item>
          	<el-button type="primary" @click="getDataList">搜索</el-button>
        </el-form-item>
        <el-form-item>
          	<el-button type="primary" @click="onExport" v-loading.fullscreen.lock="fullscreenLoading">导出</el-button>
        </el-form-item>
      </el-form>

      <div class="avue-crud">
        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading">
            <el-table-column
                prop="payOrderId"
                min-width="120"
                label="交易单号">
            </el-table-column>
            <el-table-column
                prop="goodsType"
                label="充值类型">
                <template slot-scope="scope">
                    <div>{{goodsTypeList[scope.row.goodsType]}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="money"
                width="100"
                label="金额">
            </el-table-column>
            <el-table-column
                prop="profitRate"
                width="100"
                label="分佣百分比">
            </el-table-column>
            <el-table-column
                prop="profitMoney"
                width="100"
                label="佣金">
            </el-table-column>
            <el-table-column
                prop="memberName"
                label="充值用户">
            </el-table-column>
            <el-table-column
                prop="memberId"
                label="充值用户ID">
            </el-table-column>
            <el-table-column
                prop="agentName"
                label="代理">
            </el-table-column>
            <el-table-column
                prop="agentId"
                label="代理Id">
            </el-table-column>
            <el-table-column
                prop="tenantId"
                min-width="120"
                label="分站Id">
            </el-table-column>
            <el-table-column
                prop="createTime"
                min-width="120"
                label="下单时间">
            </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                background
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </basic-container>
  </div>
</template>

<script>
  import { fetchList, exportList } from '@/api/admin/profitrecord'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        dataListLoading: false,
        fullscreenLoading: false,
        goodsTypeList: {
            1: '积分充值',
            2: '开通会员',
            5: '站点余额充值',
            6: '购买店铺数量'
        }
      }
    },
    created () {
      this.getDataList()
    },
    computed: {
    },
    methods: {
		onExport () {
            this.fullscreenLoading = true
            const params = {}
            if (this.dataForm.agentName) {
              params['agentName'] = this.dataForm.agentName
            }
            if (this.dataForm.payTime) {
              params['createTimeStart'] = `${this.dataForm.payTime[0]} 00:00:00`
              params['createTimeEnd'] = `${this.dataForm.payTime[1]} 23:59:59`
            }
            exportList(params).then(res => {
                console.log(res);
                this.fullscreenLoading = false;
                const type = 'application/gzip';
                const blob = new Blob([res.data], {type: type});
                const name = decodeURI(
                    res.headers['content-disposition'].split('=')[1]);
                if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
                    window.navigator.msSaveBlob(blob, name);
                } else {
                    const downloadElement = document.createElement('a');
                    const href = window.URL.createObjectURL(blob);
                    //后台再header中传文件名
                    downloadElement.href = href;
                    downloadElement.download = name;
                    document.body.appendChild(downloadElement);
                    downloadElement.click();
                    document.body.removeChild(downloadElement);// 下载完成移除元素
                }
                return Promise.resolve(true);
            }).catch(() => {
                this.fullscreenLoading = false;
            });
		},
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        const params = {
            current: this.pageIndex,
            size: this.pageSize,
        }
        if (this.dataForm.agentName) {
            params['agentName'] = this.dataForm.agentName
        }
        if (this.dataForm.payTime) {
            params['createTimeStart'] = `${this.dataForm.payTime[0]} 00:00:00`
            params['createTimeEnd'] = `${this.dataForm.payTime[1]} 23:59:59`
        }
        fetchList(params).then(response => {
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
    }
  }
</script>
