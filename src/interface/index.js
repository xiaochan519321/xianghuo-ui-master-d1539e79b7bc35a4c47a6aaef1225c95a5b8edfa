// 将后面 新添加的 API 接口 导入到 全局，无需从页面引用

import pay from './modules/pay';
import user from './modules/user';
import dashboard from './modules/dashboard';
import notice from './modules/notice';
import order from './modules/order';
import permissions from './modules/permissions';
import shop from './modules/shop';
import goods from './modules/goods';


export default {
    ...pay,
    ...user,
    ...dashboard,
    ...notice,
    ...order,
    ...permissions,
    ...shop,
    ...goods,
}
