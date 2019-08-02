import Link from 'next/link'
import NavStyles from '../styles/NavStyles'
import User from '../User'
import Signout from '../Signout'
import SignedOutNav from './SignedOutNav'

const AdminNav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null
      return (
        <NavStyles>
          {me.permissions.includes('ADMIN') && (
            <>
              <Link href="/items">
                <a>Shop</a>
              </Link>
              <Link href="/sell">
                <a>sell</a>
              </Link>
              <Link href="/me">
                <a>{me.name}'s Account</a>
              </Link>
              <Link href="/permissions">
                <a>Permissions</a>
              </Link>
              <Signout />
            </>
          )}
        </NavStyles>
      )
    }}
  </User>
)

export default AdminNav
