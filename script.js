new Vue({
    el: '#app',
    components: {
        draggable: vuedraggable
    },
    data: {
        headers: [],
        rows: [],
        filteredRows: [],
        filterText: '',
        draggingIndex: null,
        dragOverIndex: null,
        selectedIndex: null,
        sortColumnIndex: null,
        sortOrder: 1 // 1 表示正排序，-1 表示反排序
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file && file.type === 'text/csv') {
                Papa.parse(file, {
                    complete: (result) => {
                        this.parseCSV(result.data);
                    },
                    header: false
                });
            } else {
                alert('Please upload a valid CSV file.');
            }
        },
        parseCSV(data) {
            this.headers = data[0];
            this.rows = data.slice(1);
            this.filterRows();
        },
        filterRows() {
            if (this.filterText) {
                this.filteredRows = this.rows.filter(row => row[0] === this.filterText);
            } else {
                this.filteredRows = this.rows;
            }
        },
        sortColumn(index) {
            if (this.sortColumnIndex === index) {
                // 切换排序顺序
                this.sortOrder *= -1;
            } else {
                // 设置新的排序列和正排序
                this.sortColumnIndex = index;
                this.sortOrder = 1;
            }
            this.filteredRows.sort((a, b) => {
                if (a[index] < b[index]) return -1 * this.sortOrder;
                if (a[index] > b[index]) return 1 * this.sortOrder;
                return 0;
            });
        },
        onDragStart(evt) {
            this.draggingIndex = evt.oldIndex;
        },
        onDragChange(evt) {
            this.dragOverIndex = evt.newIndex;
        },
        onDragEnd(evt) {
            const { oldIndex, newIndex } = evt;
            this.draggingIndex = null;
            this.dragOverIndex = null;
            if (oldIndex !== newIndex) {
                // 交换数据
                const temp = this.filteredRows[oldIndex];
                this.$set(this.filteredRows, oldIndex, this.filteredRows[newIndex]);
                this.$set(this.filteredRows, newIndex, temp);
                // 更新原始数据顺序
                const originalOldIndex = this.rows.indexOf(temp);
                const originalNewIndex = this.rows.indexOf(this.filteredRows[newIndex]);
                this.rows.splice(originalOldIndex, 1);
                this.rows.splice(originalNewIndex, 0, temp);
            }
        },
        onRowFocus(rowIndex) {
            this.selectedIndex = rowIndex;
        },
        onArrowDown() {
            if (this.selectedIndex !== null && this.selectedIndex < this.filteredRows.length - 1) {
                const oldIndex = this.selectedIndex;
                const newIndex = this.selectedIndex + 1;
                // 交换数据
                const temp = this.filteredRows[oldIndex];
                this.$set(this.filteredRows, oldIndex, this.filteredRows[newIndex]);
                this.$set(this.filteredRows, newIndex, temp);
                // 更新原始数据顺序
                const originalOldIndex = this.rows.indexOf(temp);
                const originalNewIndex = this.rows.indexOf(this.filteredRows[newIndex]);
                this.rows.splice(originalOldIndex, 1);
                this.rows.splice(originalNewIndex, 0, temp);
                // 更新选中行索引
                this.selectedIndex = newIndex;
                // 设置焦点到新选中行
                this.$nextTick(() => {
                    this.$el.querySelectorAll('tr')[newIndex + 1].focus();
                });
            }
        },
        onArrowUp() {
            if (this.selectedIndex !== null && this.selectedIndex > 0) {
                const oldIndex = this.selectedIndex;
                const newIndex = this.selectedIndex - 1;
                // 交换数据
                const temp = this.filteredRows[oldIndex];
                this.$set(this.filteredRows, oldIndex, this.filteredRows[newIndex]);
                this.$set(this.filteredRows, newIndex, temp);
                // 更新原始数据顺序
                const originalOldIndex = this.rows.indexOf(temp);
                const originalNewIndex = this.rows.indexOf(this.filteredRows[newIndex]);
                this.rows.splice(originalOldIndex, 1);
                this.rows.splice(originalNewIndex, 0, temp);
                // 更新选中行索引
                this.selectedIndex = newIndex;
                // 设置焦点到新选中行
                this.$nextTick(() => {
                    this.$el.querySelectorAll('tr')[newIndex + 1].focus();
                });
            }
        }
    }
});
