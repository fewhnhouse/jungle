import useSWR from 'swr'

export default function Index() {
  const { data, error } = useSWR('{ songs { name } }')
  console.log(data, error)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const { songs } = data
  return (
    <div>
      {songs.map((song, i) => (
        <div key={i}>{song.name}</div>
      ))}
    </div>
  )
}
