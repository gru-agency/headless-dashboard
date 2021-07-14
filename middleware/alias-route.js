export default function ({ route, redirect, localePath }) {
  const i18nPrefix = '___'
  if (process.client) {
    switch (route.name.split(i18nPrefix)[0]) {
      case 'dashboard-settings':
        return redirect(localePath({ name: 'dashboard-settings-user' }))
      case 'dashboard-users':
        return redirect(localePath({ name: 'dashboard-settings-user' }))
    }
  }
}
