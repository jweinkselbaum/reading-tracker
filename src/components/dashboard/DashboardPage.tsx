import { useStreak } from '../../hooks/useStreak';
import { useStats } from '../../hooks/useStats';
import { useReadingLog } from '../../hooks/useReadingLog';

interface Props {
  log: ReturnType<typeof useReadingLog>;
}

function StreakWidget({ current, best }: { current: number; best: number }) {
  return (
    <div
      className="rounded-2xl p-6 text-white h-full flex flex-col justify-between"
      style={{
        background: 'linear-gradient(145deg, #3A6127 0%, #2C4A1E 60%, #1E3314 100%)',
        boxShadow: '0 4px 16px rgba(44,74,30,0.3), 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-green-200/70">Physical reading streak</p>
      <div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-7xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{current}</span>
          <span className="text-green-200/70 text-xl">{current === 1 ? 'day' : 'days'}</span>
        </div>
        {best > 0 && (
          <p className="text-green-200/50 text-xs mt-3 tracking-wide">Best: {best} {best === 1 ? 'day' : 'days'}</p>
        )}
      </div>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.25" className="self-end">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: '#FDFAF5',
        border: '1px solid #E0D8CC',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-bold text-[#1A1512] mt-1.5 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{value}</p>
      {sub && <p className="text-xs text-[#B0A89E] mt-0.5">{sub}</p>}
    </div>
  );
}

function BarChart({ physicalVal, digitalVal, label }: { physicalVal: number; digitalVal: number; label: string }) {
  const total = physicalVal + digitalVal;
  const physPct = total === 0 ? 0 : Math.round((physicalVal / total) * 100);
  const digPct = 100 - physPct;

  return (
    <div>
      <p className="text-xs font-semibold text-[#6B6059] uppercase tracking-wide mb-2">{label}</p>
      <div
        className="flex rounded-md overflow-hidden h-2.5"
        style={{ background: '#E0D8CC', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)' }}
      >
        {physPct > 0 && <div className="transition-all" style={{ width: `${physPct}%`, background: 'linear-gradient(90deg, #3A6127, #2C4A1E)' }} />}
        {digPct > 0 && <div className="transition-all" style={{ width: `${digPct}%`, background: 'linear-gradient(90deg, #4A7A9B, #2A5A7E)' }} />}
      </div>
      <div className="flex justify-between text-xs text-[#9B928A] mt-1.5">
        <span style={{ color: '#2C4A1E' }}>{physicalVal} physical ({physPct}%)</span>
        <span style={{ color: '#2A5A7E' }}>{digitalVal} digital</span>
      </div>
    </div>
  );
}

export function DashboardPage({ log }: Props) {
  const { current, best } = useStreak(log.entries);
  const stats = useStats(log.entries);
  const showNudge = log.entries.length > 0 && stats.weekPhysicalPct < 50;

  return (
    <div className="px-5 md:px-8 pt-6 pb-24 md:pb-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-[#1A1512] mb-5" style={{ fontFamily: 'Georgia, serif' }}>Dashboard</h1>

      {showNudge && (
        <div
          className="rounded-xl p-4 flex gap-3 items-start mb-4"
          style={{ background: '#FBF5E6', border: '1px solid #E8D9B0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p className="text-sm font-semibold text-[#6B4C0A]">Mostly digital this week</p>
            <p className="text-xs text-[#8B6914] mt-0.5">Only {stats.weekPhysicalPct}% of your sessions were physical. Try picking up a book or magazine today.</p>
          </div>
        </div>
      )}

      {/* Desktop: streak left, stats right. Mobile: stacked. */}
      <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-5 flex flex-col gap-4 mb-4">
        <StreakWidget current={current} best={best} />
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total sessions" value={stats.totalSessions} />
          <StatCard label="Physical %" value={`${stats.physicalPct}%`} sub="of all sessions" />
          <StatCard label="Pages read" value={stats.totalPages} sub="all time" />
          <StatCard label="Articles read" value={stats.totalArticles} sub="all time" />
        </div>
      </div>

      {log.entries.length > 0 && (
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: '#FDFAF5', border: '1px solid #E0D8CC', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <p className="text-xs font-bold text-[#9B928A] uppercase tracking-widest">This week</p>
          <BarChart physicalVal={stats.physicalPages} digitalVal={stats.digitalPages} label="Pages" />
          <BarChart physicalVal={stats.physicalArticles} digitalVal={stats.digitalArticles} label="Articles" />
        </div>
      )}

      {log.entries.length === 0 && (
        <div className="text-center py-16 text-[#9B928A]">
          <div className="w-10 h-10 mx-auto mb-3 opacity-25">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
              <rect x="3" y="12" width="4" height="9" rx="1"/>
              <rect x="10" y="7" width="4" height="14" rx="1"/>
              <rect x="17" y="3" width="4" height="18" rx="1"/>
            </svg>
          </div>
          <p className="text-sm">Log some sessions to see your stats</p>
        </div>
      )}
    </div>
  );
}
