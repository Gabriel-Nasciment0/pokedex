import styles from "./PokemonCard.module.css"
export default function PokemonCard({ name, image, onClick }) {
    return (
        <div
            className={styles.card}
            onClick={onClick}
        >
            <img
                src={image}
                alt={name}
            />
            <p>{name}</p>
        </div>
    )
}
