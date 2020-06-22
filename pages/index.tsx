import Link from 'next/link'

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <Link href="/projects">
                <a>Projects</a>
            </Link>
        </div>
    )
}

export default Home
