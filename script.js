const { createApp } = Vue;
const app = createApp({
  components: {
    draggable: vuedraggable
  },
  data() {
    return {
      headers: [],
      rows: [],
      filteredRows: [],
      filterText: '',
      draggingIndex: null,
      dragOverIndex: null,
      selectedIndex: null,
      sortColumnIndex: null,
      sortOrder: 1 // 1 表示正排序，-1 表示反排序
    };
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
      }
    },
    parseCSV(data) {
      this.headers = data[0];
      this.rows = data.slice(1).map((row, index) => ({ id: index, ...row }));
      this.filteredRows = this.rows;
    },
    filterRows() {
      this.filteredRows = this.rows.filter(row => row[0] === this.filterText);
    },
    sortColumn(index) {
      if (this.sortColumnIndex === index) {
        this.sortOrder *= -1;
      } else {
        this.sortOrder = 1;
        this.sortColumnIndex = index;
      }
      this.filteredRows.sort((a, b) => {
        if (a[index] < b[index]) return -1 * this.sortOrder;
        if (a[index] > b[index]) return 1 * this.sortOrder;
        return 0;
      });
    },
    onDragStart() {
      // 拖動開始
    },
    onDragEnd() {
      // 拖動結束
    },
    onDragChange() {
      // 拖動改變
    },
    onRowFocus(rowIndex) {
      this.selectedIndex = rowIndex;
    },
    onArrowDown() {
      if (this.selectedIndex !== null && this.selectedIndex < this.filteredRows.length - 1) {
        const oldIndex = this.selectedIndex;
        const newIndex = this.selectedIndex + 1;
        this.swapRows(oldIndex, newIndex);
        this.selectedIndex = newIndex;
        this.$nextTick(() => {
          this.$el.querySelectorAll('tr')[newIndex + 1].focus();
        });
      }
    },
    onArrowUp() {
      if (this.selectedIndex !== null && this.selectedIndex > 0) {
        const oldIndex = this.selectedIndex;
        const newIndex = this.selectedIndex - 1;
        this.swapRows(oldIndex, newIndex);
        this.selectedIndex = newIndex;
        this.$nextTick(() => {
          this.$el.querySelectorAll('tr')[newIndex + 1].focus();
        });
      }
    },
    swapRows(oldIndex, newIndex) {
      // 暫存要交換的行
      const temp = this.filteredRows[oldIndex];
      // 交換 filteredRows 中的行
      this.$set(this.filteredRows, oldIndex, this.filteredRows[newIndex]);
      this.$set(this.filteredRows, newIndex, temp);
      // 找到原始 rows 中的索引
      const originalOldIndex = this.rows.indexOf(temp);
      const originalNewIndex = this.rows.indexOf(this.filteredRows[newIndex]);
      // 在原始 rows 中交換行
      this.rows.splice(originalOldIndex, 1);
      this.rows.splice(originalNewIndex, 0, temp);
    }
  }
});

// 掛載 Vue 應用到 DOM 中的 #app 元素
app.mount('#app');