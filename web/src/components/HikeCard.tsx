import { Link } from "react-router-dom";
import type { Hike } from "../types";
import { dateParts, formatDate } from "../lib/format";
import { HikeImage } from "./Placeholder";
import { DifficultyBadge } from "./DifficultyBadge";
import { Icon } from "./Icon";

export function HikeCard({ hike }: { hike: Hike }) {
  const dp = dateParts(hike.date);
  return (
    <article className="hike-card">
      <div className="media">
        <HikeImage src={hike.image} alt={`Pohod: ${hike.title}`} seed={hike.slug} />
        <div className="date-chip">
          <span className="d">{dp.day}</span>
          <span className="mo">{dp.month}</span>
        </div>
        <div className="badge-wrap">
          <DifficultyBadge difficulty={hike.difficulty} />
        </div>
      </div>
      <div className="body">
        <h3>
          <Link to={`/pohodi/${hike.slug}`}>{hike.title}</Link>
        </h3>
        <div className="hike-meta-inline">
          <span>
            <Icon name="calendar" />
            {formatDate(hike.date)}
          </span>
          <span>
            <Icon name="map-pin" />
            {hike.location}
          </span>
        </div>
        <p className="excerpt">{hike.description}</p>
        <span className="card-more">
          Več o pohodu <Icon name="arrow-right" />
        </span>
      </div>
    </article>
  );
}
