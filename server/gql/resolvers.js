const userController = require("../controllers/user");
const followController = require("../controllers/follow");
const publicationController = require("../controllers/publication");
const commentController = require("../controllers/comment");
const likeController = require("../controllers/like");

const resolvers = {
    Query: {
        // User
        getUser: (_, {id, username}) => userController.getUser(id, username),
        search: (_, {search}) => userController.search(search),

        // Follow
        isFollow: (_, {username}, context) => followController.isFollow(username, context),
        getFollowers: (_, {username}) => followController.getFollowers(username),
        getFollowed: (_, {username}) => followController.getFollowed(username),
        getNotFollowed: (_,{}, context) => followController.getNotFollowed(context),

        // Publication
        getPublications: (_, {username}) => publicationController.getPublications(username),
        getPublicationsFollowed: (_, {}, context) => publicationController.getPublicationsFollowed(context),

        // Comment
        getComments: (_, {idPublication}) => commentController.getComments(idPublication),

        // Like
        isLike: (_, {idPublication}, context) => likeController.isLike(idPublication, context),
        countLikes: (_, {idPublication}) => likeController.countLikes(idPublication)
    },
    Mutation: {
        // User
        register: (_, {input}) => userController.register(input),
        login: (_, {input}) => userController.login(input),
        updateAvatar: (_, {file}, context) => userController.updateAvatar(file, context),
        deleteAvatar: (_, {}, context) => userController.deleteAvatar(context),
        updateUser: (_, {input}, context) => userController.updateUser(input, context),

        // Follow
        follow: (_, {username}, context) => followController.follow(username, context),
        unfollow: (_, {username}, context) => followController.unfollow(username, context),

        // Publication
        publish: (_, {file}, context) => publicationController.publish(file, context),

        // Comment
        addComment: (_, { input }, context) => commentController.addComment(input, context),

        // Like
        addLike: (_, {idPublication}, context) => likeController.addLike(idPublication, context),
        deleteLike: (_, {idPublication}, context) => likeController.deleteLike(idPublication, context)
    },
};

module.exports = resolvers;
