import dynamic from 'next/dynamic'
import App from '../survey/AI_sentiment'

// Optionally use dynamic import with SSR disabled if needed
// const App = dynamic(() => import('../survey/AI_sentiment'), { ssr: false })

export default function Home() {
  return (
    <div>
      <App />
    </div>
  )
}

