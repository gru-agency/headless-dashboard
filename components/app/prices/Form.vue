<template>
  <validation-observer ref="priceForm" v-slot="vo">
    <vee-broadcaster :states="vo" @states="onFormStateChanged"></vee-broadcaster>

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
        <b-form-group :label="ui.price" label-for="price-amount">
          <b-input-group :prepend="currencyOptions[0].text">
            <money-field id="price-amount" v-model="form.unitAmount" size="lg"></money-field>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col cols="12" lg="6">
        <validation-provider
          v-if="packagePricing"
          v-slot="vp"
          :name="ui.priceUnit"
          immediate
          rules="integer|min_value:2"
        >
          <b-form-group :label="ui.priceUnit" label-for="price-unit">
            <b-input-group size="lg" :prepend="ui.per" :append="ui.units">
              <b-form-input
                id="price-unit"
                v-model="form.transformQuantity.divideBy"
                :state="$vee.state(vp)"
                size="lg"
                trim
                @focus="$event.target.select()"
              ></b-form-input>
            </b-input-group>
            <b-form-text v-if="$vee.error(vp)">
              <span class="text-danger">
                <icon preset="bv-error" class="mr-2"></icon>{{ $vee.error(vp) }}
              </span>
            </b-form-text>
          </b-form-group>
        </validation-provider>
      </b-col>
    </b-row>

    <div class="position-relative my-6">
      <action-toggler target="more-prices" variant="primary"></action-toggler>
    </div>

    <b-collapse id="more-prices">
      <b-row>
        <b-col cols="12" lg="6">
          <validation-provider v-slot="vp" :name="ui.description" immediate rules="max:128">
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
                trim
              ></b-form-input>
              <b-form-invalid-feedback>
                <span><icon preset="bv-error" class="mr-2"></icon>{{ $vee.error(vp) }}</span>
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
    </b-collapse>

    <b-alert :show="showError" variant="danger">
      <icon preset="bv-error" class="mr-2"></icon> {{ server.message }}
    </b-alert>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

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

      form: {
        id: this.$util.nanoid(),
        currency: 'myr',
        unitAmount: 0,
        description: null,
        transformQuantity: { divideBy: 0, round: 'up' },
        billingScheme: 'perunit',
        type: 'onetime',
      },
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  computed: {
    ...mapGetters('user', ['account']),

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

  watch: { price: { handler: 'populateForm', immediate: true } },

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

    /**
     * Fill up the form if use this form in edit mode. Source may not initialise
     * in time upon render, but expecting non-null value.
     */
    populateForm(value) {
      if (!value) return

      const { updated, transformQuantity, ...form } = value
      this.form = { ...form, transformQuantity: { ...transformQuantity } }
      this.pricing = transformQuantity.divideBy > 1 ? 'package' : 'standard'
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
      const valid = this.validateForm()
      if (!valid) return

      this.resetFormState()

      await this.setPrice({ document: this.product, price: this.form, account: this.account }).then(
        (response) => this.successHandler(response),
        (error) => this.errorHandler(error)
      )
    },

    validateForm() {
      const valid = this.$refs.priceForm.validate()
      this.$emit(this.events.validated, valid)
      return valid
    },

    async resetForm() {
      this.resetFormState()
      this.$refs.priceForm?.reset()
      this.form = {
        id: this.$util.nanoid(),
        currency: 'myr',
        unitAmount: 0,
        description: null,
        transformQuantity: { divideBy: 0, round: 'up' },
        billingScheme: 'perunit',
        type: 'onetime',
      }
      await this.$nextTick()
      this.$emit(this.events.resetted)
    },

    resetFormState() {
      this.server = { validated: false, valid: false, field: null, code: null, message: null }
    },

    onFormStateChanged(states) {
      if (states.validated) this.$emit(this.events.validated, !states.invalid)
    },
  },
}
</script>
