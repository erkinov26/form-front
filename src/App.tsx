import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@/pages/home'
import Registration from '@/pages/registration'

// Create a client
const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<Registration />} path='/registration' />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}