import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrend } from "../api/trends";

const MEDIA_URL = "https://api.clo.co.in/storage";

export default function TrendDetail() {
  const { slug } = useParams();
  const [trend, setTrend] = useState(null);

  useEffect(() => {
    getTrend(slug).then(setTrend);
  }, [slug]);

  if (!trend) return <div>Loading...</div>;

  return (
    <section className="container mx-auto px-4 py-10">
      <img
        src={`${MEDIA_URL}/${trend.image}`}
        alt={trend.title}
        className="w-full rounded-lg"
      />

      <h1 className="text-3xl font-bold mt-6">
        {trend.title}
      </h1>

      <div
        className="mt-4"
        dangerouslySetInnerHTML={{
          __html: trend.description,
        }}
      />
    </section>
  );
}