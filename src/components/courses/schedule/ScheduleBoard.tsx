import MonthOverview from './MonthOverview';
import TrackCard from './TrackCard';
import UpcomingTrackCard from './UpcomingTrackCard';
import { TRACKS, UPCOMING_TRACKS } from './data';

export default function ScheduleBoard() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <MonthOverview />
        {TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
        {UPCOMING_TRACKS.map((track) => (
          <UpcomingTrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
