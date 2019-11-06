<template>
    <div>
		<Loader v-if="loading" />
		<p class="center" v-else-if="!record">
			<strong>{{ 'NoRecordOnId_1' | localize }}{{ $route.params.id }}{{ 'NoRecordOnId_2' | localize }}</strong>
		</p>
      <div v-else>
        <div class="breadcrumb-wrap">
			<router-link to="/history" class="breadcrumb" style="cursor: pointer">{{ 'History' | localize }}</router-link>
			<a class="breadcrumb">
				{{ record.typeText }}
			</a>
        </div>
        <div class="row">
			<div class="col s12 m6">
				<div class="card" :class="record.typeColor"><div class="card-content white-text">
					<p>{{ 'Description' | localize }} {{ record.description }}</p>
					<p>{{ 'Sum' | localize }}{{ record.amount | currency }}</p>
					<p>{{ 'Category' | localize }} {{ record.categoryName }}</p>
					<small>{{ record.date | date('datetime') }}</small>
				</div>
			</div>
		</div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'detail-record',
  data: () => ({
      record: null,
      loading: true
  }),
  async mounted() {
		const id = this.$route.params.id
		const record = await this.$store.dispatch('fetchRecordById', id)
		const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

		this.record = {
			...record,
			typeColor: record.type === 'income' ? 'green' : 'red',
			typeText: record.type === 'income' ? 'Доход' : 'Расход',
			categoryName: category.title
		}

		this.loading = false
  }
}
</script>