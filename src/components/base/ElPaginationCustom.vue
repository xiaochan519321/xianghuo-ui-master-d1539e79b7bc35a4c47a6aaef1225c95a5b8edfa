<template>
    <div :class="`el-pagination-container flex ${setStyle}`">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="options.currentPage"
            :page-sizes="options.pageSizes"
            :page-size="options.pageSize"
            :layout="options.layout"
            :total="options.total"
            :pager-count="options.pagerCount"
            background
        ></el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        align: {
            type: String,
            default: 'center',
        },
        options: {
            type: Object,
            default: () => {
                return {
                    currentPage: 1,
                    pageSize: 5,
                    total: 0,
                    pageSizes: [10, 20, 30, 40, 50, 100],
                    layout: 'prev, pager, next, jumper',
                    pagerCount: 5,
                };
            },
        },
    },
    data() {
        return {

        };
    },
    computed: {
        setStyle() {
            if (this.align === 'center') return 'justify-center';
            else if (this.align === 'right') return 'flex-row-reverse';
            return 'flex-row';
        },
    },
    methods: {
        handleSizeChange(val) {
            this.$emit('size-change', val);
        },
        handleCurrentChange(val) {
            this.$emit('current-change', val);
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-pagination__total {
    margin-left: 8px;
}
</style>
