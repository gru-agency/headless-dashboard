<template>
  <b-container>
    <b-row class="py-3">
      <b-col cols="4" class="mt-4">
        <b-card title="ActionToggler">
          <action-toggler target="collapsible" text="More" icon-placement="right"></action-toggler>
          <b-collapse id="collapsible"> <span> peek-a-boo </span> </b-collapse>
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
          <box-state error title="Error!" body="Opss.. something happens" @click="echo"></box-state>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="BoxState - Empty">
          <box-state empty title="No content" body="Nothing's here." @click="echo"></box-state>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="BoxState - Loading">
          <box-state loading></box-state>
        </b-card>
      </b-col>
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
        <b-card title="TextField">
          <text-field></text-field>
          <text-field :text="text"></text-field>
          <text-field :date="date"></text-field>
          <text-field :money="123456789" currency="myr"></text-field>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="ImageField">
          <div class="mt-2"><image-field :icon="icon"></image-field></div>
          <div class="mt-2"><image-field :image="images[0]"></image-field></div>
          <div class="mt-2"><image-field :images="images" max="3"></image-field></div>
          <div class="mt-2"><image-field :images="images"></image-field></div>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="TagField">
          <tag-field name="bv-optional"></tag-field>
          <tag-field name="bv-required"></tag-field>
          <tag-field text="custom" variant="primary"></tag-field>
          <tag-field text="custom" variant="info"></tag-field>
          <tag-field text="custom" variant="dark"></tag-field>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="TipsField">
          <tips-field> {{ text }} </tips-field>
          <tips-field placement="top" trigger="hover"> {{ text }} </tips-field>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="Reserved"> </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="BoxHeader - List">
          <box-header title-text="Products" no-border new-btn @new="echo"> </box-header>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="BoxHeader - View">
          <box-header
            title-text="Products"
            no-border
            edit-btn
            btn-link="/edit"
            parent-link
            parent-link-text="Products"
          >
          </box-header>
        </b-card>
      </b-col>
      <b-col cols="4" class="mt-4">
        <b-card title="BoxHeader - Custom">
          <box-header title-text="Custom" subtitle-text="Hello">
            <template #right>
              <action-menu edit-link="/edit" @delete="echo"> </action-menu>
            </template>
          </box-header>
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

      // image field
      icon: 'box-seam',
      images: [
        'http://placekitten.com/72/72',
        'http://placekitten.com/73/73',
        'http://placekitten.com/74/74',
        'http://placekitten.com/75/75',
        'http://placekitten.com/76/76',
      ],
    }
  },

  methods: {
    echo(msg) {
      alert(msg || 'hello')
    },
  },
}
</script>
