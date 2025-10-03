import { Link, Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "./actions/userActions";
import { useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";

function App() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  const [isMenuOpen, setMenuOpen] = useState(false);
  // Estado para gestionar el tema actual y renderizar el icono correcto
  const [theme, setTheme] = useState(
    () => document.body.getAttribute('data-theme') || 'light'
  );

  const signoutHandler = () => {
    setMenuOpen(false); // Cierra el menú al salir
    dispatch(signout());
  };

  // Sincroniza el atributo del body con el estado del tema
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      if (newTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.body.removeAttribute('data-theme');
      }
      return newTheme;
    });
  };

  return (
    <>
      <div className="display-grid">
        <div className="header">
          <div className="header-container">
            <h1 className="header-title">
              <Link to="/" className="header-title-link">USA App</Link>
            </h1>
            <div className="header-actions">
              <button onClick={toggleTheme} className="theme-button icon-button" aria-label="Cambiar tema">
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>

              {userInfo ? (
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
              ) : (
                <Link to="/signin" className="theme-button icon-button" aria-label="Iniciar Sesión">
                  <LogIn size={22} />
                </Link>
              )}
            </div>
          </div>
        </div>

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
