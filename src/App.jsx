import { useEffect, useState } from "react"
import "./styles/App.css"

function App() {
    const [pokemons, setPokemons] = useState([])

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
            .then((res) => res.json())
            .then((data) => {
                setPokemons(data.results)
            })
    }, [])
    return (
        <>
            <div>
                <h1>Pokedex</h1>
                {pokemons.map((pokemon, index) => (
                    <div key={index}>
                        <p>{pokemon.name}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default App
