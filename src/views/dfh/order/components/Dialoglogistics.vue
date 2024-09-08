<template>
	<div class="dialog-logistics">
		<el-dialog
			title="物流信息"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="512px"
			@close="handleClose">
            <div v-loading="loading">
                <el-form ref="form" :model="form">
                    <el-form-item label="物流动态" class="logistics-form">
                        <el-timeline>
                            <el-timeline-item
                                v-for="(activity, index) in logisticsData.logisticsSteps"
                                :key="index"
                                :type="index == logisticsData.logisticsSteps.length - 1 ? 'primary' : ''"
                                :size="index == logisticsData.logisticsSteps.length - 1 ? 'large' : 'normal'"
                                :timestamp="activity.acceptTime">
                                {{activity.remark}}
                            </el-timeline-item>
                        </el-timeline>
                    </el-form-item>
                </el-form>
            </div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">知道了</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getOrderLogistics } from '@/api/dfh/order'
	export default {
		data() {
			return {
				dialogVisible: false,
				form: {},
                loading: false,
                logisticsData: {
                    logisticsSteps: []
                }
			}
		},
		watch: {
		},
		methods: {
            showModel (item) {
                console.log('dialogLogistics')
                this.item = item
                this.dialogVisible = true
                // this.loading = true
                this.loadLogisticsList()
            },
            async loadLogisticsList () {
                this.loading = true
                const { data } = await getOrderLogistics({orderId: this.item.orderId})
                this.logisticsData = data.data
                this.loading = false
                console.log('data', data)
            },
			// 关闭回调
			handleClose() {
				
			},
		}
	}
</script>

<style lang="less" scoped>
    .dialog-logistics {
        ::v-deep .el-dialog {
            border-radius: 10px;
            .el-loading-mask {
                position: absolute;
                .el-loading-spinner {
                    top: 150px;
                }
            }
            .el-dialog__header {
                padding: 15px 20px 15px;
                border-bottom: 1px solid #ededed;
                .el-dialog__title {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                height: 300px;
                padding: 10px 20px;
                overflow-y: scroll;
                .el-form {
                    .logistics-form {
                        display: flex;
                        .el-form-item__content {
                            flex: 1;
                            padding-top: 4px;
                            display: inline-block;
                            .el-timeline-item__node {
                                top: 6px;
                            }
                            .el-timeline-item__tail {
                                top: 6px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>