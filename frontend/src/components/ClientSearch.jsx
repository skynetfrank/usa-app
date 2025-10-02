import Swal from "sweetalert2";
import { useLazyGetClienteByRifQuery } from "../api/clientesApi";
import { useEffect } from "react";

const ClientSearch = ({ onClientFound, onNewClient, onCancel }) => {

  const [triggerClientSearch] = useLazyGetClienteByRifQuery();
  useEffect(() => {
    handleBuscarCliente();
  }, []);

  const handleBuscarCliente = async () => {
    try {
      const { value: identificacion } = await Swal.fire({
        title: "RIF o Cedula",
        input: "text",
        inputPlaceholder: "Ejemplo: V999999999 - J999999999",
        showCancelButton: true,
        confirmButtonText: "Buscar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) {
            return "Debe ingresar Cedula o RIF";
          }
          const id = value.toUpperCase();
          const firstLetter = value.at(0).toUpperCase();
          const regexAll = /^[VEJG]{1}[0-9]{6,9}$/;
          const regexRif = /^[JG]{1}[0-9]{9}$/;

          if (!regexAll.test(id)) {
            return "Formato Incorrecto!";
          }

          if (firstLetter === "J" || firstLetter === "G") {
            if (!regexRif.test(value)) {
              return "Formato Incorrecto! - El Rif debe contener 10 caracteres";
            }
          }
        },
      });

      if (identificacion) {
        console.log("identificacion", identificacion)
        const { data, isError } = await triggerClientSearch(identificacion.toUpperCase());

        if (isError) {
          // Error de conexión o del servidor
          Swal.fire({
            title: "Error de Conexión",
            text: "No se pudo comunicar con el servidor. Por favor, intente más tarde.",
            icon: "error",
            confirmButtonText: "OK",
          });
          onCancel();
          return;
        } else if (data) {
          // Cliente encontrado
          Swal.fire({
            title: `${data.nombre + " - " + data.rif}`,
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              onClientFound(data);
            } else {
              onCancel();
            }
          });
        } else {
          // Cliente no encontrado
          Swal.fire({
            title: "Cliente No Encontrado",
            icon: "error",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Agregar",
          }).then((result) => {
            if (result.isConfirmed) {
              onNewClient(identificacion.toUpperCase());
            } else {
              onCancel();
            }
          });
        }
      } else {
        // Usuario canceló la operación
        onCancel();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error durante la búsqueda",
        icon: "error",
        confirmButtonText: "OK",
      });
      onCancel();
    }
  };
  // Este componente no renderiza nada visible por sí mismo
  return null;
};

export default ClientSearch;
