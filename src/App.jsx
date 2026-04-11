import { useEffect, useMemo, useRef, useState } from "react"
import PokemonCard from "./components/PokemonCard"
import "./styles/App.css"

const PAGE_SIZE = 24
const TOTAL_POKEMON_LIMIT = 1000

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

function getPokemonIdFromUrl(url) {
    const match = url.match(/\/pokemon\/(\d+)\/?$/)
    return match ? Number(match[1]) : null
}

function capitalize(text = "") {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

function normalizeDescription(text = "") {
    return text.replace(/\f|\n/g, " ").replace(/\s+/g, " ").trim()
}

export default function App() {
    const [catalog, setCatalog] = useState([])
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const [search, setSearch] = useState("")
    const [selectedPokemon, setSelectedPokemon] = useState(null)
    const [description, setDescription] = useState("")
    const [detailsCache, setDetailsCache] = useState({})
    const [loading, setLoading] = useState(true)

    const leftRef = useRef(null)
    const loadMoreRef = useRef(null)

    const filtered = useMemo(() => {
        const term = search.toLowerCase()
        return catalog.filter((p) => p.name.includes(term))
    }, [catalog, search])

    const visible = useMemo(() => {
        return filtered.slice(0, visibleCount)
    }, [filtered, visibleCount])

    const hasMore = visibleCount < filtered.length

    // 🔹 carregar lista
    useEffect(() => {
        async function fetchData() {
            const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON_LIMIT}`,
            )
            const data = await res.json()

            const list = data.results
                .map((p) => ({
                    name: p.name,
                    url: p.url,
                    id: getPokemonIdFromUrl(p.url),
                }))
                .sort((a, b) => a.id - b.id)

            setCatalog(list)
            setLoading(false)
        }

        fetchData()
    }, [])

    // 🔹 scroll infinito
    useEffect(() => {
        if (!hasMore) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisibleCount((prev) => prev + PAGE_SIZE)
                }
            },
            {
                root: leftRef.current,
                rootMargin: "100px",
            },
        )

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => observer.disconnect()
    }, [hasMore])

    // 🔹 carregar detalhes dos cards
    useEffect(() => {
        const missing = visible.filter((p) => !detailsCache[p.name])
        if (missing.length === 0) return

        Promise.all(
            missing.map(async (p) => {
                const res = await fetch(p.url)
                const data = await res.json()
                return [p.name, data]
            }),
        ).then((results) => {
            setDetailsCache((prev) => {
                const next = { ...prev }
                results.forEach(([name, data]) => {
                    next[name] = data
                })
                return next
            })
        })
    }, [visible])

    // 🔹 selecionar pokemon
    async function handleSelect(name) {
        const [p, s] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((r) =>
                r.json(),
            ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(
                (r) => r.json(),
            ),
        ])

        const entry = s.flavor_text_entries.find(
            (e) => e.language.name === "en",
        )

        setSelectedPokemon(p)
        setDescription(
            normalizeDescription(entry?.flavor_text || "Sem descrição"),
        )
    }

    return (
        <div className="app">
            <div
                className="left"
                ref={leftRef}
            >
                <div className="searchBar">
                    <input
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <div className="grid">
                        {visible.map((p) => {
                            const d = detailsCache[p.name]

                            return (
                                <PokemonCard
                                    key={p.id}
                                    id={p.id}
                                    name={p.name}
                                    image={d?.sprites?.front_default}
                                    types={d?.types}
                                    loading={!d}
                                    onClick={() => handleSelect(p.name)}
                                />
                            )
                        })}
                    </div>
                )}

                <div
                    ref={loadMoreRef}
                    style={{ height: 20 }}
                />
            </div>

            <div className={`right ${selectedPokemon ? "open" : ""}`}>
                {selectedPokemon && (
                    <div className="detailCard">
                        {/* HEADER */}
                        <div
                            className="detailHeader"
                            style={{
                                background: `linear-gradient(135deg, ${
                                    typeColors[
                                        selectedPokemon.types[0].type.name
                                    ]
                                }, #ffffff)`,
                            }}
                        >
                            <button
                                className="closeBtn"
                                onClick={() => setSelectedPokemon(null)}
                            >
                                ←
                            </button>

                            <span className="detailNumber">
                                #{String(selectedPokemon.id).padStart(3, "0")}
                            </span>

                            <h2>{capitalize(selectedPokemon.name)}</h2>

                            <div className="detailTypes">
                                {selectedPokemon.types.map((t) => (
                                    <span
                                        key={t.slot}
                                        className="detailTypeTag"
                                        style={{
                                            background: typeColors[t.type.name],
                                        }}
                                    >
                                        {t.type.name}
                                    </span>
                                ))}
                            </div>

                            <img
                                src={
                                    selectedPokemon.sprites.other[
                                        "official-artwork"
                                    ].front_default
                                }
                            />
                        </div>

                        {/* BODY */}
                        <div className="detailBody">
                            <p className="description">{description}</p>

                            {/* INFO */}
                            <div className="info">
                                <div>
                                    <p>Altura</p>
                                    <strong>
                                        {selectedPokemon.height / 10} m
                                    </strong>
                                </div>

                                <div>
                                    <p>Peso</p>
                                    <strong>
                                        {selectedPokemon.weight / 10} kg
                                    </strong>
                                </div>

                                <div>
                                    <p>Base EXP</p>
                                    <strong>
                                        {selectedPokemon.base_experience}
                                    </strong>
                                </div>
                            </div>

                            {/* STATS */}
                            <div className="stats">
                                {selectedPokemon.stats.map((stat) => (
                                    <div key={stat.stat.name}>
                                        <div className="statLabel">
                                            <span>{stat.stat.name}</span>
                                            <strong>{stat.base_stat}</strong>
                                        </div>

                                        <div className="bar">
                                            <div
                                                className="fill"
                                                style={{
                                                    width: `${
                                                        Math.min(
                                                            stat.base_stat,
                                                            200,
                                                        ) / 2
                                                    }%`,
                                                    background:
                                                        typeColors[
                                                            selectedPokemon
                                                                .types[0].type
                                                                .name
                                                        ],
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
