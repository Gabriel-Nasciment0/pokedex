import styles from "./PokemonCard.module.css"

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

function capitalize(text = "") {
    if (!text) return ""
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function PokemonCard({
    id,
    name,
    image,
    types = [],
    loading = false,
    isFavorite,
    onFavorite,
    onClick,
}) {
    const mainType = types?.[0]?.type?.name || "normal"
    const hasImage = Boolean(image)

    return (
        <div
            className={styles.card}
            onClick={loading ? undefined : onClick}
            style={{
                background: `linear-gradient(135deg, ${typeColors[mainType]}18, #ffffff)`,
            }}
        >
            <button
                type="button"
                className={styles.favoriteBtn}
                onClick={(e) => {
                    e.stopPropagation()
                    if (!loading) onFavorite?.()
                }}
                aria-label={
                    isFavorite
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                }
            >
                {isFavorite ? "★" : "☆"}
            </button>

            <span className={styles.number}>#{id ?? "..."}</span>

            {loading ? (
                <div className={styles.imagePlaceholder}>Carregando...</div>
            ) : hasImage ? (
                <img
                    src={image}
                    alt={name}
                />
            ) : (
                <div className={styles.imagePlaceholder}>Sem imagem</div>
            )}

            <p className={styles.name}>
                {loading ? "Carregando..." : capitalize(name)}
            </p>

            <div className={styles.types}>
                {loading ? (
                    <span className={styles.type}>...</span>
                ) : (
                    types.map((type) => (
                        <span
                            key={type.slot}
                            style={{
                                background:
                                    typeColors[type.type.name] ?? "#777",
                            }}
                            className={styles.type}
                        >
                            {type.type.name}
                        </span>
                    ))
                )}
            </div>
        </div>
    )
}
