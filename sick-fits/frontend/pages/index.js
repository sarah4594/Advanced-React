import Items from '../components/Items'

const Home = props => (
  <div>
    {/* Use the || 1 to fall back on if it's the first page */}
    <Items page={parseFloat(props.query.page) || 1} />
  </div>
)

export default Home
