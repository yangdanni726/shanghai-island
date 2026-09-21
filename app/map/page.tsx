import Link from "next/link";
import LocationCard from "@/components/LocationCard";
import { DISTRICTS, getDistrictById } from "@/data/districts";
import { getLocationsByDistrict, CATEGORY_LABELS } from "@/data/locations";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ district?: string }>;
}) {
  const { district } = await searchParams;
  const districtId = district || "huangpu";
  const info = getDistrictById(districtId) || DISTRICTS[0];
  const locations = getLocationsByDistrict(districtId);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-4 pt-6 pb-2">
        <Link href="/" className="text-xs text-[var(--ink-faint)] mb-2 inline-block">
          ← 返回岛屿地图
        </Link>
        <h1 className="text-xl font-bold text-[var(--ink)]">{info.name}</h1>
        <p className="text-xs text-[var(--ink-faint)] mt-0.5">{info.description}</p>
      </div>

      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {DISTRICTS.map((d) => (
            <Link key={d.id} href={`/map?district=${d.id}`}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                d.id === districtId
                  ? "bg-[var(--ocean)] text-white"
                  : "bg-white text-[var(--ink-soft)] border border-black/5"
              }`}>
              {d.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_LABELS.map((c) => (
            <span key={c.id}
              className="text-xs px-3 py-1 rounded-full bg-[var(--ocean)]/8 text-[var(--ocean)] whitespace-nowrap">
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <h2 className="text-sm font-bold text-[var(--ink)] mb-3">今日热门地点</h2>
        {locations.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {locations.map((spot) => (
              <LocationCard key={spot.id}
                name={spot.name} tag={spot.tag} distance={spot.distance}
                recommendCount={spot.recommendCount} emoji={spot.emoji} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--ink-faint)] text-center py-8">
            该区域地点正在发掘中...
          </p>
        )}
      </div>
    </div>
  );
}
