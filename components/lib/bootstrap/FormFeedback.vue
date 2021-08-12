<template>
  <b-form-text v-if="compat">
    <slot>
      <span class="text-danger"><icon preset="bv-error" class="mr-1"></icon>{{ msg }}</span>
    </slot>
  </b-form-text>

  <b-form-invalid-feedback v-else>
    <slot>
      <span><icon preset="bv-error" class="mr-1"></icon>{{ msg }}</span>
    </slot>
  </b-form-invalid-feedback>
</template>

<script>
export default {
  name: 'FormFeedback',

  props: {
    compat: { type: Boolean, default: false },
    msg: { type: String, default: undefined },
  },
}
</script>
