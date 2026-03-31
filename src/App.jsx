import { useEffect, useState } from "react"
import PokemonCard from "./components/PokemonCard"
import "./styles/App.css"

export default function App() {
    const [pokemons, setPokemons] = useState([])
    const [search, setSearch] = useState("")
    const [selectedPokemonName, setSelectedPokemonName] = useState(null)
    const [selectedPokemonData, setSelectedPokemonData] = useState(null)

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
            .then((res) => res.json())
            .then((data) => {
                setPokemons(data.results)
            })
    }, [])

    useEffect(() => {
        if (selectedPokemonName) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemonName}`)
                .then((res) => res.json())
                .then((data) => {
                    setSelectedPokemonData(data)
                })
        }
    }, [selectedPokemonName])

    const getIdFromUrl = (url) => {
        return url.split("/")[6]
    }
    const filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div>
            <h1>Pokedex</h1>
            <div>
                <input
                    type="text"
                    placeholder="Buscar Pokemon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {filteredPokemons.map((pokemon) => {
                const id = getIdFromUrl(pokemon.url)
                return (
                    <PokemonCard
                        key={pokemon.name}
                        name={pokemon.name}
                        image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                        onClick={() => setSelectedPokemonName(pokemon.name)}
                    />
                )
            })}
            
            {selectedPokemonData && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>{selectedPokemonData.name}</h2>

                        <img src={selectedPokemonData.sprites.front_default} />

                        <p>Tipos:</p>
                        {selectedPokemonData.types.map((type, index) => (
                            <span key={index}>{type.type.name}</span>
                        ))}

                        <p>Stats:</p>
                        {selectedPokemonData.stats.map((stat, index) => (
                            <div key={index}>
                                <strong>{stat.stat.name}</strong>{" "}
                                {stat.base_stat}
                            </div>
                        ))}
                        <button onClick={() => setSelectedPokemonData(null)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
