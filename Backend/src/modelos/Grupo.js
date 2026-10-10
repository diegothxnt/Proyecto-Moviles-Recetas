import mongoose from 'mongoose';

const grupoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del grupo es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [80, 'El nombre no puede superar 80 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [300, 'La descripción no puede superar 300 caracteres'],
      default: '',
    },
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'grupos',
  }
);

grupoSchema.index(
  { propietario: 1, nombre: 1 },
  {
    unique: true,
    collation: { locale: 'es', strength: 2 },
  }
);

grupoSchema.index({ nombre: 1 });

const Grupo = mongoose.model('Grupo', grupoSchema);

export default Grupo;