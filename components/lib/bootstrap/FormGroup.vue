<template>
  <b-form-group
    :label="label"
    label-align="left"
    label-align-md="right"
    label-cols="12"
    label-cols-md="4"
    content-cols="12"
    content-cols-md="8"
    content-cols-xl="6"
    :description="hint"
  >
    <slot></slot>
  </b-form-group>
</template>

<script>
export default {
  name: 'FormGroup',

  props: {
    label: { type: String, default: undefined },
    hint: { type: String, default: undefined }
  }
}
</script>