<template>
  <b-container>
    <b-row class="py-3">
      <b-col cols="4" class="mt-4">
        <b-card title="ActionButton">
          <action-button name="bv-new" variant="primary" @click="echo"></action-button>
          <action-button name="bv-edit" disabled></action-button>
          <action-button name="bv-save" link="save" link-append></action-button>
          <action-button name="bv-cancel" @click="echo"></action-button>
          <action-button name="bv-refresh" variant="dark" size="md" @click="echo"></action-button>
          <action-button name="bv-savemore" variant="info" size="md" @click="echo"></action-button>
          <action-button text="Custom" variant="danger" size="lg" @click="echo"></action-button>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="ActionLink">
          <action-link text="Custom link" link="custom" class="mr-2" @click="echo"></action-link>
          <action-link text="Parent link" icon="arrow-left" link-to-parent></action-link>
          <action-link text="Colored link" variant="danger" class="ml-2"></action-link>
          <action-link icon="x" icon-shift-v="-2" icon-size="1.5" link-to-parent></action-link>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="ActionMenu">
          <action-menu edit-link="/edit" @delete="echo"> </action-menu>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="BoxState - Refresh">
          <box-state
            error
            title="Error!"
            body="Opss... something happens"
            @click="echo"
          ></box-state>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="BoxState - Empty">
          <box-state
            empty
            title="No content"
            body="There is nothing in this box."
            @click="echo"
          ></box-state>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="BoxState - Loading">
          <box-state loading></box-state>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="ActionToggler">
          <action-toggler target="collapsible" text="More" icon-placement="right"></action-toggler>
          <b-collapse id="collapsible"> <span> peek-a-boo </span> </b-collapse>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="TextField">
          <text-field></text-field>
          <text-field :text="text"></text-field>
          <text-field :date="date"></text-field>
          <text-field :money="123456789" currency="myr"></text-field>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Playground',

  data() {
    return {
      // TextField
      text: 'normal text field',
      date: new Date().getTime(),
    }
  },

  methods: {
    echo(msg) {
      alert(msg || 'hello')
    },
  },
}
</script>
