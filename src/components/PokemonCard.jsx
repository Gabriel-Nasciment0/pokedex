import styles from "./PokemonCard.module.css"
export default function PokemonCard({ name, image }) {
    return (
        <div className={styles.Card}>
            <img
                src={image}
                alt={name}
            />
            <p>{name}</p>
        </div>
    )
}
