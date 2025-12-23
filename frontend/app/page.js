export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Food Delivery Application</h1>
      <p>Welcome to the Food Delivery App!</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Available Routes:</h2>
        <ul>
          <li><a href="/orders">Orders</a></li>
          <li><a href="/restaurant">Restaurants</a></li>
        </ul>
      </div>
    </main>
  )
}



