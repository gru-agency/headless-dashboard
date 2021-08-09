<template>
  <b-card class="border-0" no-body>
    <box-header :title-text="product.name" parent-link :parent-link-text="ui.title">
      <template #right>
        <action-menu
          :primary-key="objectId"
          :edit-link="editLink"
          :no-archive="!product.active"
          :no-unarchive="product.active"
          @delete="remove"
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
            <b-col xl="9" tag="dd"> <text-field :text="`prod_${objectId}`"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.name }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="product.name"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.status }} </b-col>
            <b-col xl="9" tag="dd">
              <tag-field v-if="product.active" preset="bv-active" variant="success"></tag-field>
              <tag-field v-if="!product.active" preset="bv-archive" variant="secondary"></tag-field>
            </b-col>
            <b-col xl="3" tag="dt"> {{ ui.created }} </b-col>
            <b-col xl="9" tag="dd">
              <text-field :date="product.created" date-format="long"></text-field>
            </b-col>
            <b-col xl="3" tag="dt"> {{ ui.updated }} </b-col>
            <b-col xl="9" tag="dd">
              <text-field :date="product.updated" date-format="long"></text-field>
            </b-col>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'InfoCard',

  props: {
    product: {
      type: Object,
      default: () => {
        return {
          id: null,
          created: null,
          updated: null,
          name: null,
          active: false,
          description: null,
          images: [],
        }
      },
    },
  },

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
    }
  },

  computed: {
    ...mapGetters('user', ['account']),

    objectId() {
      const parts = this.$route.params.id.split('_')
      return parts.length === 2 ? parts[1] : parts[0]
    },

    editLink() {
      return this.localePath({ name: 'dashboard-products-id-edit', params: { id: 'prod_' + this.objectId } })
    },
  },

  methods: {
    ...mapActions('products', ['update', 'delete']),

    async archive() {
      if (!this.account) return

      await this.update({
        document: this.objectId,
        account: this.account,
        payload: { account: this.account, active: false },
      })
    },

    async unarchive() {
      if (!this.account) return

      await this.update({
        document: this.objectId,
        account: this.account,
        payload: { account: this.account, active: true },
      })
    },

    async remove() {
      if (!this.account) return
      await this.delete({ document: this.objectId, account: this.account })
      this.routeBack()
    },

    routeBack() {
      this.$router.replace(this.localePath({ name: 'dashboard-products' }))
    },
  },
}
</script>
