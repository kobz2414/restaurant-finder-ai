import { Star } from 'lucide-react';

const Rating = ({ rating }: { rating: number }) => {
    const maxRating = 5;
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
        const isFilled = i <= rating;
        stars.push(
            <Star
                key={i}
                size={12}
                fill={isFilled ? "#FFD700" : "none"}
                color={isFilled ? "#FFD700" : "#D3D3D3"}
                strokeWidth={1.5}
            />
        );
    }

    return <div className="flex">{stars}</div>;
}

export default Rating;