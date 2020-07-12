import { ApolloServer, gql } from 'apollo-server-micro'
import { PrismaClient } from '@prisma/client'

const typeDefs = gql`
  type Query {
    songs: [Song!]!
    artists: [Artist!]!
  }

  type Mutation {
    removeSong: Song
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
    removeSong(parent, args, context) {
      const { id } = args
      console.log(args)
      return prisma.song.delete({ where: { id } })
    }
  }
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })
