import SignedInNav from './NavBar/SignedInNav'
import SignedOutNav from './NavBar/SignedOutNav'
import User from './User'

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null
      if (!me) return <SignedOutNav />
      return <SignedInNav me={me} />
    }}
  </User>
)

export default Nav
