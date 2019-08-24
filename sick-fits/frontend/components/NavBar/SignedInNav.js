import { Mutation } from 'react-apollo'
import Link from 'next/link'
import PropTypes from 'prop-types'
import NavStyles from '../styles/NavStyles'
import Signout from '../Signout'
import { TOGGLE_CART_MUTATION } from '../Cart'
import CartCount from '../CartCount'

const SignedInNav = ({ me }) => (
  <NavStyles>
    <Link href="/items">
      <a>Shop</a>
    </Link>
    <Link href="/orders">
      <a>orders</a>
    </Link>
    <Link href="/me">
      <a>{me.name}'s Account</a>
    </Link>
    {me.permissions.includes('ADMIN') && (
      <>
        <Link href="/sell">
          <a>Sell</a>
        </Link>
        <Link href="/permissions">
          <a>Permissions</a>
        </Link>
      </>
    )}
    <Signout />
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {toggleCart => (
        <button onClick={toggleCart}>
          My Cart
          <CartCount
            count={me.cart.reduce(
              (tally, CartItem) => tally + CartItem.quantity,
              0,
            )}
          />
        </button>
      )}
    </Mutation>
  </NavStyles>
)

SignedInNav.propTypes = {
  me: PropTypes.object.isRequired,
}

export default SignedInNav
