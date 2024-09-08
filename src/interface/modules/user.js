
// 用户 相关接口
import request from '@/router/axios'
export default {
    // 获取当前商家信息
    getMerchantInfo() {
        return request({
            url: '/dfh/order/getMerchantInfo',
            method: 'get',
        });
    },
    // 查询会员权益及价格
    getMemberRightsList() {
        return request({
            url: '/admin/memberright/getAllList',
            method: 'get',
        });
    },
    // 忘记密码/重置密码
    updatePassword(data) {
        return request({
            url: '/admin/user/updatePassword',
            method: 'post',
            data: data,
        });
    },
}
