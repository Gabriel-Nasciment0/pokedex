import { useEffect, useState } from "react"
import PokemonCard from "./components/PokemonCard"
import "./styles/App.css"

export default function App() {
    const [pokemons, setPokemons] = useState([])
    const [search, setSearch] = useState("")
    const [selectedPokemonName, setSelectedPokemonName] = useState(null)
    const [selectedPokemonData, setSelectedPokemonData] = useState(null)
    const [limit, setLimit] = useState(50)
    const [pokemonDescription, setPokemonDescription] = useState("")
    const typeColors = {
        fire: "#f08030",
        water: "#6890f0",
        grass: "#78c850",
        electric: "#f8d030",
        psychic: "#f85888",
        ice: "#98d8d8",
        dragon: "#7038f8",
        dark: "#705848",
        fairy: "#ee99ac",
        normal: "#a8a878",
        fighting: "#c03028",
        flying: "#a890f0",
        poison: "#a040a0",
        ground: "#e0c068",
        rock: "#b8a038",
        bug: "#a8b820",
        ghost: "#705898",
        steel: "#b8b8d0",
    }

    useEffect(() => {
        async function fetchPokemons() {
            const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
            )
            const data = await res.json()

            const detailedPokemons = await Promise.all(
                data.results.map(async (pokemon) => {
                    const res = await fetch(pokemon.url)
                    return await res.json()
                }),
            )

            setPokemons(detailedPokemons)
        }

        fetchPokemons()
    }, [limit])

    useEffect(() => {
        if (selectedPokemonName) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemonName}`)
                .then((res) => res.json())
                .then((data) => {
                    setSelectedPokemonData(data)
                })
        }
        fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${selectedPokemonName}`,
        )
            .then((res) => res.json())
            .then((data) => {
                const entry = data.flavor_text_entries.find(
                    (item) => item.language.name === "en",
                )
                setPokemonDescription(
                    entry ? entry.flavor_text.replace(/\f|\n/g, " ") : "",
                )
            })
    }, [selectedPokemonName])

    const filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase()),
    )
    const mainType = selectedPokemonData?.types?.[0]?.type?.name || "normal"
    return (
        <div className="app">
            {/* LEFT */}
            <div className="left">
                <h1>Pokedex</h1>

                <input
                    type="text"
                    placeholder="Buscar Pokemon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="grid">
                    {filteredPokemons.map((pokemon) => {
                        return (
                            <PokemonCard
                                key={pokemon.id}
                                id={pokemon.id}
                                name={pokemon.name}
                                image={pokemon.sprites.front_default}
                                types={pokemon.types}
                                onClick={() =>
                                    setSelectedPokemonName(pokemon.name)
                                }
                            />
                        )
                    })}
                </div>
                <button onClick={() => setLimit((prev) => prev + 50)}>
                    Carregar mais
                </button>
            </div>

            {/* RIGHT */}

            <div
                className="right"
                style={{
                    background: `linear-gradient(180deg, ${typeColors[mainType]}, #ffffff)`,
                }}
            >
                {selectedPokemonData ? (
                    <>
                        <div className="header">
                            <h2>
                                {selectedPokemonData.name
                                    .charAt(0)
                                    .toUpperCase() +
                                    selectedPokemonData.name.slice(1)}
                            </h2>
                            <button
                                onClick={() => setSelectedPokemonData(null)}
                            >
                                X
                            </button>
                        </div>

                        <img
                            src={
                                selectedPokemonData.sprites.other[
                                    "official-artwork"
                                ].front_default
                            }
                        />

                        {/* TIPOS */}
                        <p>Tipos:</p>
                        {selectedPokemonData.types.map((type, index) => (
                            <span
                                key={index}
                                style={{
                                    background: typeColors[type.type.name],
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    marginRight: "5px",
                                }}
                            >
                                {type.type.name}
                            </span>
                        ))}

                        {/* STATS */}
                        <p>Stats:</p>
                        {selectedPokemonData.stats.map((stat, index) => (
                            <div
                                key={index}
                                className="statRow"
                            >
                                <span>{stat.stat.name}</span>

                                <div className="statBar">
                                    <div
                                        className="statFill"
                                        style={{
                                            width: `${stat.base_stat / 2}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {/*description*/}
                        <p className="description">{pokemonDescription}</p>
                    </>
                ) : (
                    <p>Selecione um Pokémon</p>
                )}
            </div>
        </div>
    )
}
