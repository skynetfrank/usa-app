import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import { useGetClienteQuery, useUpdateClienteMutation } from "../api/clientesApi";

// Iconos
const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    <path d="m15 5 4 4"></path>
  </svg>
);

const estadoInicialCliente = {
  nombre: "",
  direccion: "",
  telefono: "",
  email: "",
};

const estadoInicialNuevaCuenta = {
  email: "",
  zipCode: "",
  ciudad: "",
  asesor: "",
  vendido: 0,
};

const EditarCliente = () => {
  const { id: clienteId } = useParams();
  const navigate = useNavigate();

  const { data: cliente, error: errorCarga, isLoading: cargandoCliente } = useGetClienteQuery(clienteId);
  const [updateCliente, { isLoading: actualizandoCliente, isSuccess, isError, error: errorActualizacion }] =
    useUpdateClienteMutation();

  const [clienteData, setClienteData] = useState(estadoInicialCliente);
  const [cuentas, setCuentas] = useState([]);
  const [nuevaCuenta, setNuevaCuenta] = useState(estadoInicialNuevaCuenta);
  const [cuentaEnEdicion, setCuentaEnEdicion] = useState(null);
  const [errors, setErrors] = useState({});
  const [mostrandoFormularioCuenta, setMostrandoFormularioCuenta] = useState(false);

  useEffect(() => {
    if (cliente) {
      setClienteData({
        nombre: cliente.nombre || "",
        direccion: cliente.direccion || "",
        telefono: cliente.telefono || "",
        email: cliente.email || "",
      });
      setCuentas(cliente.cuentas || []);
    }
  }, [cliente]);

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setClienteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCuentaChange = (e) => {
    const { name, value } = e.target;
    if (name === "vendido") {
      const soloNumeros = value.replace(/[^\d]/g, "");
      const valorNumerico = soloNumeros ? parseInt(soloNumeros, 10) : 0;
      setNuevaCuenta((prev) => ({ ...prev, [name]: valorNumerico }));
    } else {
      setNuevaCuenta((prev) => ({ ...prev, [name]: value }));
    }
  };

  const abrirModalCreacion = () => {
    setCuentaEnEdicion(null);
    setNuevaCuenta(estadoInicialNuevaCuenta);
    setMostrandoFormularioCuenta(true);
  };

  const abrirModalEdicion = (index) => {
    setCuentaEnEdicion(index);
    setNuevaCuenta(cuentas[index]);
    setMostrandoFormularioCuenta(true);
  };

  const cerrarModal = () => {
    setMostrandoFormularioCuenta(false);
    setCuentaEnEdicion(null);
    setNuevaCuenta(estadoInicialNuevaCuenta);
  };

  const agregarOActualizarCuenta = () => {
    if (!nuevaCuenta.email) {
      Swal.fire({
        icon: "error",
        title: "Campo Obligatorio",
        text: "El email de la cuenta es obligatorio.",
        confirmButtonColor: "var(--primary-color)",
      });
      return;
    }
    if (cuentaEnEdicion !== null) {
      const cuentasActualizadas = cuentas.map((cuenta, index) => (index === cuentaEnEdicion ? nuevaCuenta : cuenta));
      setCuentas(cuentasActualizadas);
    } else {
      setCuentas((prev) => [...prev, { ...nuevaCuenta, creado: new Date() }]);
    }
    cerrarModal();
  };

  const eliminarCuenta = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setCuentas((prev) => prev.filter((_, i) => i !== index));
        Swal.fire("¡Eliminada!", "La cuenta ha sido eliminada.", "success");
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!clienteData.nombre.trim()) newErrors.nombre = "El nombre completo es obligatorio.";
    if (!clienteData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";
    if (clienteData.email && !/\S+@\S+\.\S+/.test(clienteData.email))
      newErrors.email = "El formato del email no es válido.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const clienteCompleto = { id: clienteId, ...clienteData, cuentas };
    updateCliente(clienteCompleto);
  };

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        icon: "success",
        title: "¡Cliente Actualizado!",
        text: "Los datos del cliente han sido guardados exitosamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/listaclientes");
    }

    if (isError) {
      const errorMessage = errorActualizacion?.data?.message || "Ocurrió un error desconocido";
      Swal.fire({
        icon: "error",
        title: "Error al actualizar el cliente",
        text: errorMessage,
        confirmButtonColor: "var(--primary-color)",
      });
      console.error("Error en la mutación:", errorActualizacion);
    }
  }, [isSuccess, isError, errorActualizacion, navigate]);

  if (cargandoCliente) {
    return <div className="loading-container">Cargando datos del cliente...</div>;
  }

  if (errorCarga) {
    return <div className="error-container">Error al cargar el cliente. Verifique que el ID es correcto.</div>;
  }

  return (
    <div className="crear-cliente-container">
      <form onSubmit={handleSubmit} className="cliente-form">
        <h1>Editar Cliente</h1>

        <section className="datos-principales">
          <h2>Datos Principales</h2>
          <div className="form-grid">
            <div className="form-field-container">
              <input
                name="nombre"
                value={clienteData.nombre}
                onChange={handleClienteChange}
                placeholder="Nombre completo"
                className={errors.nombre ? "input-error" : ""}
              />
              {errors.nombre && <span className="form-field-error">{errors.nombre}</span>}
            </div>
            <div className="form-field-container">
              <input
                name="direccion"
                value={clienteData.direccion}
                onChange={handleClienteChange}
                placeholder="Dirección"
                className={errors.direccion ? "input-error" : ""}
              />
              {errors.direccion && <span className="form-field-error">{errors.direccion}</span>}
            </div>
            <div className="form-field-container">
              <input
                name="telefono"
                value={clienteData.telefono}
                onChange={handleClienteChange}
                placeholder="Teléfono"
              />
            </div>
            <div className="form-field-container">
              <input
                type="email"
                name="email"
                value={clienteData.email}
                onChange={handleClienteChange}
                placeholder="Email Principal"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="form-field-error">{errors.email}</span>}
            </div>
          </div>
        </section>

        <section className="cuentas-seccion">
          <div className="cuentas-header">
            <h2>Cuentas</h2>
            <button type="button" className="add-btn" onClick={abrirModalCreacion}>
              <AddIcon /> Agregar Cuenta
            </button>
          </div>

          <div className="grid-cuentas">
            {cuentas.map((cuenta, index) => (
              <div key={index} className="cuenta-card">
                <div className="cuenta-card-actions">
                  <button type="button" onClick={() => abrirModalEdicion(index)} className="icon-btn-card">
                    <PencilIcon />
                  </button>
                  <button type="button" onClick={() => eliminarCuenta(index)} className="icon-btn-card delete">
                    <TrashIcon />
                  </button>
                </div>
                <div className="cuenta-card-header">
                  <strong>{cuenta.email}</strong>
                </div>
                <div className="cuenta-card-body">
                  <p>
                    <strong>Ciudad:</strong> {cuenta.ciudad || "N/A"}
                  </p>
                  <p>
                    <strong>Zip:</strong> {cuenta.zipCode || "N/A"}
                  </p>
                  <p>
                    <strong>Asesor:</strong> {cuenta.asesor || "N/A"}
                  </p>
                  <p>
                    <strong>Vendido:</strong>{" "}
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cuenta.vendido || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="submit-btn" disabled={actualizandoCliente}>
          {actualizandoCliente ? "Actualizando..." : "Actualizar Cliente"}
        </button>
      </form>

      <Modal isOpen={mostrandoFormularioCuenta} onClose={cerrarModal}>
        <div className="modal-form">
          <h3>{cuentaEnEdicion !== null ? "Editar Cuenta" : "Nueva Cuenta"}</h3>
          <div className="form-grid">
            <input
              name="email"
              value={nuevaCuenta.email}
              onChange={handleCuentaChange}
              placeholder="Email de la cuenta"
              required
            />
            <input name="zipCode" value={nuevaCuenta.zipCode} onChange={handleCuentaChange} placeholder="Zip Code" />
            <input name="ciudad" value={nuevaCuenta.ciudad} onChange={handleCuentaChange} placeholder="Ciudad" />
            <input name="asesor" value={nuevaCuenta.asesor} onChange={handleCuentaChange} placeholder="Asesor" />
            <input
              type="text"
              name="vendido"
              value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                nuevaCuenta.vendido || 0
              )}
              onChange={handleCuentaChange}
              placeholder="Vendido ($)"
            />
          </div>
          <div className="modal-form-actions">
            <button type="button" onClick={agregarOActualizarCuenta} className="button-primary">
              {cuentaEnEdicion !== null ? "Actualizar Cuenta" : "Confirmar y Agregar"}
            </button>
            <button type="button" onClick={cerrarModal} className="button-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditarCliente;
