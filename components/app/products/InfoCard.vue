<template>
  <b-card class="border-0" no-body>
    <box-header :title-text="product.name" parent-link :parent-link-text="ui.title">
      <template #right>
        <action-menu
          :primary-key="productId"
          :edit-link="editLink"
          delete-hide
          :no-archive="!product.active"
          :no-unarchive="product.active"
          @archive="archive"
          @unarchive="unarchive"
        ></action-menu>
      </template>
    </box-header>

    <b-card-body>
      <b-row>
        <b-col lg="6">
          <b-row tag="dl" class="mb-0">
            <b-col xl="3" tag="dt"> ID </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="productId"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.name }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="product.name"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.status }} </b-col>
            <b-col xl="9" tag="dd">
              <tag-field v-if="product.active" preset="bv-active" variant="success"></tag-field>
              <tag-field v-if="!product.active" preset="bv-archive" variant="secondary"></tag-field>
            </b-col>
            <b-col xl="3" tag="dt"> {{ ui.created }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :date="product.created.toDate()"></text-field></b-col>
            <b-col xl="3" tag="dt"> {{ ui.updated }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :date="product.updated.toDate()"></text-field></b-col>
          </b-row>
        </b-col>
        <b-col lg="6">
          <b-row tag="dl" class="mb-0">
            <b-col xl="3" tag="dt"> {{ ui.images }} </b-col>
            <b-col xl="9" tag="dd">
              <image-field :images="product.images" icon-preset="bv-product" max="5"></image-field>
            </b-col>
            <b-col xl="3" tag="dt"> {{ ui.description }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="product.description"></text-field> </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'InfoCard',

  data() {
    return {
      ui: {
        title: this.$t('modules.products.title'),
        name: this.$t('general.name'),
        images: this.$t('general.images'),
        created: this.$t('general.created'),
        updated: this.$t('general.updated'),
        status: this.$t('general.status'),
        description: this.$t('general.description'),
      },
      product: {
        id: null,
        created: null,
        updated: null,
        name: null,
        active: false,
        description: null,
        images: [],
      },
    }
  },

  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('products', ['findByProduct']),

    account() {
      return this.user?.account.id
    },

    productId() {
      return this.$route.params.id
    },

    editLink() {
      return this.localePath({ name: 'dashboard-products-id-edit', params: { id: this.productId } })
    },
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    ...mapActions('products', ['update']),

    fetchData() {
      const _product = this.findByProduct(this.productId, this.account)
      if (_product) this.product = _product
    },

    async archive() {
      if (this.account) {
        await this.update({ documentId: this.productId, payload: { account: this.account, active: false } })
      }
    },

    async unarchive() {
      if (this.account) {
        await this.update({ documentId: this.productId, payload: { account: this.account, active: true } })
      }
    },
  },
}
</script>
