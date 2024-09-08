import { getStore, setStore } from '@/util/store'
import { isURL, validatenull } from '@/util/validate'
import { loginByMobile, loginBySocial, loginByUsername, getUserInfo, logout, refreshToken, LoginByShopApi } from '@/api/login'
import User from '@/interface/modules/user'
import { deepClone, encryption } from '@/util/util'
import webiste from '@/const/website'
import { resetRouter } from '@/router/router'
import { getMenu, getTopMenu } from '@/api/admin/menu';
import { findSysSite } from '@/api/admin/site';

// 图片资源路径
const PATH = 'http://bucket.damaijia.co/';

function addPath(ele, first) {
    const menu = webiste.menu
    const propsConfig = menu.props
    const propsDefault = {
        label: propsConfig.label || 'name',
        path: propsConfig.path || 'path',
        icon: propsConfig.icon || 'icon',
        children: propsConfig.children || 'children'
    }
    const icon = ele[propsDefault.icon]
    ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon
    const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
    if (!isChild) ele[propsDefault.children] = []
    if (!isChild && first && !isURL(ele[propsDefault.path])) {
        ele[propsDefault.path] = ele[propsDefault.path] + '/index'
    } else {
        ele[propsDefault.children].forEach(child => {
            addPath(child)
        })
    }
}

const sendWebviewmsg = (data) => {
    const msg = {
        key: 'login',
        token: data.access_token,
        identity: data.user_info ? data.user_info.identity : ''
    }
    window.electron.send(msg)
}

