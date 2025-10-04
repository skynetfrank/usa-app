import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser as updateUser, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import Swal from "sweetalert2";
import { User, Mail, Lock, Eye, EyeOff, Fingerprint, Phone } from "lucide-react";

export default function ProfileScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = userUpdateProfile;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(updateUser(userInfo._id));
    } else {
      setNombre(user.nombre || " ");
      setEmail(user.email || " ");

    }
  }, [dispatch, userInfo._id, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
    } else {
      setMessage(null);
      dispatch(
        updateUserProfile({
          userId: user._id,
          nombre,
          email,
          password,
        })
      );
    }
  };

  useEffect(() => {
    if (successUpdate) {
      Swal.fire({
        title: "Datos Actualizado con Exito!",
        text: "Tu perfil ha sido actualizado.",
        icon: "success",
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, successUpdate]);

  useEffect(() => {
    if (errorUpdate) {
      Swal.fire({
        title: "Error",
        text: errorUpdate,
        icon: "error",
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, errorUpdate]);

  useEffect(() => {
    if (error) {
      Swal.fire("Ocurrio un Error al Actualizar!", "", error);
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error]);

  return (
    <div className="form-container">
      <form className="form-card" onSubmit={submitHandler}>
        <h2 className="form-title">Perfil de Usuario</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <React.Fragment>
            <div className="input-group">
              <User className="input-icon" />
              <input
                id="nombre"
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nueva clave (opcional)"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar nueva clave"
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
           
           

            {(errorUpdate || message) && <div className="form-error">{errorUpdate || message}</div>}

            <button type="submit" className="button-primary form-submit-button" disabled={loadingUpdate}>
              {loadingUpdate ? "Actualizando..." : "Actualizar Perfil"}
            </button>
          </React.Fragment>
        )}
      </form>
    </div>
  );
}
