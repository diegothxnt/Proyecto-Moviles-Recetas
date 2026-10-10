import mongoose from 'mongoose';


export const UNIDADES_MEDIDA = [
  'g',
  'kg',
  'mg',
  'ml',
  'l',
  'taza',
  'cucharada',
  'cucharadita',
  'unidad',
  'pizca',
  'libra',
  'onza',
  'al gusto',
];


const ingredienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del ingrediente es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre del ingrediente debe tener al menos 2 caracteres'],
      maxlength: [80, 'El nombre del ingrediente no puede superar 80 caracteres'],
    },
    cantidad: {
      type: String,
      trim: true,
      default: '',
      maxlength: [20, 'La cantidad no puede superar 20 caracteres'],
    },
    unidadMedida: {
      type: String,
      enum: {
        values: UNIDADES_MEDIDA,
        message: 'Unidad de medida inválida',
      },
      default: 'unidad',
    },
    notas: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'Las notas del ingrediente no pueden superar 120 caracteres'],
    },
  },
  { _id: false }
);

const recetaSchema = new mongoose.Schema(
  {
    
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [2, 'El título debe tener al menos 2 caracteres'],
      maxlength: [120, 'El título no puede superar 120 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres'],
      default: '',
    },

    
    ingredientes: {
      type: [ingredienteSchema],
      validate: [
        {
          validator: (arr) => arr.length > 0,
          message: 'La receta debe tener al menos un ingrediente',
        },
        {
          validator: (arr) => arr.length <= 50,
          message: 'Máximo 50 ingredientes por receta',
        },
      ],
    },
    pasos: {
      type: [String],
      validate: [
        {
          validator: (arr) => arr.length > 0,
          message: 'La receta debe tener al menos un paso',
        },
        {
          validator: (arr) => arr.length <= 50,
          message: 'Máximo 50 pasos por receta',
        },
        {
          validator: (arr) =>
            arr.every((p) => typeof p === 'string' && p.trim().length <= 500),
          message: 'Cada paso no puede superar 500 caracteres',
        },
      ],
    },

    
    tiempoPreparacion: {
      type: Number,
      min: [0, 'El tiempo no puede ser negativo'],
      max: [1440, 'El tiempo de preparación no puede superar 24 horas (1440 min)'],
      default: 0,
    },
    tiempoCoccion: {
      type: Number,
      min: [0, 'El tiempo no puede ser negativo'],
      max: [1440, 'El tiempo de cocción no puede superar 24 horas (1440 min)'],
      default: 0,
    },
    porciones: {
      type: Number,
      min: [1, 'Debe haber al menos 1 porción'],
      max: [100, 'No pueden ser más de 100 porciones'],
      default: 1,
    },

    
    dificultad: {
      type: String,
      enum: {
        values: ['Fácil', 'Media', 'Difícil'],
        message: 'Dificultad inválida',
      },
      default: 'Fácil',
    },
    categoria: {
      type: String,
      trim: true,
      default: 'Otros',
      maxlength: [50, 'La categoría no puede superar 50 caracteres'],
    },
    etiquetas: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (arr) => arr.length <= 10,
          message: 'Máximo 10 etiquetas por receta',
        },
        {
          validator: (arr) =>
            arr.every((t) => typeof t === 'string' && t.length <= 20),
          message: 'Cada etiqueta puede tener máximo 20 caracteres',
        },
      ],
    },

    
    calorias: {
      type: Number,
      min: [0, 'Las calorías no pueden ser negativas'],
      max: [9999, 'Las calorías no pueden superar 9999 kcal'],
      default: 0,
    },

    
    notas: {
      type: String,
      trim: true,
      maxlength: [1000, 'Las notas no pueden superar 1000 caracteres'],
      default: '',
    },
    fuente: {
      type: String,
      trim: true,
      maxlength: [200, 'La fuente no puede superar 200 caracteres'],
      default: '',
    },

    
    imagenUrl: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'La URL de la imagen no puede superar 500 caracteres'],
    },

    
    esPublica: {
      type: Boolean,
      default: false,
    },

    
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      index: true,
    },
    grupos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grupo',
        index: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'recetas',
  }
);


recetaSchema.index(
  { autor: 1, titulo: 1 },
  {
    unique: true,
    collation: { locale: 'es', strength: 2 },
  }
);
recetaSchema.index({ titulo: 1 });
recetaSchema.index({ categoria: 1 });
recetaSchema.index({ etiquetas: 1 });

const Receta = mongoose.model('Receta', recetaSchema);

export default Receta;