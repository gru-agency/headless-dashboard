<template>
  <validation-observer ref="priceForm">
    <b-row>
      <b-col cols="12" lg="6">
        <b-form-group label-for="price-model">
          <template #label>
            {{ ui.pricing }} <prices-pricing-tips :pricing="pricingOptions"></prices-pricing-tips>
          </template>
          <b-form-select
            id="price-model"
            v-model="pricing"
            :options="pricingOptions"
            size="lg"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" lg="6">
        <validation-provider v-slot="vp" :name="ui.price" rules="required">
          <b-form-group :label="ui.price" label-for="price-amount">
            <b-input-group :prepend="currencyOptions[0].text">
              <money-field id="price-amount" v-model="form.unitAmount" size="lg"></money-field>
            </b-input-group>
            <form-feedback v-if="$vee.error(vp)" :msg="$vee.error(vp)" compat></form-feedback>
          </b-form-group>
        </validation-provider>
      </b-col>

      <b-col cols="12" lg="6">
        <validation-provider
          v-if="packagePricing"
          v-slot="vp"
          :name="ui.priceUnit"
          rules="integer|min_value:2"
        >
          <b-form-group :label="ui.priceUnit" label-for="price-unit">
            <b-input-group size="lg" :prepend="ui.per" :append="ui.units">
              <b-form-input
                id="price-unit"
                v-model="form.transformQuantity.divideBy"
                :state="$vee.state(vp)"
                size="lg"
                lazy
                trim
                @focus="$event.target.select()"
              ></b-form-input>
            </b-input-group>
            <form-feedback v-if="$vee.error(vp)" :msg="$vee.error(vp)" compat></form-feedback>
          </b-form-group>
        </validation-provider>
      </b-col>
    </b-row>

    <action-toggler target="more-prices" variant="primary">
      <template #collapsible>
        <b-row>
          <b-col cols="12" lg="6">
            <validation-provider v-slot="vp" :name="ui.description" rules="max:128">
              <b-form-group label-for="price-desc">
                <template #label>
                  {{ ui.description }}
                  <tips-field preset="bv-info" class="px-1"> {{ ui.descriptionTips }} </tips-field>
                  <tag-field preset="bv-optional"></tag-field>
                </template>
                <b-form-input
                  id="price-desc"
                  v-model="form.description"
                  :state="$vee.state(vp)"
                  size="lg"
                  lazy
                  trim
                ></b-form-input>
                <form-feedback :msg="$vee.error(vp)"></form-feedback>
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>
      </template>
    </action-toggler>

    <b-alert :show="showError" variant="danger">
      <icon preset="bv-error" class="mr-2"></icon> {{ server.message }}
    </b-alert>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Form',

  props: {
    price: { type: Object, default: () => undefined },
    product: { type: String, default: undefined },
  },

  data() {
    return {
      events: {
        validate: 'price-validate',
        submit: 'price-submit',
        reset: 'price-reset',
        validated: 'validated',
        submitted: 'submitted',
        resetted: 'resetted',
        changed: 'changed',
      },
      ui: {
        pricing: this.$t('modules.prices.pricingModel'),
        per: this.$t('general.per'),
        units: this.$t('general.units'),
        price: this.$t('general.price'),
        priceUnit: this.$t('modules.prices.priceUnit'),
        description: this.$t('general.description'),
        descriptionTips: this.$t('modules.prices.descriptionTips'),
      },

      // pricing model
      pricing: 'standard',
      pricingOptions: [
        {
          value: 'standard',
          text: this.$t('modules.prices.standardPricing'),
          tips: this.$t('modules.prices.standardPricingTips'),
        },
        {
          value: 'package',
          text: this.$t('modules.prices.packagePricing'),
          tips: this.$t('modules.prices.packagePricingTips'),
        },
      ],

      // currency
      currencyOptions: [{ value: 'myr', text: 'MYR' }],

      form: {},
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  computed: {
    ...mapGetters('user', ['account']),
    ...mapState('prices', { initialPrice: 'price' }),

    editMode() {
      return !!this.price
    },

    packagePricing() {
      return this.pricing === 'package'
    },

    showError() {
      const { validated, valid, field } = this.server
      return validated && !valid && !field
    },
  },

  watch: {
    price: { immediate: true, handler: 'populateForm' },
    form: { deep: true, handler: 'onFormChanged' },
  },

  mounted() {
    this.$nuxt.$on(this.events.validate, this.validateForm)
    this.$nuxt.$on(this.events.submit, this.submitForm)
    this.$nuxt.$on(this.events.reset, this.resetForm)
  },

  beforeDestroy() {
    this.$nuxt.$off(this.events.validate)
    this.$nuxt.$off(this.events.submit)
    this.$nuxt.$off(this.events.reset)
  },

  methods: {
    ...mapActions('products', ['setPrice']),

    populateForm(value, oldValue) {
      if (value && !oldValue) {
        this.form = this._.cloneDeep(value)
        this.pricing = this.form.transformQuantity.divideBy > 1 ? 'package' : 'standard'
      } else if (!value && !oldValue) this.form = this.$_.cloneDeep(this.initialPrice)
    },

    onFormChanged(value) {
      this.$emit(this.events.changed, value)
    },

    errorHandler(error) {
      this.server = {
        ...this.server,
        validated: true,
        valid: false,
        code: error.code,
        message: this.$t('general.error5xx'),
      }

      this.$emit(this.events.submitted, false, this.server)
    },

    successHandler(response) {
      this.server = { ...this.server, validated: true, valid: true }
      this.$emit(this.events.submitted, true, null, response)
      this.resetForm()
    },

    async submitForm() {
      const valid = await this.validateForm()
      if (!valid) return

      this.resetFormState()

      await this.setPrice({ document: this.product, price: this.form, account: this.account }).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
    },

    async validateForm() {
      const valid = await this.$refs.priceForm.validate()
      this.$emit(this.events.validated, valid, this.form.id)
      return valid
    },

    resetForm() {
      this.resetFormState()
      this.form = this.$_.cloneDeep(this.initialPrice)
      this.$refs.priceForm?.reset()
      this.$emit(this.events.resetted)
    },

    resetFormState() {
      this.server = { validated: false, valid: false, field: null, code: null, message: null }
    },
  },
}
</script>
