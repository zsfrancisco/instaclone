const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {ApolloServer} = require("apollo-server");
const typeDefs = require("./gql/schema");
const resolvers = require("./gql/resolvers");
require("dotenv").config({path: ".env"});

mongoose.connect(
    process.env.BBDD,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
    },
    (err, _) => {
        if (err) {
            console.log("Connection failed - ", err);
        } else {
            server();
        }
    }
);

function server() {
    const serverApollo = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) => {
            const token = req.headers.authorization;
            if (token) {
                try {
                    const user = jwt.verify(
                        token.replace("Bearer ", ""),
                        process.env.SECRET_KEY
                    );
                    return {
                        user
                    }
                } catch (error) {
                    console.log("#### ERROR ####");
                    console.log("Invalid token", error);
                    throw new Error("Invalid token");
                }
            }
        }
    });

    serverApollo.listen().then(({url}) => {
        console.log("######################################");
        console.log(`Server ready in ${url}`);
        console.log("######################################");
    });
}