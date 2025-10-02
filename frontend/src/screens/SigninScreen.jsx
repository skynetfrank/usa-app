import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { signin } from "../actions/userActions";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SigninScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="form-container">
      <form className="form-card card" onSubmit={submitHandler}>
        <h1 className="form-title">Iniciar Sesión</h1>

        {error && <div className="form-error">{error}</div>}

        <div className="input-group">
          <Mail className="input-icon" size={20} />
          <input
            type="email"
            id="email"
            placeholder="Correo electrónico"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Contraseña"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="button-primary form-submit-button" type="submit" disabled={loading}>
          {loading ? "Iniciando..." : "Entrar"}
        </button>

        <div className="form-link">
          ¿Nuevo por aquí?{" "}
          <Link to={`/register?redirect=${redirect}`}>Crea una cuenta</Link>
        </div>
      </form>
    </div>
  );
}
