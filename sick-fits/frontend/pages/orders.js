/* eslint-disable no-unused-vars */
import PleaseSignIn from '../components/PleaseSignIn'
import OrderList from '../components/OrderList'

const OrderPage = props => (
  <div>
    <PleaseSignIn>
      <OrderList />
    </PleaseSignIn>
  </div>
)

export default OrderPage
