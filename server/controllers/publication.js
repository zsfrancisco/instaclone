const Publication = require("../models/publication");
const User = require("../models/user");
const Follow = require("../models/follow");
const awsUploadImage = require("../utils/aws-upload-image");
const {v4: uuidv4} = require("uuid");

async function publish(file, context) {
    const {id: idUser} = context.user;
    const {createReadStream, mimetype} = await file;
    const extension = mimetype.split("/")[1];
    const fileName = `publication/${uuidv4()}.${extension}`;
    const fileData = createReadStream();

    try {
        const result = await awsUploadImage(fileData, fileName);
        const newPublication = new Publication({
            idUser,
            file: result,
            typeFile: mimetype.split("/")[0],
            createAt: Date.now()
        });
        await newPublication.save();

        return {
            status: true,
            urlFile: result
        };
    } catch (error) {
        console.log("Error server uploading image");
        return {
            status: null,
            urlFile: ""
        };
    }
}

async function getPublications(username) {
    const user = await User.findOne({username});
    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    return Publication.find()
        .where({idUser: user._id})
        .sort({createAt: -1});
}

async function getPublicationsFollowed(context) {
    const followed = Follow.find({idUser: context.user.id}).populate("follow");
    const followedList = [];
    for await (const data of followed) {
        followedList.push(data.follow);
    }

    const publicationList = [];
    for await (const data of followedList) {
        const publications = await Publication.find()
            .where({idUser: data._id})
            .sort({createAt: -1})
            .populate("idUser");
        publicationList.push(...publications);
    }

    return publicationList.sort((a, b) => {
        return new Date(b.createAt) - new Date(a.createAt);
    });
}

module.exports = {
    publish,
    getPublications,
    getPublicationsFollowed
}