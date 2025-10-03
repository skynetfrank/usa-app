import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String },
    email: { type: String },
    cuentas: [
      {
        email: { type: String },
        creado: { type: Date },
        aprobado: { type: Date },
        zipCode: { type: String },
        ciudad: { type: String },
        asesor: { type: String },
        vendido: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;
