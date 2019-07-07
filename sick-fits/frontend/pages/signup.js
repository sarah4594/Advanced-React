import Signup from '../components/Signup'
import Signin from '../components/Signin'
import styled from 'styled-components'

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`

// Must make it a different name than the component
const SignupPage = props => (
  <Columns>
    <Signup />
    <Signin />
  </Columns>
)

export default SignupPage
