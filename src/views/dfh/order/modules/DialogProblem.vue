<template>
    <div
        class="dialog-problem-dfh-components"
        :style="{
            transform: visible_ ? '' :  'translateX(282px)',
        }"
        v-clickoutside="onHandleClickoutside"
    >
        <div class="switch" @click.stop="visible_ = false">
            <i class="el-icon-d-arrow-right"></i>
        </div>
        <div class="wrapper flex flex-col">
            <div class="header">
                <span>帮助文档</span>
            </div>
            <div class="content mt10 flex-1">
                <div class="input-box">
                    <el-input @input="onInput" v-model="input" placeholder="请输入内容">
                        <i class="el-icon-search" slot="suffix"></i>
                    </el-input>
                </div>
                <div>
                    <div class="mt34" v-for="(item, index) in list" :key="index">
                        <template v-if="item.children && item.children.length > 0">
                            <h2 class="title">
                                <span>{{ item.title }}</span>
                            </h2>
                            <ul class="ul-list mt20">
                                <template v-for="(child, childIndex) in item.children">
                                    <li :key="childIndex">
                                        <el-link type="info" :href="child.url" target="_blank">
                                            <span>{{ child.title }}</span>
                                        </el-link>
                                    </li>
                                </template>
                            </ul>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            input: '',
            list: [
                {
                    key: '1',
                    title: '下单操作流程',
                    children: [],
                }, {
                    key: '2',
                    title: '下单常见问题',
                    children: [],
                }, {
                    key: '3',
                    title: '功能介绍',
                    children: [],
                },
            ],
            contents: [
                {
                    key: '1',
                    title: '店铺绑定操作介绍',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/wp8tul',
                }, {
                    key: '1',
                    title: '添加支付账号',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/wnsd64',
                }, {
                    key: '1',
                    title: '商品列表绑定规格',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/ssnlrr',
                }, {
                    key: '1',
                    title: '代发列表代发订单',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/qz13sw',
                }, {
                    key: '1',
                    title: '客户端操作流程',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/eb55be',
                }, {
                    key: '2',
                    title: '抖音解密额度申请',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/heyp5z',
                }, {
                    key: '2',
                    title: '店铺授权失败',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/hgxl0t',
                }, {
                    key: '2',
                    title: '商品同步时间太久',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/ngq254',
                }, {
                    key: '2',
                    title: '客户端支付问题',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/pcno4v',
                }, {
                    key: '2',
                    title: '支付宝支付出现问题',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/yw1gz9',
                }, {
                    key: '3',
                    title: '工作台功能介绍',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/gmpuzu',
                }, {
                    key: '3',
                    title: '子账号功能介绍',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/kcb6ko',
                }, {
                    key: '3',
                    title: '代发设置功能介绍',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/tccfr1',
                }, {
                    key: '3',
                    title: '财务管理功能介绍',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/oxagcs',
                }, {
                    key: '3',
                    title: '店铺报表功能介绍',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/gu56po',
                }, {
                    key: '3',
                    title: '数据大屏',
                    url: 'https://www.yuque.com/books/share/2f00e955-ad51-4f1e-9857-e9b562c187a9/dtbxlg',
                },
            ],
        };
    },
    computed: {
        ...mapGetters([

        ]),
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            },
        },
    },
    created() {

    },
    mounted() {
        this.list.forEach(item => {
            this.contents.forEach(row => {
                if (item.key === row.key) {
                    item.children.push(row);
                }
            })
        });
    },
    methods: {
        onInput() {
            const arr = this.fuzzyQuery(this.input);
            this.list[0].children = [];
            this.list[1].children = [];
            this.list[2].children = [];
            this.list.forEach(item => {
                arr.forEach(row => {
                    if (item.key === row.key) {
                        item.children.push(row);
                    }
                })
            });
        },
        fuzzyQuery(keyWord) {
            const list = this.contents;
            const arr = [];
            for (let i = 0; i < list.length; i++) {
                if (list[i].title.indexOf(keyWord) >= 0) {
                    arr.push(list[i]);
                }
            }
            return arr;
        },
        onHandleClickoutside() {
            this.visible_ = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.dialog-problem-dfh-components {
    width: 257px;
    height: calc(100% - 114px);
    background: #ffffff;
    box-shadow: 0 0 15px 0px #d3e1fa;
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 99;
    transition: 0.15s ease-in-out;
    .switch {
        width: 25px;
        height: 78px;
        background: #ffffff;
        position: absolute;
        top: 52px;
        left: -25px;
        box-shadow: -5px 0 8px 0 #d3e1fa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #4fa1fe;
        cursor: pointer;
    }
    .wrapper {
        height: 100%;
        overflow-y: auto;
        .header {
            height: 50px;
            border-bottom: 1px solid #dedede;
            box-sizing: border-box;
            font-weight: 600;
            font-size: 16px;
            color: #666666;
            display: flex;
            align-items: center;
            padding-left: 22px;
        }
        .content {
            padding: 0 13px;
            box-sizing: border-box;
            overflow-x: hidden;
            overflow-y: auto;

            .input-box {
                position: relative;

                .el-icon-search {
                    font-size: 18px;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 10px;
                }
            }

            .title {
                color: #666666;
                font-size: 16px;
                font-weight: 600;
            }

            .ul-list {
                color: #b0bccb;
                font-size: 14px;
                li {
                    margin-left: 20px;
                    margin-bottom: 15px;
                    list-style-type: decimal;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
