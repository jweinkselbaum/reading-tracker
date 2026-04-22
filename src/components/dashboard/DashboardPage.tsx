import { useStreak } from '../../hooks/useStreak';
import { useStats } from '../../hooks/useStats';
import { useReadingLog } from '../../hooks/useReadingLog';

interface Props {
  log: ReturnType<typeof useReadingLog>;
}

function StreakWidget({ current, best }: { current: number; best: number }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-indigo-200 text-sm font-medium">Physical reading streak</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-5xl font-bold">{current}</span>
            <span className="text-indigo-200 mb-1.5">day{current !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="text-5xl">🔥</div>
      </div>
      {best > 0 && (
        <p className="text-indigo-200 text-xs mt-3">Best streak: {best} day{best !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function BarChart({ physicalVal, digitalVal, label }: { physicalVal: number; digitalVal: number; label: string }) {
  const total = physicalVal + digitalVal;
  const physPct = total === 0 ? 0 : Math.round((physicalVal / total) * 100);
  const digPct = 100 - physPct;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
        {physPct > 0 && (
          <div className="bg-green-500 transition-all" style={{ width: `${physPct}%` }} />
        )}
        {digPct > 0 && (
          <div className="bg-blue-400 transition-all" style={{ width: `${digPct}%` }} />
        )}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>📖 {physicalVal} physical ({physPct}%)</span>
        <span>📱 {digitalVal} digital</span>
      </div>
    </div>
  );
}

export function DashboardPage({ log }: Props) {
  const { current, best } = useStreak(log.entries);
  const stats = useStats(log.entries);
  const showNudge = log.entries.length > 0 && stats.weekPhysicalPct < 50;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col gap-4">
        {showNudge && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Mostly digital this week</p>
              <p className="text-xs text-amber-600 mt-0.5">Only {stats.weekPhysicalPct}% of your sessions were physical. Try picking up a book or magazine today!</p>
            </div>
          </div>
        )}

        <StreakWidget current={current} best={best} />

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total sessions" value={stats.totalSessions} />
          <StatCard label="Physical %" value={`${stats.physicalPct}%`} sub="of all sessions" />
          <StatCard label="Pages read" value={stats.totalPages} sub="all time" />
          <StatCard label="Articles read" value={stats.totalArticles} sub="all time" />
        </div>

        {log.entries.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4">
            <p className="text-sm font-semibold text-gray-700">This week</p>
            <BarChart
              physicalVal={stats.physicalPages}
              digitalVal={stats.digitalPages}
              label="Pages"
            />
            <BarChart
              physicalVal={stats.physicalArticles}
              digitalVal={stats.digitalArticles}
              label="Articles"
            />
          </div>
        )}

        {log.entries.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-sm">Log some reading sessions to see stats</p>
          </div>
        )}
      </div>
    </div>
  );
}