const user = {
    state: {
        userInfo: getStore({
            name: 'userInfo'
        }) || {},
        my: getStore({
            name: 'my'
        }) || {},
        permissions: getStore({
            name: 'permissions'
        }) || [],
        roles: [],
        menu: getStore({
            name: 'menu'
        }) || [],
        siteConfig: getStore({
            name: 'siteConfig'
        }) || {},
        menuAll: [],
        expires_in: getStore({
            name: 'expires_in'
        }) || '',
        access_token: getStore({
            name: 'access_token'
        }) || '',
        refresh_token: getStore({
            name: 'refresh_token'
        }) || '',
        warn_dialog: getStore({
            name: 'warn_dialog'
        }) || '',
        robot_dialog: getStore({
            name: 'robot_dialog'
        }) || '',
        supply_dialog: getStore({
            name: 'supply_dialog'
        }) || '',
        robot_explain: getStore({
            name: 'robot_explain'
        }) || ''
    },
    actions: {
        // 根据用户名登录
        LoginByUsername({ commit }, userInfo) {
            const user = encryption({
                data: userInfo,
                key: 'pigxpigxpigxpigx',
                param: ['password']
            })
            return new Promise((resolve, reject) => {
                loginByUsername(user.username, user.password, user.code, user.randomStr).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    commit('SET_USER_INFO', data.user_info)
                    commit('SET_PERMISSIONS', data.user_info.authorities || [])
                    commit('CLEAR_LOCK')
                    // 如果是webview环境，登陆成功后发送token给webview
                    if (window.electron) sendWebviewmsg(data)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据手机号登录
        LoginByPhone({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                loginByMobile(userInfo.mobile, userInfo.code).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    commit('SET_USER_INFO', data.user_info)
                    commit('SET_PERMISSIONS', data.user_info.authorities || [])
                    commit('CLEAR_LOCK')
                    // 如果是webview环境，登陆成功后发送token给webview
                    if (window.electron) sendWebviewmsg(data)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据店铺授权回调登录
        LoginByShop({ commit }, params) {
            return new Promise((resolve, reject) => {
                LoginByShopApi(params.code).then(response => {
                    const data = response.data.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    commit('SET_USER_INFO', data.user_info)
                    commit('SET_PERMISSIONS', data.user_info.authorities || [])
                    commit('CLEAR_LOCK')
                    // 如果是webview环境，登陆成功后发送token给webview
                    if (window.electron) sendWebviewmsg(data)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据OpenId登录
        LoginBySocial({ commit }, param) {
            return new Promise((resolve, reject) => {
                loginBySocial(param.state, param.code).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    commit('SET_USER_INFO', data.user_info)
                    commit('SET_PERMISSIONS', data.user_info.authorities || [])
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 刷新token
        RefreshToken({ commit, state }) {
            return new Promise((resolve, reject) => {
                refreshToken(state.refresh_token).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    commit('CLEAR_LOCK')
                    // 如果是webview环境，登陆成功后发送token给webview
                    if (window.electron) sendWebviewmsg(data)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 查询用户信息
        GetUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res) => {
                    const data = res.data.data || {}
                    commit('SET_USER_INFO', data.sysUser)
                    commit('SET_ROLES', data.roles || [])
                    commit('UPDATE_PERMISSIONS', data.permissions || [])
                    resolve(data)
                }).catch(() => {
                    reject()
                })
            })
        },
        // 获取用户信息  是否开通会员以及个人资料
        GetMy({ commit }) {
            return new Promise((resolve, reject) => {
                User.getMerchantInfo().then((res) => {
                    const data = res.data.data || {}
                    commit('SET_MY', data)
                    resolve(data)
                }).catch(() => {
                    reject()
                })
            })
        },
        // 登出
        LogOut({ commit }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    resetRouter();
                    commit('SET_MENU', [])
                    commit('SET_PERMISSIONS', [])
                    commit('SET_USER_INFO', {})
                    commit('SET_MY', {})
                    commit('SET_ACCESS_TOKEN', '')
                    commit('SET_REFRESH_TOKEN', '')
                    commit('SET_EXPIRES_IN', '')
                    commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG')
                    commit('CLEAR_LOCK')
                    // 警告窗口 一星期后下线
                    commit('SET_WARN_MSG')
                    // 机器人广告
                    commit('SET_ROBOT_DIALOG')
                    // 供应链广告
                    commit('SET_SUPPLY_DIALOG')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 注销session
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                resetRouter();
                commit('SET_MENU', [])
                commit('SET_PERMISSIONS', [])
                commit('SET_USER_INFO', {})
                commit('SET_MY', {})
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG')
                commit('CLEAR_LOCK')
                // 警告窗口 一星期后下线
                commit('SET_WARN_MSG')
                // 机器人广告
                commit('SET_ROBOT_DIALOG')
                // 供应链广告
                commit('SET_SUPPLY_DIALOG')
                resolve()
            })
        },
        // 获取系统菜单
        GetMenu({ commit }, obj) {
            return new Promise(resolve => {
                getMenu(obj.id).then((res) => {
                    const data = res.data.data
                    const menu = deepClone(data)
                    menu.forEach(ele => {
                        addPath(ele)
                    })
                    let type = obj.type
                    commit('SET_MENU', { type, menu })
                    resolve(menu)
                })
            })
        },
        //顶部菜单
        GetTopMenu() {
            return new Promise(resolve => {
                getTopMenu().then((res) => {
                    const data = res.data.data || []
                    resolve(data)
                })
            })
        },
        // 获取站点信息 /admin/site/findSysSite
        GetSiteConfig({ commit }, obj) {
            return new Promise(resolve => {
                findSysSite().then((res) => {
                    const siteConfig = res.data.data;
                    siteConfig.headerLogo = PATH + siteConfig.headerLogo;
                    siteConfig.htLogo = PATH + siteConfig.htLogo;
                    siteConfig.icon = PATH + siteConfig.icon;
                    siteConfig.contactQrcode = PATH + siteConfig.contactQrcode;
                    // 添加 图片资源路径
                    siteConfig.PATH = PATH;
                    let type = obj.type
                    // 保存站点ID
                    setStore({ name: 'tenantId', content: siteConfig.id });
                    commit('SET_SITECONFIG', { type, siteConfig })
                    resolve(siteConfig)
                })
            })
        },
    },
    mutations: {
        SET_ACCESS_TOKEN: (state, access_token) => {
            state.access_token = access_token
            setStore({
                name: 'access_token',
                content: state.access_token,
                type: 'session'
            })
        },
        SET_EXPIRES_IN: (state, expires_in) => {
            state.expires_in = expires_in
            setStore({
                name: 'expires_in',
                content: state.expires_in,
                type: 'session'
            })
        },
        SET_REFRESH_TOKEN: (state, rfToken) => {
            state.refresh_token = rfToken
            setStore({
                name: 'refresh_token',
                content: state.refresh_token,
                type: 'session'
            })
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
            setStore({
                name: 'userInfo',
                content: userInfo,
                type: 'session'
            })
        },
        SET_MY: (state, my) => {
            state.my = my
            setStore({
                name: 'my',
                content: my,
                type: 'session'
            })
        },

        SET_MENU: (state, params = {}) => {
            let { menu, type } = params;
            if (type !== false) state.menu = menu
            setStore({
                name: 'menu',
                content: menu,
                type: 'session'
            })
        },
        SET_SITECONFIG: (state, params = {}) => {
            let { siteConfig, type } = params;
            if (type !== false) state.siteConfig = siteConfig
            setStore({
                name: 'siteConfig',
                content: siteConfig,
                type: 'session'
            })
        },
        SET_MENU_ALL: (state, menuAll) => {
            state.menuAll = menuAll
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            const list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i].authority] = true
            }

            state.permissions = list
            setStore({
                name: 'permissions',
                content: list,
                type: 'session'
            })
        },
        SET_WARN_MSG: (state, warn_dialog) => {
            state.warn_dialog = warn_dialog
            setStore({
                name: 'warn_dialog',
                content: state.warn_dialog,
                type: 'session'
            })
        },
        // 机器人广告
        SET_ROBOT_DIALOG: (state, robot_dialog) => {
            state.robot_dialog = robot_dialog
            setStore({
                name: 'robot_dialog',
                content: state.robot_dialog,
                type: 'session'
            })
        },
        // 供应链广告
        SET_SUPPLY_DIALOG: (state, supply_dialog) => {
            state.supply_dialog = supply_dialog
            setStore({
                name: 'supply_dialog',
                content: state.supply_dialog,
                type: 'session'
            })
        },
        // 机器人操作引导
        SET_ROBOT_EXPLAIN: (state, active) => {
            state.robot_explain = active
            setStore({
                name: 'robot_explain',
                content: state.robot_explain
            })
        },
        UPDATE_PERMISSIONS: (state, permissions) => {
            const list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i]] = true
            }

            state.permissions = list
            setStore({
                name: 'permissions',
                content: list,
                type: 'session'
            })
        },
        UPDATE_OPEN_SPWD_FLAG: (state, form) => {
			state.userInfo.open_spwd_flag = form.open_spwd_flag;
			const userInfo = state.userInfo;
			setStore({
			    name: 'userInfo',
			    content: userInfo,
			    type: 'session'
			})
		}

    }

}
export default user
