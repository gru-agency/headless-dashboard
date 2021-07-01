<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card title="Action Button">
          <action-button name="bv-new" variant="primary" @click="echo"></action-button>
          <action-button name="bv-edit" disabled></action-button>
          <action-button name="bv-save" link="save" link-append></action-button>
          <action-button name="bv-cancel" @click="echo"></action-button>
          <action-button name="bv-refresh" variant="dark" size="md" @click="echo"></action-button>
          <action-button name="bv-savemore" variant="info" size="md" @click="echo"></action-button>
          <action-button text="Custom" variant="danger" size="lg" @click="echo"></action-button>
        </b-card>
      </b-col>
      <b-col>
        <b-card title="Action Link">
          <action-link text="Custom link" link="custom" class="mr-2" @click="echo"></action-link>
          <action-link text="Parent link" icon="arrow-left" link-to-parent></action-link>
          <action-link text="Colored link" variant="danger" class="ml-2"></action-link>
          <action-link icon="x" icon-shift-v="-2" icon-size="1.5" link-to-parent></action-link>
        </b-card>
      </b-col>
      <b-col>
        <b-card title="Action Menu">
          <action-menu edit-link="/edit" @delete="echo">
            <!-- <b-dd-header id="dropdown-header-label"> Dropdown header </b-dd-header>
            <b-dd-item>ad</b-dd-item>

            <b-dd-group header="123"> <b-dd-item>asdadads</b-dd-item></b-dd-group> -->
          </action-menu>

          <!-- editText: { type: String, default: undefined },
    editLink: { type: String, default: undefined },
    editVariant: { type: String, default: undefined },
    editHide: { type: Boolean, default: false },
    editDisabled: { type: Boolean, default: false },
    editLinkAppend: { type: Boolean, default: false }, -->
        </b-card>
      </b-col>
      <b-col>
        <b-card title="Action Toggler">
          <action-toggler target="collapsible" text="More" icon-placement="right"></action-toggler>
          <b-collapse id="collapsible"> <span> peek-a-boo </span> </b-collapse>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Playground',

  methods: {
    echo(msg) {
      alert(msg || 'hello')
    },
  },
}
</script>
