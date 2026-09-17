import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'

/** "/", "/work/:slug" and "/articles/:slug" render one mounted Home so the reading modals open over the grid. */
function pageGroup(pathname: string) {
  if (pathname === '/' || pathname.startsWith('/work') || pathname.startsWith('/articles')) return 'home'
  return pathname
}

export default function App() {
  const { pathname, hash } = useLocation()
  const group = pageGroup(pathname)
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group])

  // The admin area has its own shell — no public navbar/footer.
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="site-bg" aria-hidden="true" />
      <div className="site-grid" aria-hidden="true" />
      <Navbar />
      <div className="flex-1" key={group}>
        <Routes>
          <Route element={<Home />}>
            <Route path="/" element={<Outlet />} />
            <Route path="/work/:slug" element={<Outlet />} />
            <Route path="/articles/:slug" element={<Outlet />} />
          </Route>
          <Route path="/work" element={<Navigate to="/#work" replace />} />
          <Route path="/articles" element={<Navigate to="/#articles" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
