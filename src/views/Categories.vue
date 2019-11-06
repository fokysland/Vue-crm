<template>
    <div>
        <div class="page-title">
            <h3>{{ 'Categories' | localize }}</h3>
        </div>
        <section>
            <Loader v-if="loading"/>
            <div class="row" v-else>
                <CategoryCreate @created="addNewCategory"/>
                <CategoryEdit 
                    v-if="categories.length"
                    :categories="categories" 
                    @updated="updateCategories"
                    @removed="removeCategory"
                    :key="componentKey"
                />
                <p v-else class="center">{{ 'NoCategories' | localize}}</p>
            </div>
        </section>
    </div>
</template>
<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'
export default {
    name: 'categories',
    data: () => ({
        categories: [],
        loading: true,
        componentKey: 0
    }),
    async mounted() {
        this.categories = await this.$store.dispatch('fetchCategories')
        this.loading = false
    },
    methods: {
        addNewCategory(category) {
            this.componentKey++
            this.categories.push(category)
        },
        removeCategory({ id }) {
            this.componentKey++
            this.categories = this.categories.filter(c => c.id !== id)
            if (!this.categories.length) return
            this.limit = this.categories[0].limit
            this.title = this.categories[0].title
        },
        updateCategories(category) {
            this.componentKey++
            const idx = this.categories.findIndex(c => c.id === category.id)
            this.categories[idx].limit = category.limit
            this.categories[idx].title = category.title
        }
    },
    components: {
        CategoryCreate, CategoryEdit
    }
}
</script>