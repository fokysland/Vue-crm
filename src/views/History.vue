<template>
    <div>
        <div class="page-title">
          <h3>{{ 'History' | localize }}</h3>
        </div>
        
        <div class="history-chart">
          <canvas ref="canvas"></canvas>
        </div>

        <Loader v-if="loading"/>

        <p class="center" v-else-if="!records.length">{{ 'NoRecords' | localize }}<router-link to="/record">{{ 'AddNewRecord' | localize }}</router-link></p>
        
        <section v-else>
          <HistoryTable :records="items"/>
          <Paginate
            v-model="page"
            :page-count="pageCount"
            :click-handler="pageChangeHandler"
            :prev-text="'←'"
            :next-text="'→'"
            :container-class="'pagination'"
            :page-class="'waves-effect'"
          />
        </section>
    </div>    
</template>
<script>
import HistoryTable from '@/components/HistoryTable'
import paginationMixin from '../mixins/pagination.mixins'
import localize from '@/filters/localize.filter'
import { Pie } from 'vue-chartjs'

export default {
  name: 'history',
  metaInfo: () => ({
    title: localize('History')
  }),
  mixins: [paginationMixin],
  extends: Pie,
  data: () => ({
    loading: true,
    records: [],
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.setup(categories)
    this.loading = false
  },
  methods: {
    setup(categories) {
      let counter = 1
      this.setupPagination(this.records.map(item => {
        return {
          ...item,
          counter: counter++,
          categoryName: categories.find(c => c.id === item.categoryId).title,
          typeColor: item.type === 'income' ? 'green' : 'red',
          typeText: item.type === 'income' ? localize('Income') : localize('Outcome'),
        }
      }))

      this.renderChart({
        labels: categories.map(item => item.title),
        datasets: [{
          data: categories.map(item => {
            return this.records.reduce((acc, record) => {
              if (record.categoryId === item.id && record.type === 'outcome') {
                return acc + record.amount
              }
              return acc
            }, 0)
          }),
          backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
      })
    }
  },
  components: {
    HistoryTable
  }
}
</script>