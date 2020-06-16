import styled from 'styled-components'
import { Song, PrismaClient, Artist } from '@prisma/client'

const Container = styled.div`
  margin: 2rem;
  border: 1px solid black;
  border-radius: 4px;
`

export default ({
  songs,
}: {
  songs: (Song & {
    artist: Artist
  })[]
}) => {
  return (
    <Container>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>{song.name}</li>
        ))}
      </ul>
    </Container>
  )
}

export async function getStaticProps() {
  const prisma = new PrismaClient()
  const songs = await prisma.song.findMany({
    include: { artist: true },
  })

  return {
    props: {
      songs,
    },
  }
}
