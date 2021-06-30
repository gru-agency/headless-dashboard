<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card title="Action Button">
          <action-button name="bv-new" variant="primary" @click="echo"></action-button>
          <action-button name="bv-edit" disabled></action-button>
          <action-button name="bv-save" to="/save" @click="echo"></action-button>
          <action-button name="bv-cancel" variant="dark" @click="echo"></action-button>
          <action-button name="bv-refresh" size="sm" @click="echo"></action-button>
          <action-button name="bv-savemore" size="sm" @click="echo"></action-button>
          <action-button text="Custom" variant="danger" size="lg" @click="echo"></action-button>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    echo(msg: string) {
      alert(msg || 'hello')
    },
  },
})
</script>
