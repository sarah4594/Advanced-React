import Link from 'next/link'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null
      return (
        <NavStyles>
          {/* want to show shop no matter what */}
          <Link href="/items">
            <a>Shop</a>
          </Link>
          {/* only want to show sell, orders, and
        account if signed in*/}
          {me && (
            <>
              <Link href="/sell">
                <a>sell</a>
              </Link>
              <Link href="/orders">
                <a>orders</a>
              </Link>
              <Link href="/me">
                <a>{me.name}'s Account</a>
              </Link>
              <Signout />
            </>
          )}
          {/* only want to show sign in if they
        are signed out*/}
          {!me && (
            <Link href="/signup">
              <a>Sign In</a>
            </Link>
          )}
        </NavStyles>
      )
    }}
  </User>
)

export default Nav
