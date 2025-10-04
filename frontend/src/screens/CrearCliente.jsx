import React, { useState } from "react";
import Modal from "../components/Modal"; // Importamos el nuevo componente Modal
import "../components/Modal.css"; // Importamos los estilos del Modal

// Iconos (ejemplo usando SVG como componentes de React)
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

const CrearCliente = () => {
  const [clienteData, setClienteData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const [cuentas, setCuentas] = useState([]);
  const [nuevaCuenta, setNuevaCuenta] = useState({
    email: "",
    zipCode: "",
    ciudad: "",
    asesor: "",
    vendido: 0,
  });

  const [mostrandoFormularioCuenta, setMostrandoFormularioCuenta] = useState(false);

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setClienteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCuentaChange = (e) => {
    const { name, value } = e.target;
    setNuevaCuenta((prev) => ({ ...prev, [name]: value }));
  };

  const agregarCuenta = () => {
    // Simple validación para no agregar cuentas vacías
    if (!nuevaCuenta.email) {
      alert("El email de la cuenta es obligatorio.");
      return;
    }
    setCuentas((prev) => [...prev, { ...nuevaCuenta, creado: new Date() }]);
    setNuevaCuenta({ email: "", zipCode: "", ciudad: "", asesor: "", vendido: 0 });
    setMostrandoFormularioCuenta(false);
  };

  const eliminarCuenta = (index) => {
    setCuentas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clienteCompleto = { ...clienteData, cuentas };

    try {
      const response = await fetch("/api/clientes/newcliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteCompleto),
      });

      if (!response.ok) {
        throw new Error("Error al crear el cliente");
      }

      const resultado = await response.json();
      console.log("Cliente creado:", resultado);
      alert("¡Cliente creado con éxito!");
      // Opcional: resetear formulario o redirigir
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error en la petición:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="crear-cliente-container">
      <form onSubmit={handleSubmit} className="cliente-form">
        <h1>Crear Nuevo Cliente</h1>

        <section className="datos-principales">
          <h2>Datos Principales</h2>
          <div className="form-grid">
            <input
              name="nombre"
              value={clienteData.nombre}
              onChange={handleClienteChange}
              placeholder="Nombre completo"
              required
            />
            <input
              name="direccion"
              value={clienteData.direccion}
              onChange={handleClienteChange}
              placeholder="Dirección"
              required
            />
            <input name="telefono" value={clienteData.telefono} onChange={handleClienteChange} placeholder="Teléfono" />
            <input
              type="email"
              name="email"
              value={clienteData.email}
              onChange={handleClienteChange}
              placeholder="Email Principal"
            />
          </div>
        </section>

        <section className="cuentas-seccion">
          <div className="cuentas-header">
            <h2>Cuentas</h2>
            <button type="button" className="add-btn" onClick={() => setMostrandoFormularioCuenta(true)}>
              <AddIcon /> Agregar Cuenta
            </button>
          </div>

          <div className="grid-cuentas">
            {cuentas.map((cuenta, index) => (
              <div key={index} className="cuenta-card">
                <button type="button" onClick={() => eliminarCuenta(index)} className="delete-btn-card">
                  <TrashIcon />
                </button>
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
                    <strong>Vendido:</strong> ${cuenta.vendido || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="submit-btn">
          Guardar Cliente
        </button>
      </form>

      <Modal isOpen={mostrandoFormularioCuenta} onClose={() => setMostrandoFormularioCuenta(false)}>
        <div className="modal-form">
          <h3>Nueva Cuenta</h3>
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
              type="number"
              name="vendido"
              value={nuevaCuenta.vendido}
              onChange={handleCuentaChange}
              placeholder="Vendido ($)"
            />
          </div>
          <div className="modal-form-actions">
            <button type="button" onClick={agregarCuenta} className="button-primary">
              Confirmar y Agregar
            </button>
            <button type="button" onClick={() => setMostrandoFormularioCuenta(false)} className="button-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CrearCliente;
