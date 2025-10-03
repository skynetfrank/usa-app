import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router";

import Swal from "sweetalert2";
import { Plus, Trash2, User, MapPin, Phone, Mail } from "lucide-react";
import { useNewClienteMutation } from "../api/clientesApi";


export default function CreateClienteScreen() {
    const navigate = useNavigate();
    const [crearCliente, { isLoading, isSuccess, isError, error }] = useNewClienteMutation();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nombre: "",
            direccion: "",
            telefono: "",
            email: "",
            cuentas: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "cuentas",
    });

    const onSubmit = async (data) => {
        try {
            await crearCliente(data).unwrap();
            // isSuccess se volverá true en el siguiente render
        } catch (err) {
            // isError se volverá true y el error estará disponible
        }
    };

    useEffect(() => {
        if (isSuccess) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Cliente creado con éxito',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate("/clientes"); // Redirige a la lista de clientes o a donde prefieras
            });
        }
        if (isError) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.data?.message || "Ocurrió un error al crear el cliente",
            });
        }
    }, [isSuccess, isError, error, navigate]);

    return (
        <div className="main-content">
            <form onSubmit={handleSubmit(onSubmit)} className="form-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h2 className="form-title">Crear Nuevo Cliente</h2>

                {/* SECCIÓN PRINCIPAL DEL CLIENTE */}
                <div className="input-group">
                    <User className="input-icon" />
                    <input
                        type="text"
                        placeholder="Nombre Completo"
                        {...register("nombre", { required: "El nombre es obligatorio" })}
                    />
                </div>
                {errors.nombre && <p className="form-error-inline">{errors.nombre.message}</p>}

                <div className="input-group">
                    <MapPin className="input-icon" />
                    <input
                        type="text"
                        placeholder="Dirección"
                        {...register("direccion", { required: "La dirección es obligatoria" })}
                    />
                </div>
                {errors.direccion && <p className="form-error-inline">{errors.direccion.message}</p>}

                <div className="input-group">
                    <Phone className="input-icon" />
                    <input type="tel" placeholder="Teléfono" {...register("telefono")} />
                </div>

                <div className="input-group">
                    <Mail className="input-icon" />
                    <input
                        type="email"
                        placeholder="Email Principal"
                        {...register("email", {
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Formato de email inválido",
                            },
                        })}
                    />
                </div>
                {errors.email && <p className="form-error-inline">{errors.email.message}</p>}

                {/* SECCIÓN DE CUENTAS */}
                <div className="cuentas-section">
                    <div className="cuentas-header">
                        <h3>Cuentas Asociadas</h3>
                        <button
                            type="button"
                            className="icon-button"
                            onClick={() =>
                                append({
                                    email: "",
                                    creado: new Date().toISOString().split("T")[0], // Fecha de hoy por defecto
                                    aprobado: "",
                                    zipCode: "",
                                    ciudad: "",
                                    asesor: "",
                                    vendido: 0,
                                })
                            }
                        >
                            <Plus />
                        </button>
                    </div>

                    {fields.map((item, index) => (
                        <div key={item.id} className="cuenta-card">
                            <input
                                placeholder="Email de la cuenta"
                                {...register(`cuentas.${index}.email`, { required: "El email es obligatorio" })}
                            />
                            {errors.cuentas?.[index]?.email && (
                                <p className="form-error-inline">{errors.cuentas[index].email.message}</p>
                            )}

                            <input type="date" {...register(`cuentas.${index}.creado`)} />
                            <input type="date" {...register(`cuentas.${index}.aprobado`)} />
                            <input placeholder="Zip Code" {...register(`cuentas.${index}.zipCode`)} />
                            <input placeholder="Ciudad" {...register(`cuentas.${index}.ciudad`)} />
                            <input placeholder="Asesor" {...register(`cuentas.${index}.asesor`)} />
                            <input
                                type="number"
                                placeholder="Vendido ($)"
                                {...register(`cuentas.${index}.vendido`, { valueAsNumber: true })}
                            />

                            <button type="button" className="icon-button danger" onClick={() => remove(index)}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                <button type="submit" className="button-primary form-submit-button" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cliente"}
                </button>
            </form>
        </div>
    );
}