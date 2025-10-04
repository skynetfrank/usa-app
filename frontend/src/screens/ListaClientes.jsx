import React, { useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useGetClientesQuery, useDeleteClienteMutation } from "../api/clientesApi";

// Iconos para los botones de acción
const EditIcon = () => (
  <svg
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
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ListaClientes = () => {
  const { data: clientes, error, isLoading, isFetching } = useGetClientesQuery();
  const [deleteCliente] = useDeleteClienteMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id, nombre) => {
    Swal.fire({
      title: `¿Eliminar a ${nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCliente(id)
          .unwrap()
          .then(() => {
            // El re-fetch de RTK Query actualizará la lista automáticamente.
            // No es necesaria una alerta de éxito aquí para una mejor UX.
          })
          .catch((err) => {
            Swal.fire("Error", "No se pudo eliminar el cliente.", "error");
            console.error(err);
          });
      }
    });
  };

  if (isLoading || isFetching) {
    return <div className="loading-container">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="error-container">Error al cargar los clientes. Por favor, intente de nuevo.</div>;
  }

  const filteredClientes =
    clientes?.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

  return (
    <div className="lista-clientes-container">
      <div className="lista-header">
        <h1>Lista de Clientes</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/nuevocliente" className="button-primary">
          Crear Nuevo Cliente
        </Link>
      </div>

      <div className="table-responsive">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Cuentas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <tr key={cliente._id}>
                  <td data-label="Nombre">{cliente.nombre}</td>
                  <td data-label="Email">{cliente.email || "-"}</td>
                  <td data-label="Teléfono">{cliente.telefono || "-"}</td>
                  <td data-label="Cuentas" className="cuentas-cell">
                    {cliente.cuentas.length > 0 ? (
                      cliente.cuentas.map((cuenta, index) => (
                        <div key={index} className="cuenta-pill-container">
                          <span className="cuenta-pill">{cuenta.email}</span>
                          <div className="cuenta-tooltip">
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
                              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                                cuenta.vendido || 0
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td data-label="Acciones">
                    <div className="action-buttons">
                      <Link to={`/clientes/editar/${cliente._id}`} className="action-btn edit-btn">
                        <EditIcon />
                      </Link>
                      <button
                        onClick={() => handleDelete(cliente._id, cliente.nombre)}
                        className="action-btn delete-btn"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data-cell">
                  {searchTerm ? "No se encontraron clientes." : "No hay clientes registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaClientes;
