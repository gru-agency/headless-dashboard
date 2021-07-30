<template>
  <div>
    <box-header :title-text="ui.title" class="border-0" new-btn :btn-link="createLink()"></box-header>

    <b-tabs v-model="tabIndex" class="mb-4" @input="fetchData">
      <b-tab :title="ui.active" title-link-class="px-5">
        <products-content-table
          :account="account"
          :datasource="findActiveByOwner(account)"
          :filter-on="filterOn"
          :filter="filter"
        ></products-content-table>
      </b-tab>

      <b-tab :title="ui.archive" title-link-class="px-5" lazy>
        <products-content-table
          :account="account"
          :datasource="findArchiveByOwner(account)"
          :filter-on="filterOn"
          :filter="filter"
        ></products-content-table>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Index',
  layout: 'dashboard',

  data() {
    return {
      ui: {
        title: this.$t('modules.products.title'),
        active: this.$t('general.active'),
        archive: this.$t('general.archive'),
      },
      tabIndex: 0,
      // equivalent as perPage in ContentTable component
      fetchSize: 10,

      // initial fetch spam control, fetch once per tab
      activeFetch: false,
      archiveFetch: false,
    }
  },

  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('products', ['findActiveByOwner', 'findArchiveByOwner', 'findCache']),

    account() {
      return this.user?.account?.id
    },

    activeTab() {
      return this.tabIndex === 0
    },

    archiveTab() {
      return this.tabIndex === 1
    },

    filterOn() {
      return ['active']
    },

    filter() {
      return this.activeTab ? 'true' : 'false'
    },

    fetchControl() {
      return (this.activeTab && !this.activeFetch) || (this.archiveTab && !this.archiveFetch)
    },
  },

  watch: {
    /**
     * Fetch data when account ID is ready. Particularly useful when
     * refresh page, where waiting auth state changed to fetch user.
     */
    account(_new, _old) {
      if (!_old && _new) this.fetchData()
    },
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    ...mapActions('products', ['create', 'list']),

    /**
     * Fetch data based on tab criteria. Allow to fetch once per tab.
     * Intentionally fetch ALL if there are delta changes.
     */
    async fetchData() {
      if (this.account && this.fetchControl) {
        const hash = `${this.filterOn[0]}==${this.filter}`
        const cache = this.findCache(this.account, hash)

        await this.list({
          account: this.account,
          equalQ: {
            field: this.filterOn[0],
            operator: '==',
            value: this.filter === 'true', // convert string to boolean
            hash,
          },
          rangeQ: !cache
            ? null
            : {
                field: 'updated',
                operator: '>',
                value: cache.timestamp,
                hash: `updated>${cache.timestamp}`,
              },
          fetchSize: cache ? null : this.fetchSize,
        })

        this.checkoutFetchControl()
      }
    },

    /**
     * Consume the chance after fetch succeeded
     */
    checkoutFetchControl() {
      if (this.activeTab) this.activeFetch = true
      else if (this.archiveTab) this.archiveFetch = true
    },

    createLink() {
      return this.localePath({ name: 'dashboard-products-create' })
    },
  },
}
</script>
