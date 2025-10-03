import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String },
    email: { type: String },
    cuentas: []
  },
  {
    timestamps: true,
  }
);
const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;
