<template>
  <div>
    <box-header :title-text="ui.title" class="border-0" new-btn :btn-link="createLink"></box-header>

    <products-table :datasource="filter(account)"></products-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Index',
  layout: 'dashboard',

  data() {
    return {
      ui: { title: this.$t('modules.products.title') },

      // fetch spam control, fetch once per page
      fetchAll: false,
    }
  },

  head() {
    return {
      title: this.$t('seo.products', { _brand: this.$config.brandName }),
    }
  },

  computed: {
    ...mapGetters('user', ['account']),
    ...mapGetters('products', ['filter']),

    createLink() {
      return this.localePath({ name: 'dashboard-products-create' })
    },

    canFetch() {
      return !this.fetchAll
    },
  },

  created() {
    this.fetchData()
  },

  methods: {
    ...mapActions('products', ['list']),

    /**
     * Fetch latest data from server per page load.
     */
    async fetchData() {
      if (!this.account) return
      if (!this.canFetch) return

      await this.list({ account: this.account })
      this.checkoutFetchControl()
    },

    /**
     * Consume the chance after fetch succeeded
     */
    checkoutFetchControl() {
      this.fetchAll = true
    },
  },
}
</script>
