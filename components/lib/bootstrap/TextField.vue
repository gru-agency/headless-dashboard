<template>
  <b-form-input
    :value="date ? formatDate() : money ? formatCurrency() : text || def.none"
    plaintext
    class="p-0 text-field"
  ></b-form-input>
</template>

<script>
export default {
  name: 'TextField',

  props: {
    text: { type: String, default: undefined },
    date: { type: Date, default: undefined },
    money: { type: [Number, String], default: undefined },
    currency: { type: String, default: undefined },
    locale: { type: String, default: undefined },
  },

  data() {
    return { def: { none: '—' } }
  },

  methods: {
    formatDate() {
      return this.$d(this.date, 'short', this.locale)
    },

    formatCurrency() {
      return this.$n(this.money, 'currency', this.locale)
    },
  },
}
</script>

<style lang="scss" scoped>
.text-field:focus-visible {
  outline: 0;
}
</style>
