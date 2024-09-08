<template>
	<!-- 请在需要验证二级密码的页面引入该组件，同时在方法接口上根据捕获的异常信息决定是否打开验证模态框 -->
	<div>
		<el-dialog
			title="验证二级密码"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="30%"
			@close="handleClose">
			<el-form ref="form" :model="form" :rules="rules">
				<el-form-item label="输入二级密码" prop="second_password">
					<el-input v-model="form.second_password" show-password></el-input>
				</el-form-item>
				<el-form-item label="再次输入二级密码" prop="second_passwordAg">
					<el-input v-model="form.second_passwordAg" show-password></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="checkSecondPassword('form')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import { validatePsdReg } from "@/util/validate"
	import { checkSecondPassword } from "@/api/admin/user"
	import store from '@/store'
	export default {
		props: {
			openDialog: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dialogVisible: false,
				form: {},
				rules: {
					second_password: [
						{ required: true, message: '请输入二级密码', trigger: ['blur', 'change'] },
						{ validator: validatePsdReg, trigger: ['blur', 'change'] }
					],
					second_passwordAg: [
						{ required: true, message: '请再次输入二级密码', trigger: ['blur', 'change'] },
						{ validator: validatePsdReg, trigger: ['blur', 'change'] }
					]
				}
			}
		},
		watch: {
			openDialog(val, oldVal) {
				this.dialogVisible = val;
			}
		},
		methods: {
			// 关闭回调
			handleClose() {
				
			},
			// 验证二级密码
			checkSecondPassword(form) {
				this.$refs[form].validate((valid) => {
					let _this = this;
					if (valid) {
						// 仅在前端部分验证两次二级密码是否一致
						if (_this.form.second_password !== _this.form.second_passwordAg) {
							_this.$message.error("两次二级密码不一致");
							return false;
						}
						checkSecondPassword(_this.form).then(function(res) {
							if (res.data.code === 50050 || res.data.msg !== "二级密码验证错误") {
								var access_token = store.getters.access_token;
								// 仅在当前会话中保持
								sessionStorage.setItem(
									access_token + "_spwd",
									_this.form.second_password
								)
								_this.dialogVisible = false;
								location.reload(); //重新刷新页面
							}
						})
					}
				})
			}
		}
	}
</script>