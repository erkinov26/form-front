import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@/pages/home'
import { lazy, Suspense } from 'react'
const Registration = lazy(() => import('@/pages/registration'))

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div></div>}>
          <Routes>
            <Route element={<Home />} path='/' />
            <Route element={<Registration />} path='/registration' />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
