<template>
  <b-form-input
    :id="id"
    ref="inputRef"
    :value="formattedValue"
    :plaintext="plaintext"
    @focus="$event.target.select()"
  ></b-form-input>
</template>

<script>
import { watch } from '@vue/composition-api'
import useCurrencyInput from 'vue-currency-input'

export default {
  name: 'MoneyField',

  props: {
    id: { type: String, default: undefined },
    value: { type: [Number, String], default: 0 },
    plaintext: { type: Boolean, default: false },

    options: {
      type: Object,
      default() {
        return {
          currency: 'MYR',
          locale: 'en',
          currencyDisplay: 'hidden',
          // precision: 2,
          autoDecimalDigits: true,
          hideCurrencySymbolOnFocus: true,
          hideGroupingSeparatorOnFocus: false,
          hideNegligibleDecimalDigitsOnFocus: false,
          exportValueAsInteger: true,
          valueRange: {
            min: 0,
            max: 1000000,
          },
          autoSign: true,
          useGrouping: false,
        }
      },
    },
  },

  setup(props) {
    const { inputRef, formattedValue, setOptions, setValue } = useCurrencyInput(props.options)

    watch(
      () => props.value,
      (value) => {
        setValue(value)
      }
    )

    watch(
      () => props.options,
      (options) => {
        setOptions(options)
      }
    )

    return { inputRef, formattedValue }
  },
}
</script>
