<template>
    <div class="item-header-wrap">
        <div class="row">
            <!-- 订单编号、收货地址 -->
            <div class="part">
                <div>
                    订单编号：{{row.orderId}}
                    <i
                        style="cursor:pointer;"
                        class="el-icon-copy-document"
                        v-clipboard:copy="row.orderId"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                    ></i>
                </div>
                <div class="address flex">
                    <span>收货地址：</span>
                    <div v-if="row.decryptStatus == '1'">
                        <span>{{row.encryptPostReceiver}}</span>
                        <span class="pl10">{{row.encryptPostTel}}</span>
                        <span class="pl10">{{row.province}} {{row.city}} {{row.town}} {{row.street}}</span>
                        <span class="pl10">{{row.encryptDetail}}</span>
                    </div>
                    <span v-if="row.decryptStatus == '0'" style="color:red;">尚未解密</span>
                    <span
                        @click="showEncLoseRemark(row)"
                        v-if="row.decryptStatus == '2'"
                        style="color:red;cursor:pointer;"
                    >
                        解密失败
                        <i class="el-icon-view"></i>
                    </span>
                </div>
            </div>
            <!-- 下单时间、当前代发状态 -->
            <div class="part">
                <div>下单时间：{{formats(row.createTime * 1000)}}</div>
                <div>
                    <span>订单状态：</span>
                    <span>
                        <span class="theme-color">{{row.orderStatusDesc}}</span>
                    </span>
                </div>
            </div>
            <!-- 店铺、超时发货时间 -->
            <div class="part">
                <div>{{ '店铺：'+row.shopName}}</div>
                <div>
                    超时发货时间：
                    <span
                        style="color:#CC1818;"
                        v-if="row.status != '6' & row.status != '7' & row.status != '8'"
                    >{{getRemainderTime(formats(row.createTime * 1000))}}</span>
                    <span v-else>-</span>
                </div>
            </div>
            <!-- 商家备注、代发补充地址 -->
            <div class="part">
                <div class="remark">
                    <span style="min-width: 60px;">商家备注：</span>
                    <i
                        v-if="row.sellerRemarkStars == '0'"
                        style="color:gray;"
                        class="el-icon-s-flag"
                    ></i>
                    <i
                        v-if="row.sellerRemarkStars == '5'"
                        style="color:red;"
                        class="el-icon-s-flag"
                    ></i>
                    <i
                        v-if="row.sellerRemarkStars == '4'"
                        style="color:orange;"
                        class="el-icon-s-flag"
                    ></i>
                    <i
                        v-if="row.sellerRemarkStars == '3'"
                        style="color:green;"
                        class="el-icon-s-flag"
                    ></i>
                    <i
                        v-if="row.sellerRemarkStars == '2'"
                        style="color:cyan;"
                        class="el-icon-s-flag"
                    ></i>
                    <i
                        v-if="row.sellerRemarkStars == '1'"
                        style="color:purple;"
                        class="el-icon-s-flag"
                    ></i>
                    <el-tooltip
                        :content="row.sellerWords"
                        placement="bottom"
                        effect="light"
                        style="cursor:pointer;"
                    >
                        <div class="ellipsis-2 pl5" style="max-width:150px;">
                            <span>{{row.sellerWords}}</span>
                        </div>
                    </el-tooltip>
                </div>
                <div class="flex">
                    <span>代发补充地址：</span>
                    <div class="flex" v-if="row.decryptStatus == '1'">
                        <div>{{row.pddSsqText}}</div>
                        <div v-if="null != row.pddAddress">******</div>
                        <i class="pl10 theme-color iconfont icon-edit" @click="editPddArea(row)"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TimeFormats from '@/util/TimeFormats'

export default {
    props: {
        row: {
            type: Object,
            default: () => { },
        }
    },
    data() {
        return {

        };
    },
    computed: {
        ...mapGetters([

        ]),
    },
    created() {

    },
    mounted() {
    },
    methods: {
        editPddArea(row) {
            this.$emit('editPddArea', row);
        },
        formats(val) {
            return new TimeFormats().convertTime('', val);
        },
        onCopy(e) { 　　 // 复制成功
            this.$message({
                message: '复制成功！',
                type: 'success'
            })
        },
        onError(e) {　　 // 复制失败
            this.$message({
                message: '复制失败！',
                type: 'error'
            })
        },
        formats(val) {
            return new TimeFormats().convertTime('', val);
        },
        getRemainderTime(startTime) {
            var s1 = new Date(startTime.replace(/-/g, "/")),
                s2 = new Date(),
                runTime = parseInt((s2.getTime() - (s1.getTime() + 48 * 60 * 60 * 1000)) / 1000);
            var year = Math.floor(runTime / 86400 / 365);
            runTime = runTime % (86400 * 365);
            var month = Math.floor(runTime / 86400 / 30);
            runTime = runTime % (86400 * 30);
            var day = Math.floor(runTime / 86400);
            runTime = runTime % 86400;
            var hour = Math.floor(runTime / 3600);
            runTime = runTime % 3600;
            var minute = Math.floor(runTime / 60);
            runTime = runTime % 60;
            var second = runTime;
            // console.log(year,month,day,hour,minute,second);
            //return year+','+month+','+day+','+hour+','+minute+','+second;
            if (minute < 0) {
                return '-';
            }
            return day + ' 天 ' + hour + ' 时 ' + minute + ' 分 ';
        },
    },
};
</script>

<style lang="scss" scoped>
.remark {
    display: flex;
    align-items: center;
}
.icon-edit {
    cursor: pointer;
}
.part {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>
