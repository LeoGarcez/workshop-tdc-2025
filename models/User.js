const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },

    password: { 
        type: String,
        required: true,
        minlength: 6,
        select: false // Exclui a senha da query por padrão
    },

}, {
    timestamps: true // Automaticamente adiciona createdAt e updatedAt
});

const User = mongoose.model('User', userSchema);
module.exports = { User };

