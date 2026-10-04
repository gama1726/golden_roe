import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useAuth } from './lib/auth'
import { ArticleEditorPage } from './pages/ArticleEditorPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { ContactsPage } from './pages/ContactsPage'
import { ContentPage } from './pages/ContentPage'
import { DashboardPage } from './pages/DashboardPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { FooterPage } from './pages/FooterPage'
import { LoginPage } from './pages/LoginPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { ServicesPage } from './pages/ServicesPage'
import { SettingsPage } from './pages/SettingsPage'

function RequireAuth() {
  const { user, ready } = useAuth()
  if (!ready) return <p className="p-8 text-sm text-muted">Загрузка…</p>
  if (!user) return <Navigate to="/login" replace />
  return <Layout />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route index element={<DashboardPage />} />
        <Route path="home" element={<ContentPage page="home" title="Главная" />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="author" element={<ContentPage page="author" title="Об авторе" />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:id" element={<ArticleEditorPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="footer" element={<FooterPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
