<template>
  <validation-observer ref="productForm" tag="form">
    <validation-provider v-slot="vp" :name="ui.name" rules="required|max:128">
      <b-form-group label-for="prod-name">
        <template #label>
          {{ ui.name }}
          <tips-field preset="bv-info" class="px-1"> {{ ui.nameTips }} </tips-field>
          <tag-field preset="bv-required"></tag-field>
        </template>
        <b-input id="prod-name" v-model="form.name" :state="$vee.state(vp)" size="lg" lazy trim></b-input>
        <form-feedback :msg="$vee.error(vp)"></form-feedback>
      </b-form-group>
    </validation-provider>

    <b-form-group label-for="prod-desc">
      <template #label>
        {{ ui.description }}
        <tips-field preset="bv-info" class="px-1"> {{ ui.descriptionTips }} </tips-field>
        <tag-field preset="bv-optional"></tag-field>
      </template>
      <b-textarea id="prod-desc" v-model="form.description" size="lg" rows="5" lazy trim></b-textarea>
    </b-form-group>
  </validation-observer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Form',

  props: {
    product: { type: Object, default: () => undefined },
  },

  data() {
    return {
      events: {
        validate: 'product-validate',
        submit: 'product-submit',
        reset: 'product-reset',
        validated: 'validated',
        submitted: 'submitted',
        resetted: 'resetted',
        changed: 'changed',
      },
      ui: {
        title: this.$t('modules.products.title'),
        name: this.$t('general.name'),
        description: this.$t('general.description'),
        nameTips: this.$t('modules.products.nameTips'),
        descriptionTips: this.$t('modules.products.descriptionTips'),
      },
      form: { name: null, description: null },
      server: { validated: false, valid: false, field: null, code: null, message: null },
    }
  },

  computed: {
    ...mapGetters('user', ['account']),

    showError() {
      const { validated, valid, field } = this.server
      return validated && !valid && !field
    },
  },

  watch: {
    product: { immediate: true, handler: 'populateForm' },
    form: { deep: true, handler: 'onFormChanged' },
  },

  mounted() {
    this.$nuxt.$on(this.events.validate, this.validateForm)
    this.$nuxt.$on(this.events.reset, this.resetForm)
  },

  beforeDestroy() {
    this.$nuxt.$off(this.events.validate)
    this.$nuxt.$off(this.events.reset)
  },

  methods: {
    populateForm(value, oldValue) {
      if (value && !oldValue) this.form = this._.cloneDeep(value)
    },

    onFormChanged(value) {
      this.$emit(this.events.changed, value)
    },

    async validateForm() {
      const valid = await this.$refs.productForm.validate()
      this.$emit(this.events.validated, valid)
      return valid
    },

    resetForm() {
      this.server = { validated: false, valid: false, field: null, code: null, message: null }
      this.form = { name: null, description: null }
      this.$refs.productForm?.reset()
      this.$emit(this.events.resetted)
    },
  },
}
</script>
