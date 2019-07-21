import { Mutation } from 'react-apollo'
import Link from 'next/link'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'
import { TOGGLE_CART_MUTATION } from './Cart'
import CartCount from './CartCount'
import CartItem from './CartItem'

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
