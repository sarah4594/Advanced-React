import Link from 'next/link'
import NavStyles from '../styles/NavStyles'

const SignedOutNav = () => (
  <NavStyles>
    <Link href="/items">
      <a>Shop</a>
    </Link>
    <Link href="/signup">
      <a>Sign In</a>
    </Link>
  </NavStyles>
)

export default SignedOutNav
