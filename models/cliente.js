import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String },
    email: { type: String, required: true, unique: true },
    cuentas: [
      {
        email: { type: String, required: true },
        creado: { type: Date, default: Date.now, require: true },
        aprobado: { type: Date, require: true },
        zipCode: { type: String, required: true },
        ciudad: { type: String },
        asesor: { type: String, required: true },
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
