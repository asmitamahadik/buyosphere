type TickerProps = {
    items: string[];
};

const Ticker = ({ items }: TickerProps) => {
    const loopItems = [...items, ...items];

    return (
        <div className="bh-ticker">
            <div className="bh-ticker__track">
                {loopItems.map((label, i) => (
                    <span className="bh-ticker__item" key={`${label}-${i}`}>
                        {label}
                        <span className="bh-ticker__star" aria-hidden="true">&#9733;</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Ticker;
