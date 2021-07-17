<template>
  <div></div>
</template>

<script>
export default {
  name: 'Index',

  // reason for disabled: vue-router will throw error if double redirection
  // impact: only page that support redirection, like user settings page, where
  // user can switch locale, will redirect to new localise page.
  // solution: directly route to destination page
  // middleware: 'alias-route',
}
</script>
