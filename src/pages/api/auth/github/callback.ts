import { handleSuccessfulLogin, passport } from '@server/passport'
import connect from 'next-connect'

export default connect().use(
  passport.initialize(),
  passport.authenticate('github', { failureRedirect: '/login' }),
  handleSuccessfulLogin,
)
