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

export default function PokemonCard({
    id,
    name,
    image,
    types,
    isFavorite,
    onFavorite,
    onClick,
}) {
    const mainType = types[0].type.name
    return (
        <div
            className={styles.card}
            onClick={onClick}
            style={{
                background: `linear-gradient(135deg, ${typeColors[mainType]}, #ffffff)`,
            }}
        >
            <button
                className={styles.favoriteBtn}
                onClick={(e) => {
                    e.stopPropagation()
                    onFavorite()
                }}
            >
                {isFavorite ? "★" : "☆"}
            </button>
            <span className={styles.number}>#{id}</span>

            <img
                src={image}
                alt={name}
            />

            <p className={styles.name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </p>

            <div className={styles.types}>
                {types.map((type, index) => (
                    <span
                        key={index}
                        style={{
                            background: typeColors[type.type.name],
                        }}
                        className={styles.type}
                    >
                        {type.type.name}
                    </span>
                ))}
            </div>
        </div>
    )
}
