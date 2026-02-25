import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const SidebarLayout = ({ links, title, children }) => {
  const { pathname } = useLocation();
  const { logout, auth } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>{title}</h2>
        <p>{auth?.user?.companyName || auth?.user?.name}</p>
        <nav>
          {links.map((link) => (
            <Link key={link.to} to={link.to} className={pathname === link.to ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="danger">Logout</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
};

export default SidebarLayout;
