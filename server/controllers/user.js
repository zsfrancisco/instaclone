const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const awsUploadImage = require("../utils/aws-upload-image");

function createToken(user, SECRET_KEY, expiresIn) {
    const {id, name, email, username} = user;
    const payload = {
        id,
        name,
        email,
        username,
    };
    return jwt.sign(payload, SECRET_KEY, {expiresIn});
}

async function register(input) {
    console.log({input});
    const newUser = input;
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const {email, username, password} = newUser;

    // Checking if email is in use
    const emailFound = await User.findOne({email});
    if (emailFound) throw new Error("El correo electrónico ya está en uso");

    // Checking if email is in use
    const usernameFound = await User.findOne({username});
    if (usernameFound) throw new Error("El nombre de usuario ya está en uso");

    // Encrypting password
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password, salt);

    try {
        const user = new User(newUser);
        user.save();
        return user;
    } catch (error) {
        console.log(error);
    }
}

async function getUser(id, username) {
    let user = null;
    if (id) user = await User.findById(id);
    if (username) user = await User.findOne({username});
    if (!user) throw new Error("El usuario no existe");

    return user;
}

async function login(input) {
    const {email, password} = input;

    const userFound = await User.findOne({email: email.toLowerCase()});
    if (!userFound) throw new Error("Error en el email o la contraseña");

    const passwordSuccess = await bcryptjs.compare(password, userFound.password);
    if (!passwordSuccess) throw new Error("Error en el email o la contraseña");

    return {
        token: createToken(userFound, process.env.SECRET_KEY, "24h"),
    };
}

async function updateAvatar(file, context) {
    const {id: userId} = context.user;
    const {createReadStream, mimetype} = await file;
    const extension = mimetype.split("/")[1];
    const imageName = `avatar/${userId}.${extension}`;
    const fileData = createReadStream();
    try {
        const urlImageResult = await awsUploadImage(fileData, imageName);
        await User.findByIdAndUpdate(userId, {avatar: urlImageResult});
        return {
            status: true,
            urlAvatar: urlImageResult
        }
    } catch (error) {
        return {
            status: false,
            urlAvatar: null
        };
    }
}

async function deleteAvatar(context) {
    const {id: userId} = context.user;
    try {
        await User.findByIdAndUpdate(userId, {avatar: ''});
        return true;
    } catch (error) {
        console.log("error deleting avatar - ", error);
        return false;
    }
}

async function updateUser(input, context) {
    const {id: userId} = context.user;
    try {
        if (input.currentPassword && input.newPassword) {
            const userFound = await User.findById(userId);
            const passwordSuccess = await bcryptjs.compare(input.currentPassword, userFound.password);
            if (!passwordSuccess) throw new Error("Las contraseñas no coinciden");
            const salt = await bcryptjs.genSaltSync(10);
            const newPasswordCrypt = await bcryptjs.hash(input.newPassword, salt);
            await User.findByIdAndUpdate(userId, {password: newPasswordCrypt});
        } else {
            await User.findByIdAndUpdate(userId, input);
        }
        return true;
    } catch (error) {
        console.log('Error updating user: ', error);
        return false;
    }
}

async function search(search) {
    return User.find({
        name: {$regex: search, $options: "i"}
    });
}

module.exports = {
    getUser,
    register,
    login,
    updateAvatar,
    deleteAvatar,
    updateUser,
    search
};
