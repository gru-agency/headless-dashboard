<template>
  <b-card class="border-0" no-body>
    <b-table
      :items="datasource"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      show-empty
      responsive
      hover
      class="mb-0"
      primary-key="id"
    >
      <template #cell(images)="{ item, value }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        <image-field :image="value[0]" icon-preset="bv-product"></image-field>
      </template>

      <template #cell(product)="{ item }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        <text-field :text="item.name"></text-field>
        <text-field :text="getPricingText(item)" class="text-secondary"></text-field>
      </template>

      <template #cell(active)="{ item, value }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        <tag-field
          :preset="value ? 'bv-active' : 'bv-archive'"
          :variant="value ? 'success' : 'secondary'"
        ></tag-field>
      </template>

      <template #cell(updated)="{ item, value }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        <text-field :date="value" date-format="relative"></text-field>
      </template>

      <template #cell(more)="{ item }">
        <action-menu
          :primary-key="item.id"
          :edit-link="editLink(item)"
          :no-archive="!item.active"
          :no-unarchive="item.active"
          toggle-class="btn-float"
          @delete="remove(item)"
          @archive="archive(item)"
          @unarchive="unarchive(item)"
        ></action-menu>
      </template>

      <template #empty>
        <box-state
          state="empty"
          :title="ui.emptyTitle"
          :body="ui.emptySubtitle"
          :btn-link="createLink"
          btn-size="sm"
          btn-variant="primary"
          icon-preset="bv-product"
          class="h-half-screen"
        ></box-state>
      </template>

      <template #emptyfiltered>
        <box-state state="search" class="h-half-screen" icon-holder></box-state>
      </template>
    </b-table>

    <table-caption
      :current-page="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      @prev="previous"
      @next="next"
    ></table-caption>
  </b-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Table',

  props: { datasource: { type: Array, default: () => [] } },

  data() {
    return {
      ui: {
        emptyTitle: this.$t('modules.products.emptyTitle'),
        emptySubtitle: this.$t('modules.products.emptySubtitle'),
      },
      fields: [
        { key: 'images', label: '', tdClass: 'w-5p position-relative' },
        { key: 'product', label: this.$t('general.product'), tdClass: 'position-relative' },
        { key: 'active', label: this.$t('general.status'), tdClass: 'w-10p position-relative' },
        { key: 'updated', label: this.$t('general.updated'), tdClass: 'w-20p position-relative' },
        { key: 'more', label: '', tdClass: 'w-5p' },
      ],
      currentPage: 1,
      perPage: 10,

      // keep track of last fetched page to reduce unnecessary pagination
      lastNextPage: 1,
    }
  },

  computed: {
    ...mapGetters('user', ['account']),

    createLink() {
      return this.localePath({ name: 'dashboard-products-create' })
    },

    totalRows() {
      return this.datasource.length
    },

    firstItem() {
      const firstItemIndex = this.currentPage * this.perPage - this.perPage
      return this.datasource[firstItemIndex]
    },

    lastItem() {
      const lastPage = Math.ceil(this.totalRows / this.perPage)
      const lastItemIndex =
        this.currentPage === lastPage ? this.totalRows - 1 : this.currentPage * this.perPage - 1
      return this.datasource[lastItemIndex]
    },

    shouldMoveBack() {
      const lastPage = Math.ceil(this.totalRows / this.perPage)
      return this.currentPage > lastPage
    },
  },

  watch: {
    /**
     * Prefetch when datasource changes from empty to loaded.
     */
    datasource: {
      immediate: true,
      handler(value, oldValue) {
        const canFetch = (!oldValue || oldValue.length === 0) && value.length > 0
        if (canFetch) this.fetchNext()
      },
    },

    /**
     * Prefetch on next page.
     */
    currentPage(value) {
      const canFetch = value === this.lastNextPage
      if (canFetch) this.fetchNext()
    },
  },

  methods: {
    ...mapActions('products', ['update', 'delete', 'paginate']),

    previous() {
      this.currentPage -= 1
    },

    next() {
      this.currentPage += 1
    },

    async fetchNext() {
      if (!this.account) return

      this.$log.tag('products').info('[next] Fetching next page.')
      await this.paginate({
        limit: this.perPage,
        account: this.account,
        endBefore: this.lastItem.updated,
      })

      this.lastNextPage++
    },

    async archive(item) {
      if (!this.account) return

      await this.update({
        document: item.id,
        account: this.account,
        payload: { account: this.account, active: false },
      })
    },

    async unarchive(item) {
      if (!this.account) return

      await this.update({
        document: item.id,
        account: this.account,
        payload: { account: this.account, active: true },
      })
    },

    /**
     * Removing the last item of the page should move page back by 1.
     */
    async remove(item) {
      if (!this.account) return
      await this.delete({ document: item.id, account: this.account })
      if (this.shouldMoveBack) this.currentPage--
    },

    getLink(item) {
      return this.localePath({ name: 'dashboard-products-id', params: { id: 'prod_' + item.id } })
    },

    editLink(item) {
      return this.localePath({ name: 'dashboard-products-id-edit', params: { id: 'prod_' + item.id } })
    },

    getPricingText(item) {
      const { prices } = item
      if (prices.length === 0) {
        return this.$tc('pluralization.prices')
      } else if (prices.length > 1) {
        return this.$tc('pluralization.prices', prices.length)
      } else {
        const price = item.prices[0]
        const { divideBy } = price.transformQuantity
        const quantity = divideBy === 0 ? 1 : divideBy
        return this.$tc('pluralization.pricePerUnit', quantity, {
          _price: this.$n(price.unitAmount / 100, { style: 'currency', currency: price.currency }),
        })
      }
    },
  },
}
</script>
