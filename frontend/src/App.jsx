import { Link, Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "./actions/userActions";
import { useState, useEffect } from "react";
import { LogIn, LogOut, User, UserPlus, List, X, Menu } from "lucide-react";

function App() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  // Estado para gestionar el tema actual y renderizar el icono correcto
  const [theme, setTheme] = useState(() => document.body.getAttribute("data-theme") || "light");

  const signoutHandler = () => {
    setMenuOpen(false); // Cierra el menú al salir
    dispatch(signout());
    setMobileMenuOpen(false);
  };

  // Sincroniza el atributo del body con el estado del tema
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      if (newTheme === "dark") {
        document.body.setAttribute("data-theme", "dark");
      } else {
        document.body.removeAttribute("data-theme");
      }
      return newTheme;
    });
  };

  useEffect(() => {
    // Bloquear el scroll del body cuando el menú móvil está abierto
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="display-grid">
        <div className="header">
          <div className="header-container">
            <h1 className="header-title">
              <Link to="/" className="header-title-link">
                USA App
              </Link>
            </h1>
            <div className="header-right-actions">
              <button onClick={toggleTheme} className="theme-button icon-button" aria-label="Cambiar tema">
                {theme === "light" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>

              <div className="header-actions">
                {userInfo ? (
                  <>
                    <Link
                      to="/listaclientes"
                      className="button-primary"
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <List size={18} />
                      <span>Clientes</span>
                    </Link>
                    <Link
                      to="/nuevocliente"
                      className="button-primary"
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <UserPlus size={18} />
                      <span>Nuevo Cliente</span>
                    </Link>
                    <div className="user-menu-container">
                      <button onClick={() => setMenuOpen(!isMenuOpen)} className="user-menu-button">
                        <span>{userInfo.name}</span>
                        <div className="avatar">{userInfo.nombre.charAt(0)}</div>
                      </button>
                      {isMenuOpen && (
                        <div className="dropdown-menu">
                          <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                            <User size={18} />
                            <span>Ver Perfil</span>
                          </Link>
                          <button onClick={signoutHandler} className="dropdown-item">
                            <LogOut size={18} />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Link to="/signin" className="button-primary" aria-label="Iniciar Sesión">
                    <LogIn size={18} />
                    <span>Iniciar Sesión</span>
                  </Link>
                )}
              </div>

              {userInfo && (
                <button className="hamburger-menu" onClick={() => setMobileMenuOpen(true)} aria-label="Abrir menú">
                  <Menu size={28} />
                </button>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && userInfo && (
          <div className="mobile-nav">
            <div className="mobile-nav-header">
              <div className="mobile-user-info">
                <div className="avatar">{userInfo.nombre.charAt(0)}</div>
                <span>{userInfo.name}</span>
              </div>
              <button className="close-menu-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú">
                <X size={32} />
              </button>
            </div>
            <nav className="mobile-nav-links">
              <Link to="/listaclientes" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <List size={22} />
                <span>Lista de Clientes</span>
              </Link>
              <Link to="/nuevocliente" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <UserPlus size={22} />
                <span>Nuevo Cliente</span>
              </Link>
              <Link to="/profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <User size={22} />
                <span>Ver Perfil</span>
              </Link>
              <button onClick={signoutHandler} className="mobile-nav-item">
                <LogOut size={22} />
                <span>Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        )}

        <div className="main">
          <div className="main-content">
            <Outlet />
          </div>
        </div>

        <div className="footer">
          <div className="footer-container">
            <span>&copy; {new Date().getFullYear()} mr.F-dev. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
