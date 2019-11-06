<template>
    <div>
        <div class="page-title">
          <h3>{{ 'NewRecord' | localize }}</h3>
        </div>

        <Loader v-if="loading" />

        <p class="center" v-else-if="!categories.length">{{ 'NoCategories' | localize }}<router-link to="/categories">{{ 'AddNewCategory' | localize }}</router-link></p>
        
        <form class="form" v-else @submit.prevent="submitHandler">
          <div class="input-field" >
            <select ref="select" v-model="category">
              <option
                v-for="c in categories"
                :key="c.id"
                :value="c.id"
              >{{ c.title }}</option>
            </select>
            <label>{{ 'CategoryChoose' | localize }}</label>
          </div>
          <p>
            <label>
              <input
                class="with-gap"
                name="type"
                type="radio"
                value="income"
                v-model="type"
              />
              <span>{{ 'Income' | localize }}</span>
            </label>
          </p>
        
          <p>
            <label>
              <input
                class="with-gap"
                name="type"
                type="radio"
                value="outcome"
                v-model="type"
              />
              <span>{{ 'Outcome' | localize }}</span>
            </label>
          </p>
        
          <div class="input-field">
            <input
              id="amount"
              type="number"
              v-model.number = "amount"
              :class="{ invalid: ($v.amount.$dirty && !$v.amount.minValue) }"
            >
            <label for="amount">{{ 'Sum' | localize }}</label>
            <span class="helper-text invalid" v-if="$v.amount.$dirty && !$v.amount.minValue">{{ 'MinValue' }} {{ $v.amount.$params.minValue.min }}</span>
          </div>
        
          <div class="input-field">
            <input
              id="description"
              type="text"
              v-model = "description"
              :class="{ invalid: ($v.description.$dirty && !$v.description.required) }"
            >
            <label for="description">{{ 'Description' | localize }}</label>
            <span
              class="helper-text invalid" v-if="$v.description.$dirty && !$v.description.required">{{ 'DescriptionRequired' | localize }}</span>
          </div>
        
          <button class="btn waves-effect waves-light" type="submit">
            {{ 'Create' | localize }}
            <i class="material-icons right">send</i>
          </button>
        </form>
    </div>

</template>
<script>
import { required, minValue } from 'vuelidate/lib/validators/'
import { mapGetters } from 'vuex'
import localize from '@/filters/localize.filter'
export default {
  name: 'record',
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    amount: 0,
    description: '',
    type: 'income'
  }),
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    if (this.categories.length) this.category = this.categories[0].id
    this.loading = false
    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select)
      M.updateTextFields()
    }, 0)
  },
  destroyed() {
    if (this.select && this.select.destroy) this.select.destroy()
  },
  validations: {
    amount: { required, minValue: minValue(10) },
    description: { required }
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      
      try {
        if (this.canCreateRecord) {
        await this.$store.dispatch('createRecord', {
          categoryId: this.category,
          amount: this.amount,
          description: this.description,
          type: this.type,
          date: new Date().toJSON()
        })
        const bill = this.type === 'income' 
        ? this.info.bill + this.amount 
        : this.info.bill - this.amount

        await this.$store.dispatch('updateInfo', { bill })
        this.$message(localize('RecordCreated'))
        this.$v.$reset()
        this.amount = 0
        this.description = ''
        } else {
          this.$message(`${localize('NotEnoughMoney')} (${this.amount - this.info.bill})`);
        }
      } catch(e) {}
    }
  }
}
</script>