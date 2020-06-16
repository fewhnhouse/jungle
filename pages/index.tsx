import useSWR from 'swr'
import { PrismaClient, Song, Artist } from '@prisma/client';

const fetcher = (query) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data)

export default function Index({ songs }: {songs: Song[]) {
  const { data, error } = useSWR('{ users { name } }', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const { users } = data
  console.log(songs)
  return (
    <div>
      {users.map((user, i) => (
        <div key={i}>{user.name}</div>
      ))}
      <ul>
        {songs.map((song) => (
          <li key={song.id}>{song.name}</li>
        ))}
      </ul>
    </div>
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
