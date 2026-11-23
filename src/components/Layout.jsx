import { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { CartProvider } from '../CartContext.jsx';
import Header from './Header.jsx';
import Logo from './Logo.jsx';

// Shell for every signed-in page: header, page content, footer.
export default function Layout({ user, onLogout, sessionNotice }) {
  const mainRef = useRef(null);

  // Lets keyboard users jump past the header without changing the address.
  const skipToMain = (e) => {
    e.preventDefault();
    mainRef.current?.focus();
    mainRef.current?.scrollIntoView();
  };

  return (
    <CartProvider>
      <div className="site">
        <a href="#main-content" className="skip-link" onClick={skipToMain}>
          Skip to main content
        </a>
        <Header user={user} onLogout={onLogout} />
        <main id="main-content" className="site-main" tabIndex={-1} ref={mainRef}>
          {sessionNotice}
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
