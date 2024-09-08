
// 积分充值相关接口
import request from '@/router/axios'

export default {
    // 获取 通知列表
    getNoticelist(obj) {
        return request({
            url: '/dfh/notice/page',
            method: 'get',
            params: obj,
        })
    },
    // 创建一条通知
    createNotice(obj) {
        return request({
            url: '/dfh/notice',
            method: 'post',
            data: obj,
        })
    },
    // 删除一条通知
    deleteNotice(noticeId) {
        return request({
            url: '/dfh/notice/' + noticeId,
            method: 'delete',
        })
    },
    // 获取 未读通知条数
    getUnreadNotice(obj) {
        return request({
            url: 'dfh/noticeMember/unreadNum',
            method: 'get',
            params: obj,
        })
    },
    // 通知分页查询
    getNoticeList(obj) {
        return request({
            url: 'dfh/noticeMember/page',
            method: 'get',
            params: obj,
        })
    },
    // 更新 通知阅读状态
    noticeRead(obj) {
        return request({
            url: 'dfh/noticeMember/read',
            method: 'put',
            params: obj,
        })
    },
}
