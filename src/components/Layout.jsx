import { Outlet } from 'react-router-dom';
import { CartProvider } from '../CartContext.jsx';
import Header from './Header.jsx';
import Logo from './Logo.jsx';

// Shell for every signed-in page: header, page content, footer.
export default function Layout({ user, onLogout }) {
  return (
    <CartProvider>
      <div className="site">
        <Header user={user} onLogout={onLogout} />
        <main className="site-main">
          <Outlet />
        </main>
        <footer className="site-footer">
          <button type="button" className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
          </button>
          <div className="footer-bottom">
            <Logo />
            <p>Demo store. Payments are simulated and no real money is charged.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
