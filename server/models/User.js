const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name is required'],
    trim: true,
    minlength: [2, 'The name must be at least 2 characters long'],
    maxlength: [50, 'The name must not exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'The email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'The password is required'],
    minlength: [8, 'The password must be at least 8 characters long'],
    select: false // no incluir password en queries por defecto
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=2292A4&color=fff'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// indices
userSchema.index({ email: 1 });

// hash password antes de guardar
userSchema.pre('save', async function(next) {
  // solo se hashea si el password fue modificado
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// metodo para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// metodo para generar URL de avatar
userSchema.methods.getAvatarUrl = function() {
  return this.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=2292A4&color=fff`;
};

// metodo para obtener datos publicos del usuario
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// virtual para contar proyectos
userSchema.virtual('projectCount', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'owner',
  count: true
});

module.exports = mongoose.model('User', userSchema);