
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { layoutRouter } from './pages/layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={layoutRouter} />
    </QueryClientProvider>
    </>)
}

export default App

