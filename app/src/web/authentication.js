export default function (req, res, next) {
  // Skip auth in development.
  // Everytime app crashes, need to login again :-/
  next()

  // if (req.session.user || req.path === '/login') {
  //   next()
  // } else {
  //   if (req.xhr) {
  //     res.status(401).json({ error: 'Not authenticated. Please login and try again.' })
  //   } else {
  //     res.redirect('/login')
  //   }
  // }
}
