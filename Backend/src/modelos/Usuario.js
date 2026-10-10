import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [60, 'El nombre no puede superar 60 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo inválido'],
    },
    contrasena: {
  type: String,
  required: [true, 'La contraseña es obligatoria'],
  minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
  maxlength: [50, 'La contraseña no puede superar 50 caracteres'],
  validate: {
    validator: (v) => !/\s/.test(v),
    message: 'La contraseña no puede contener espacios',
  },
  select: false,
},
    avatarUrl: {
      type: String,
      default: '',
    },
   
    activo: {
      type: Boolean,
      default: true,
    },
    fechaEliminacion: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'usuarios',
  }
);

usuarioSchema.pre('save', async function () {
  if (!this.isModified('contrasena')) return;
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
});

usuarioSchema.methods.compararContrasena = async function (contrasenaPlano) {
  return await bcrypt.compare(contrasenaPlano, this.contrasena);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;