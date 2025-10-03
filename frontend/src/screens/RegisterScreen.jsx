import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { register } from "../actions/userActions";
import { USER_REGISTER_RESET } from "../constants/userConstants";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null); // Para error de contraseñas

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
    } else {
      setMessage(null);
      dispatch(register(nombre, email, password));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // Limpia el mensaje de error del servidor después de unos segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch({ type: USER_REGISTER_RESET });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error]);

  return (
    <div className="form-container">
      <form className="form-card" onSubmit={submitHandler}>
        <h2 className="form-title">Crear Cuenta</h2>

        <div className="input-group">
          <User className="input-icon" />
          <input type="text" placeholder="Nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="input-group">
          <Mail className="input-icon" />
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-group">
          <Lock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Clave"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <div className="input-group">
          <Lock className="input-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar Clave"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Muestra el error del servidor o el de la validación local */}
        {(error || message) && <div className="form-error">{error || message}</div>}

        <button type="submit" className="button-primary form-submit-button" disabled={loading}>
          {loading ? "Registrando..." : "Crear Cuenta"}
        </button>

        <div className="form-link">
          ¿Ya tienes una cuenta?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Inicia Sesión</Link>
        </div>
      </form>
    </div>
  );
}
