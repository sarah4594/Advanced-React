import AdminNav from './NavBar/AdminNav'
import SignedInNav from './NavBar/SignedInNav'
import SignedOutNav from './NavBar/SignedOutNav'

const Nav = me => (
  <>
    <SignedInNav />
    <SignedOutNav />
    {/* <AdminNav /> */}
  </>
)

export default Nav
