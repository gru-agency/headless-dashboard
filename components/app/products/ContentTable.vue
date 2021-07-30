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

      <template #cell(name)="{ item, value }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        {{ value }}
      </template>

      <template #cell(updated)="{ item, value }">
        <b-link :to="getLink(item)" class="stretched-link"> </b-link>
        {{ $dayjs.factory(value).fromNow() }}
      </template>

      <template #cell(more)="{ item }">
        <action-menu
          :primary-key="item.id"
          :edit-link="editLink(item)"
          :no-archive="!item.active"
          :no-unarchive="item.active"
          delete-hide
          @archive="archive(item)"
          @unarchive="unarchive(item)"
        >
        </action-menu>
      </template>

      <template #empty>
        <box-state state="search" class="h-half-screen" icon-holder></box-state>
      </template>

      <template #emptyfiltered>
        <box-state state="search" class="h-half-screen" icon-holder></box-state>
      </template>
    </b-table>

    <table-caption
      :current-page="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      :force-next="lazyMode"
      @prev="previous"
      @next="next"
    ></table-caption>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'ContentTable',

  props: {
    account: { type: String, default: undefined },
    datasource: { type: Array, default: () => [] },
    filterOn: { type: Array, default: () => [] },
    filter: { type: String, default: undefined },
  },

  data() {
    return {
      ui: {
        title: this.$t('modules.products.title'),
        prev: this.$t('general.previous'),
        next: this.$t('general.next'),
      },
      fields: [
        { key: 'images', label: '', tdClass: 'w-5p position-relative' },
        { key: 'name', label: this.$t('general.name'), tdClass: 'position-relative' },
        {
          key: 'updated',
          label: this.$t('general.updated'),
          formatter: (value) => value.toDate().getTime(),
          sortByFormatted: true,
          tdClass: 'w-20p position-relative',
        },
        { key: 'more', label: '', tdClass: 'w-5p' },
      ],
      currentPage: 1,
      perPage: 10,

      // enable lazy fetch by default, disable until fully fetched
      lazyMode: true,
    }
  },

  computed: {
    ...mapState('products', ['caches']),
    ...mapGetters('products', ['findActiveByOwner', 'findArchiveByOwner']),

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
    ...mapActions('products', ['update', 'paginate']),

    previous() {
      this.currentPage -= 1
    },

    async next() {
      if (this.account) {
        const result = await this.paginate({
          account: this.account,
          equalQ: {
            field: this.filterOn[0],
            operator: '==',
            value: this.filter === 'true', // convert string to boolean
            hash: `${this.filterOn[0]}==${this.filter}`,
          },
          rangeQ: {
            field: 'updated',
            operator: '<',
            value: this.lastItem.updated,
            hash: `updated<${this.lastItem.updated}`,
          },
          fetchSize: this.perPage,
        })

        if (result.length > 0) this.currentPage += 1
        else this.lazyMode = false
      }
    },

    async archive(item) {
      if (this.account) {
        await this.update({ documentId: item.id, payload: { account: this.account, active: false } })
      }
    },

    async unarchive(item) {
      if (this.account) {
        await this.update({ documentId: item.id, payload: { account: this.account, active: true } })
      }
    },

    getLink(item) {
      return this.localePath({ name: 'dashboard-products-id', params: { id: item.id } })
    },

    editLink(item) {
      return this.localePath({ name: 'dashboard-products-id-edit', params: { id: item.id } })
    },
  },
}
</script>
