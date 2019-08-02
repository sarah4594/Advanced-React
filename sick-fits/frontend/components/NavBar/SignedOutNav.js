import Link from 'next/link'
import NavStyles from '../styles/NavStyles'
import User from '../User'

const SignedOutNav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null
      return (
        <NavStyles>
          {!me && (
            <>
              <Link href="/items">
                <a>Shop</a>
              </Link>
              <Link href="/signup">
                <a>Sign In</a>
              </Link>
            </>
          )}
        </NavStyles>
      )
    }}
  </User>
)

export default SignedOutNav
