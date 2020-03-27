import _ from "lodash";
export default {
  data() {
    return {
      page: +this.$route.query.page || 1,
      pageCount: 0,
      allItems: [],
      items: []
    };
  },
  methods: {
    setupPagination(allItems) {
      this.allItems = _.chunk(allItems, 5);
      this.pageCount = this.allItems.length;
      this.items = this.allItems[this.page - 1] || this.allItems[0];
    },
    pageChangeHandler(page) {
      this.$router.push(`${this.$route.path}?page=${page}`);
      this.items = this.allItems[page - 1] || this.allItems[0];
    }
  }
};
