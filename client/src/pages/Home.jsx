import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useCartContext } from '../context/CartContext'
import ProductGrid from '../components/product/ProductGrid'
import Button from '../components/common/Button'
import PageLayout from '../components/layout/PageLayout'

const Home = () => {
  const { data: productsResponse } = useProducts({ limit: 8 })
  const { addItem } = useCartContext()
  const products = productsResponse?.data?.products || []

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Same-Day Delivery',
      description: 'Order before 11 AM for same-day delivery',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'Fresh Guarantee',
      description: '7-day freshness guarantee on all arrangements',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Hand-Arranged',
      description: 'Each bouquet crafted by expert florists',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Secure Payment',
      description: 'UPI, Cards, and Net Banking accepted',
    },
  ]

  const occasions = [
    { name: 'Birthday', href: '/shop?occasion=birthday', emoji: '🎂' },
    { name: 'Anniversary', href: '/shop?occasion=anniversary', emoji: '💕' },
    { name: 'Love & Romance', href: '/shop?occasion=love', emoji: '🌹' },
    { name: 'Condolences', href: '/shop?occasion=condolences', emoji: '🤍' },
    { name: 'Congratulations', href: '/shop?occasion=congratulations', emoji: '🎉' },
    { name: 'Get Well Soon', href: '/shop?occasion=get_well', emoji: '🌼' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-floral-blush to-floral-cream">
        <PageLayout padding={false}>
          <div className="grid md:grid-cols-2 gap-8 items-center py-16 md:py-24">
            <div className="px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight">
                Fresh Flowers,
                <span className="text-primary-600"> Delivered with Love</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Hand-arranged bouquets for every occasion. Same-day delivery available for last-minute gifting.
              </p>
              <div className="mt-8 flex gap-4">
                <Link to="/shop">
                  <Button size="lg">Shop Now</Button>
                </Link>
                <Link to="/subscriptions">
                  <Button variant="outline" size="lg">View Subscriptions</Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/placeholder-hero-flowers.jpg"
                alt="Beautiful flower bouquet"
                className="rounded-2xl shadow-elevated w-full h-auto"
              />
            </div>
          </div>
        </PageLayout>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <PageLayout>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </PageLayout>
      </section>

      {/* Occasions Section */}
      <section className="py-16 bg-floral-cream">
        <PageLayout>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              Shop by Occasion
            </h2>
            <p className="text-gray-600 mt-2">
              Find the perfect arrangement for every moment
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {occasions.map((occasion) => (
              <Link
                key={occasion.name}
                to={occasion.href}
                className="group bg-white rounded-xl p-6 text-center shadow-card hover:shadow-soft transition-all"
              >
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
                  {occasion.emoji}
                </span>
                <p className="text-sm font-medium text-gray-900">{occasion.name}</p>
              </Link>
            ))}
          </div>
        </PageLayout>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <PageLayout>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900">
                Featured Bouquets
              </h2>
              <p className="text-gray-600 mt-2">
                Handpicked favorites just for you
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <ProductGrid
            products={products}
            onAddToCart={addItem}
            columns={4}
          />
        </PageLayout>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <PageLayout>
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-white">
              Subscribe & Save
            </h2>
            <p className="text-primary-100 mt-2 max-w-2xl mx-auto">
              Get fresh flowers delivered regularly. Weekly, fortnightly, or monthly plans available.
            </p>
            <div className="mt-8">
              <Link to="/subscriptions">
                <Button variant="secondary" size="lg">
                  Explore Subscription Plans
                </Button>
              </Link>
            </div>
          </div>
        </PageLayout>
      </section>
    </div>
  )
}

export default Home
