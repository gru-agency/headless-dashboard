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
      <template #cell(price)="{ item }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        <text-field :text="getPricingText(item)"></text-field>
      </template>

      <template #cell(id)="{ item, value }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        <text-field :text="`price_${value}`"></text-field>
      </template>

      <template #cell(updated)="{ item, value }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        <text-field :date="value" date-format="relative"></text-field>
      </template>

      <template #cell(more)="{ item }">
        <action-menu
          :primary-key="item.id"
          no-archive
          no-unarchive
          toggle-class="btn-float"
          @edit="promptModal(item)"
          @delete="remove(item)"
        ></action-menu>
      </template>

      <template #empty>
        <box-state
          state="empty"
          :title="ui.emptyTitle"
          :body="ui.emptySubtitle"
          btn-size="sm"
          btn-variant="primary"
          icon-preset="bv-price"
          modal="price-modal"
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

    <!-- shared modal for price editing -->
    <prices-modal :id="modal.id" :price="modal.price" :product="product"></prices-modal>
  </b-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Table',

  props: {
    datasource: { type: Array, default: () => [] },
    product: { type: String, default: undefined },
  },

  data() {
    return {
      ui: {
        emptyTitle: this.$t('modules.prices.emptyTitle'),
        emptySubtitle: this.$t('modules.prices.emptySubtitle'),
      },
      fields: [
        { key: 'price', label: this.$t('general.price'), tdClass: 'position-relative' },
        { key: 'id', label: 'ID', tdClass: 'position-relative' },
        { key: 'updated', label: this.$t('general.updated'), tdClass: 'w-20p position-relative' },
        { key: 'more', label: '', tdClass: 'w-5p' },
      ],
      currentPage: 1,
      perPage: 10,

      // for edit modal
      modal: { id: null, price: null },
    }
  },

  computed: {
    ...mapGetters('user', ['account']),

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
  },

  methods: {
    ...mapActions('products', ['removePrice']),

    previous() {
      this.currentPage -= 1
    },

    next() {
      this.currentPage += 1
    },

    async remove(item) {
      if (!this.account) return
      await this.removePrice({ document: this.product, price: item, account: this.account })
    },

    async promptModal(item) {
      this.modal = { id: item.id, price: item }

      // some buffer for DOM to render, else modal wont show on first click
      setTimeout(() => this.$bvModal.show(this.modal.id), 200)
      await this.$nextTick()
    },

    getLink(item) {
      return this.localePath({
        name: 'dashboard-products-id-prices-_id',
        params: { id: 'prod_' + this.product, _id: 'price_' + item.id },
      })
    },

    getPricingText(item) {
      const { divideBy } = item.transformQuantity
      const quantity = divideBy === 0 ? 1 : divideBy
      return this.$tc('pluralization.pricePerUnit', quantity, {
        _price: this.$n(item.unitAmount / 100, { style: 'currency', currency: item.currency }),
      })
    },
  },
}
</script>
