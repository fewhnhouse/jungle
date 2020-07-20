import { ApolloServer, gql } from 'apollo-server-micro'
import { PrismaClient } from '@prisma/client'
import Axios from 'axios'

const typeDefs = gql`
    type Query {
        songs: [Song!]!
        artists: [Artist!]!
    }

    type Mutation {
        login: LoginData
        removeSong: Song
    }

    type LoginData {
        token: String
    }

    type Song {
        id: Int
        name: String
        artist: Artist
        artistId: Int
    }

    type Artist {
        id: Int
        name: String
        songs: [Song!]!
    }
`

const prisma = new PrismaClient()

const resolvers = {
    Query: {
        songs(parent, args, context) {
            return prisma.song.findMany()
        },
    },
    Mutation: {
        async login(parent, args, context) {
            const { username, password } = args
            const { data } = await Axios.post(
                process.env.TAIGA_BACKEND_URL + '/auth',
                { username, password }
            )
            return data
        },
        removeSong(parent, args, context) {
            const { id } = args
            console.log(args)
            return prisma.song.delete({ where: { id } })
        },
    },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler({ path: '/api/graphql' })
