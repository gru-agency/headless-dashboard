<template>
  <b-card class="border-0" no-body>
    <box-header :title-text="title">
      <template #right>
        <action-menu
          :primary-key="price?.id"
          no-archive
          no-unarchive
          @edit="promptModal()"
          @delete="remove()"
        ></action-menu>
      </template>
    </box-header>

    <b-card-body>
      <b-row>
        <b-col lg="6">
          <b-row tag="dl" class="mb-0">
            <b-col xl="3" tag="dt"> ID </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="`price_${price?.id}`"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.currency }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="price?.currency.toUpperCase()"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.pricing }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="getPricingText()"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.interval }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="interval"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.rounding }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="roundingText"></text-field> </b-col>
          </b-row>
        </b-col>
        <b-col lg="6">
          <b-row tag="dl" class="mb-0">
            <b-col xl="3" tag="dt"> {{ ui.product }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="product?.name"></text-field> </b-col>
            <b-col xl="3" tag="dt"> {{ ui.updated }} </b-col>
            <b-col xl="9" tag="dd">
              <text-field :date="product.updated" date-format="long"></text-field>
            </b-col>
            <b-col xl="3" tag="dt"> {{ ui.description }} </b-col>
            <b-col xl="9" tag="dd"> <text-field :text="price?.description"></text-field> </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card-body>

    <prices-modal :id="modal.id" :price="modal.price" :product="product?.id"></prices-modal>
  </b-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'InfoCard',

  props: {
    product: { type: Object, default: () => null },
    price: {
      type: Object,
      default: () => {
        return {
          id: null,
          currency: 'myr',
          unitAmount: 0,
          description: null,
          transformQuantity: { divideBy: 0, round: 'up' },
          billingScheme: 'perunit',
          type: 'onetime',
        }
      },
    },
  },

  data() {
    return {
      ui: {
        product: this.$t('general.product'),
        currency: this.$t('general.currency'),
        pricing: this.$t('modules.prices.pricing'),
        interval: this.$t('modules.prices.interval'),
        oneTime: this.$t('modules.prices.oneTime'),
        rounding: this.$t('modules.prices.rounding'),
        roundUp: this.$t('modules.prices.roundUp'),
        roundDown: this.$t('modules.prices.roundDown'),
        description: this.$t('general.description'),
        updated: this.$t('general.updated'),
      },

      // for edit modal
      modal: { id: null, price: null },
    }
  },

  computed: {
    title() {
      return this.$t('modules.prices.infoTitle', { _product: this.product?.name })
    },

    interval() {
      return this.ui.oneTime
    },

    roundingText() {
      return this.price?.transformQuantity?.round === 'up' ? this.ui.roundUp : this.ui.roundDown
    },
  },

  methods: {
    ...mapActions('products', ['removePrice']),

    async remove() {
      if (!this.account) return
      await this.removePrice({ document: this.product, price: this.price, account: this.account })
    },

    async promptModal() {
      this.modal = { id: this.price.id, price: this.price }

      // some buffer for DOM to render, else modal wont show on first click
      setTimeout(() => this.$bvModal.show(this.modal.id), 200)
      await this.$nextTick()
    },

    getPricingText() {
      const { unitAmount, currency, transformQuantity } = this.price
      const { divideBy } = transformQuantity
      const quantity = divideBy === 0 ? 1 : divideBy
      return this.$tc('pluralization.pricePerUnit', quantity, {
        _price: this.$n(unitAmount / 100, { style: 'currency', currency }),
      })
    },
  },
}
</script>
