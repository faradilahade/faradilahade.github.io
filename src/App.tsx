import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'

/** Routes that render the profile page share one mounted instance so the modal opens over the grid. */
function pageGroup(pathname: string) {
  if (pathname === '/' || pathname.startsWith('/work')) return 'work'
  return pathname
}

export default function App() {
  const { pathname } = useLocation()
  const group = pageGroup(pathname)
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    document.body.classList.toggle('admin-theme', isAdmin)
  }, [isAdmin])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [group])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1" key={group}>
        <Routes>
          {/* Profile + work grid; /work/:slug opens the project modal on top of it */}
          <Route element={<Profile />}>
            <Route path="/" element={<Outlet />} />
            <Route path="/work/:slug" element={<Outlet />} />
          </Route>
          <Route path="/work" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
