export default function ({ redirect }) {
  if (process.client) {
    return redirect('/playground')
  }
}
