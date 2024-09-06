import { Badge, User } from "@/constants/interfaces";
import { useEffect, useState } from "react";

interface BadgesListProps {
    user: User;
}

const BadgesList: React.FC<BadgesListProps> = ({ user }) => {
    const [badges, setBadges] = useState<Badge[]>([]);

    useEffect(() => {
        if (user) {
            setBadges(user.badges ?? [])
        }
    }, [user]);

    if (badges.length === 0)
        return <p>No badges yet</p>

    return (
        <div className="flex flex-wrap justify-center">
            {badges.map((badge) => (
                <div
                    key={badge.badge_id}
                    className="bg-gray-200 rounded-lg p-4 m-2 flex items-center"
                >
                    {/* <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="w-8 h-8 mr-2"
                    /> */}
                    <span>{badge.name}</span>
                </div>
            ))

            }
        </div>
    );
};

export default BadgesList;