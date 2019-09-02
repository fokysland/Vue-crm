<template>
    <div class="col s12 m6">
        <div>
            <div class="page-subtitle">
                <h4>Изменить</h4>
            </div>
            <form>
				<div class="input-field">
                    <select ref="select" id="select" v-model="current">
						<option 
							v-for="c of categories" 
							:key="c.id" 
							:value="c.id"
							>{{ c.title }}
						</option>
					</select>
                </div>
                <div class="input-field">
                	<input
                	    id="name"
                	    type="text"
						v-model="title"
						:class="{ invalid: ($v.title.$dirty && !$v.title.required) }"
                	>
                	<label for="name">Название</label>
                	<span 
						v-if="$v.title.$dirty && !$v.title.required"
						class="helper-text invalid"
					>Введите название категории</span>
            	</div>

              	<div class="input-field">
                	<input
                	    id="limit"
                	    type="number"
						v-model.number="limit"
						:class="{ invalid: ($v.limit.$dirty && !$v.limit.minValue) }"
                	>
                	<label for="limit">Лимит</label>
                	<span 
						class="helper-text invalid"
						v-if="$v.title.$dirty && !$v.title.minValue"
					>Минимальное значение {{ $v.limit.$params.minValue.min }}
					</span>
            	</div>
                <button class="btn waves-effect waves-light" @click="change" type="button">
                    Изменить
                    <i class="material-icons right">send</i>
                </button>
				<button class="btn waves-effect waves-light" @click="remove" style="margin-left: 1vw" type="button">
                    Удалить
                	<i class="material-icons right">delete</i>
                </button>
            </form>
        </div>
    </div>
</template>
<script>
import { required, minValue } from 'vuelidate/lib/validators/'

export default {
	props: {
		categories: {
			type: Array,
			required: true
		}
	},
	methods: {
		async change() {
			if (this.$v.$invalid) {
				this.$v.touch()
				return
			}

			try {
				const categoryData = {
					id: this.current, 
					title: this.title, 
					limit: this.limit
				}
				await this.$store.dispatch('updateCategory', categoryData)
				this.$message('Категория обновлена')
				this.$emit('updated', categoryData)
			} catch(e) {}
		},
		async remove() {
			try {
				const categoryData = {
					id: this.current, 
					title: this.title, 
					limit: this.limit
				}
				await this.$store.dispatch('removeCategory', categoryData)
				this.$message('Категория удалена')
				this.$emit('removed', categoryData)
			} catch(e) {}
		},
	},
	data: () => ({
		select: null,
		title: '',
		limit: 100,
		current: null
	}),
	mounted() {
		M.updateTextFields()
		this.select = M.FormSelect.init(this.$refs.select)
	},
	watch: {
		current(id) {
			const { title, limit } = this.categories.find(item => item.id === id)
			this.title = title
			this.limit = limit
		}
	},
	created() {
		const { id, title, limit } = this.categories[0]
		this.current = id
		this.title = title
		this.limit = limit
	},
	destroyed() {
		if (this.select && this.select.destroy) this.select.destroy()
	},
	validations: {
		title: { required },
		limit: { required, minValue: minValue(100) }
	}
}
</script>