import { useEffect, useState } from "react"
import "./styles/App.css"
import PokemonCard from "./components/pokemonCard"

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
                    <PokemonCard
                        key={index}
                        name={pokemon.name}
                        image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                    />
                ))}
            </div>
        </>
    )
}

export default App
