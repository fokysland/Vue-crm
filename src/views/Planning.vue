<template>
  <div>
    <div class="page-title">
      <h3>{{ "Planning" | localize }}</h3>
      <h4>{{ info.bill | currency("RUB") }}</h4>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      {{ "NoCategories" | localize
      }}<router-link to="/categories">{{
        "AddNewCategory" | localize
      }}</router-link>
    </p>

    <section v-else>
      <div v-for="c in categories" :key="c.id">
        <p>
          <strong>{{ c.title }}</strong>
          {{ c.spent | currency }} {{ "From" | localize }}
          {{ c.limit | currency }}
        </p>
        <div class="progress" v-tooltip="c.tooltip">
          <div
            class="determinate"
            :class="c.color"
            :style="{ width: c.progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import currencyFilter from "@/filters/currency.filter";
import localize from "@/filters/localize.filter";
export default {
  name: "planning",
  metaInfo: () => ({
    title: localize("Planning")
  }),
  data: () => ({
    loading: true,
    categories: []
  }),
  async mounted() {
    const records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");

    this.categories = categories.map(item => {
      const spent = records
        .filter(rec => rec.categoryId === item.id)
        .filter(rec => rec.type === "outcome")
        .reduce((acc, item) => acc + +item.amount, 0);

      const percent = (100 * spent) / item.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      let color;
      if (percent < 60) {
        color = "green";
      } else if (percent < 90) {
        color = "yellow";
      } else {
        color = "red";
      }

      const tooltipValue = item.limit - spent;
      const tooltip = `${
        tooltipValue >= 0 ? localize("LeftOver") : localize("Excess")
      } ${currencyFilter(Math.abs(tooltipValue))}`;

      return {
        ...item,
        tooltip,
        color,
        progressPercent,
        spent
      };
    });

    this.loading = false;
  },
  computed: {
    ...mapGetters(["info"])
  }
};
</script>
