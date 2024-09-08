<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="分站：" v-if="my.tenantId == 1">
			<el-select v-model="dataForm.tenantId" placeholder="请选择分站" clearable>
				<el-option
					v-for="item in tenanList"
					:key="item.id"
					:label="item.name"
					:value="item.id">
				</el-option>
			</el-select>
        </el-form-item>
        <el-form-item label="订单类型：">
			<el-select v-model="dataForm.orderType" placeholder="请选择订单类型" clearable>
				<el-option
					v-for="item in orderTypeOpt"
					:key="item.value"
					:label="item.label"
					:value="item.value">
				</el-option>
			</el-select>
        </el-form-item>
        <el-form-item label="渠道单号：">
            <el-input type="text" v-model="dataForm.channelOrderNo" placeholder="请输入支付渠道单号"></el-input>
        </el-form-item>
        <el-form-item label="支付时间：">
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
				prop="orderId"
				min-width="120"
				label="支付单号">
            </el-table-column>
			<el-table-column
				prop="body"
				label="订单类型">
            </el-table-column>
			<el-table-column
				prop="amount"
				width="100"
				label="金额">
                <template slot-scope="scope">
                    <span>{{scope.row.amount != 0 ? scope.row.amount / 100 : 0}}</span>
                </template>
            </el-table-column>
			<el-table-column
				prop="paySuccTime"
				min-width="100"
				label="支付时间">
            </el-table-column>
			<el-table-column
				prop="tenantId"
				min-width="120"
				label="站点ID">
            </el-table-column>
			<el-table-column
				prop="tenantName"
				label="站点名称">
            </el-table-column>
			<el-table-column
				prop="channelMchId"
				label="商户号">
            </el-table-column>
			<el-table-column
				prop="channelOrderNo"
				label="支付渠道单号">
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
  import { getTradeOrderList, exportOrderList, getChildSite } from '@/api/admin/site'
  import { mapState } from 'vuex'
  export default {
	  computed: {
        ...mapState({
            my: state => state.user.my
        }),
	  },
    data () {
      return {
        dataForm: {},
        dataList: [],
		tenanList: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        dataListLoading: false,
		fullscreenLoading: false,
        orderTypeOpt: [
            {label: '积分充值', value: 1},
            {label: '开通会员', value: 2},
            {label: '站点余额充值', value: 5},
            {label: '购买店铺数量', value: 6},
            {label: '续费店铺', value: 7},
            // {label: '商家余额充值', value: 8},
            {label: '购买机器人', value: 9},
            {label: '续费机器人', value: 10}
        ],
      }
    },
    created () {
      this.getDataList()
	  this.getChildSiteList()
    },
    methods: {
		onExport () {
            this.fullscreenLoading = true
            const params = {
				tenantId: this.dataForm.tenantId,
                channelOrderNo: this.dataForm.channelOrderNo,
                orderType: this.dataForm.orderType
			}
			if (this.dataForm.payTime) {
				params['paySuccTimeStart'] = `${this.dataForm.payTime[0]} 00:00:00`
				params['paySuccTimeEnd'] = `${this.dataForm.payTime[1]} 23:59:59`
			}
            exportOrderList(params).then(res => {
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
				tenantId: this.dataForm.tenantId,
                channelOrderNo: this.dataForm.channelOrderNo,
                orderType: this.dataForm.orderType
			}
			if (this.dataForm.payTime) {
				params['paySuccTimeStart'] = `${this.dataForm.payTime[0]} 00:00:00`
				params['paySuccTimeEnd'] = `${this.dataForm.payTime[1]} 23:59:59`
			}
			getTradeOrderList(params).then(response => {
				this.dataList = response.data.data.records
				this.totalPage = response.data.data.total
				this.dataListLoading = false
			})
		},
		async getChildSiteList () {
			const { data } = await getChildSite()
			this.tenanList = data.data || []
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
