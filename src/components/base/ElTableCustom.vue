<script>
import ElPaginationCustom from './ElPaginationCustom';
export default {
    name: 'jsx-table',
    components: {
        ElPaginationCustom,
    },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Array,
            default: () => [],
        },
        data: {
            type: Array,
            default: () => [],
        },
        border: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: null,
        },
        emptyText: {
            type: String,
            default: '暂无数据',
        },
        selection: {
            type: Boolean,
            default: false,
        },
        selectionChange: {
            type: Function,
            default: () => { },
        },
        // 分页组件
        pagination: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Object,
            default: () => {
                return {
                    currentPage: 1,
                    pageSize: 10,
                    total: 100,
                    pageSizes: [10, 20, 30, 40, 50, 100],
                    layout: 'prev, pager, next, jumper',
                    pagerCount: 5,
                };
            },
        },
        sizeChange: {
            type: Function,
            default: () => { },
        },
        currentChange: {
            type: Function,
            default: () => { },
        },
        paginationAlign: {
            type: String,
            default: 'right',
        },
        rowClassName: {
            type: Function,
            default: () => { },
        },
        sortChange: {
            type: Function,
            default: () => { },
        },
        stripe: {
            type: Boolean,
            default: false,
        },
        theme: {
            type: String,
            default: 'default',
        },
    },
    render(h) {
        return <div class={`jsx-table-container ${this.theme}`} >
            <el-table
                data={this.data}
                border={this.border}
                empty-text={this.emptyText}
                style={`width: ${this.width}`}
                height={this.height}
                on-selection-change={this.selectionChange}
                row-class-name={this.rowClassName}
                on-sort-change={this.sortChange}
                stripe={this.stripe}
                v-loading={this.loading}
            >
                {
                    this.selection ? <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column> : null
                }
                {
                    this.columns && this.columns.map((item, index) => {
                        return <el-table-column
                            height={item.height}
                            border={item.border}
                            type={item.type}
                            prop={item.key}
                            label={item.label}
                            width={item.width}
                            min-width={item.minWidth}
                            key={index}
                            align={item.align ? item.align : 'center'}
                            sortable={item.sortable}
                            formatter={item.formatter}
                            render-header={item.renderHeader}
                        >
                            {item.render ? scope => item.render(h, scope) : item.slot
                                ? scope => h('div', [this.$scopedSlots[item.slot](scope)]) : ''}
                        </el-table-column>;
                    })
                }
            </el-table>
            {
                this.pagination && this.options.total > 0 ? <div class="pagination mt20"><el-pagination-custom
                    options={this.options}
                    on-size-change={this.sizeChange}
                    on-current-change={this.currentChange}
                    align={this.paginationAlign}
                >
                </el-pagination-custom></div> : null
            }
        </div>;
    },
};
</script>
