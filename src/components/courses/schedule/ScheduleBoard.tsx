import MonthOverview from './MonthOverview';
import TrackCard from './TrackCard';
import { TRACKS } from './data';

export default function ScheduleBoard() {
  return (
    <div className="bg-[#faf0e1]">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <MonthOverview />
        {TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
