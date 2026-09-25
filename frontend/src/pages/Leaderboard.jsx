import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import UserAvatar from '../components/UserAvatar.jsx';
import Pagination from '../components/Pagination.jsx';
import axios from 'axios';
import styles from './Leaderboard.module.css';
import Seo from '../components/Seo.jsx';

const MEDALS     = ['🥇', '🥈', '🥉'];
const RANK_COLOR = ['#FFB800', '#9ca3af', '#cd7f32'];
const PAGE_SIZE  = 10;

export default function Leaderboard() {
  const { user } = useApp();
  const [page, setPage] = useState(1);

  const { data, isLoading: loading } = useQuery({
    queryKey: ['leaderboard', page, user?._id],
    queryFn: () =>
      axios
        .get('/api/users/leaderboard', {
          params: { page, limit: PAGE_SIZE, userId: user?._id },
        })
        .then(r => r.data),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });

  const rawLeaders = data?.leaders ?? [];
  const you        = data?.you ?? null;
  const totalPages = data?.totalPages ?? 1;
  const rankOffset = (page - 1) * PAGE_SIZE;

  // Podium always shows the real top 3 for page 1, untouched by pinning
  const podiumData  = page === 1 ? rawLeaders.slice(0, 3) : [];
  const podiumOrder = [];
  if (podiumData[1]) podiumOrder.push({ p: podiumData[1], rank: 2 });
  if (podiumData[0]) podiumOrder.push({ p: podiumData[0], rank: 1 });
  if (podiumData[2]) podiumOrder.push({ p: podiumData[2], rank: 3 });

  // WHY: "you" is only pinned when you're NOT already among this page's
  // leaders. When pinned, your row goes first in the table and we trim the
  // rest to PAGE_SIZE - 1 so page 1 still totals 10 rows including you.
  const youInLeaders = you && rawLeaders.some(l => l._id === you._id);
  const pinYou = page === 1 && you && !youInLeaders;

  const otherLeaders = pinYou ? rawLeaders.slice(0, PAGE_SIZE - 1) : rawLeaders;

  const tableRows = pinYou
    ? [
        { ...you, displayRank: you.rank, isPinned: true },
        ...otherLeaders.map((l, i) => ({ ...l, displayRank: l.rank || rankOffset + i + 1 })),
      ]
    : rawLeaders.map((l, i) => ({ ...l, displayRank: l.rank || rankOffset + i + 1 }));

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <Seo title="Leaderboard" noindex={true} path="/leaderboard" />
    <div className={`${styles.page} page-animate`}>
      <div className={styles.inner}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Leaderboard</h1>
            <p className={styles.sub}>Top coders ranked by rating</p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}><span className="spinner spinner-lg" /></div>
        ) : (
          <>
            {podiumData.length > 0 && (
              <div className={styles.podium}>
                {podiumOrder.map(({ p, rank }) => {
                  const isMe = user?._id === p._id?.toString();
                  const color   = RANK_COLOR[rank - 1];
                  const isFirst = rank === 1;
                  return (
                    <div
                      key={p._id || p.name}
                      className={`${styles.podiumCard} ${isFirst ? styles.podiumFirst : styles.podiumSecondary}`}
                      style={{ borderColor: color }}
                    >
                      <div className={styles.podiumRankPill} style={{ color, borderColor: color }}>
                        #{rank}
                      </div>
                      <div className={styles.podiumMedal}>{MEDALS[rank - 1]}</div>
                      <div className={styles.podiumAvatarWrap} style={{ outlineColor: color }}>
                        <UserAvatar avatarUrl={p.avatarUrl} name={p.name} size={isFirst ? 72 : 60} />
                      </div>
                      <div className={styles.podiumName}>{p.name}</div>
                      {isMe && <span className={styles.youBadge}>You</span>}
                      <div className={styles.podiumRating} style={{ color }}>{p.rating}</div>
                      <div className={styles.podiumTitle}>{p.ratingTitle}</div>
                      <div className={styles.podiumStats}>
                        <div className={styles.podiumStat}>
                          <span className={styles.podiumStatVal}>{p.solved}</span>
                          <span className={styles.podiumStatLabel}>solved</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={styles.tableWrap}>
              <div className={styles.tableHead}>
                <div className={styles.thRank}>Rank</div>
                <div className={styles.thUser}>User</div>
                <div className={styles.thRating}>Rating</div>
                <div className={styles.thTitle}>Title</div>
                <div className={styles.thSolved}>Solved</div>
              </div>

              {tableRows.map((l) => {
                const isMe = l.isPinned || user?._id === l._id?.toString();
                const isTop = page === 1 && l.displayRank <= 3;
                return (
                  <div
                    key={l._id || l.name}
                    className={`${styles.tableRow} ${isMe ? styles.myRow : ''}`}
                  >
                    <div className={styles.tdRank}>
                      {isTop
                        ? <span className={styles.medal}>{MEDALS[l.displayRank - 1]}</span>
                        : <span className={styles.rankNum}>#{l.displayRank}</span>}
                    </div>
                    <div className={styles.tdUser}>
                      <UserAvatar avatarUrl={l.avatarUrl} name={l.name} size={34} />
                      <div className={styles.userInfo}>
                        <span className={styles.uname}>{l.name}</span>
                        {isMe && <span className={styles.youBadge}>You</span>}
                      </div>
                    </div>
                    <div className={styles.tdRating}>
                      <span className={styles.ratingVal}>{l.rating}</span>
                    </div>
                    <div className={styles.tdTitle}>{l.ratingTitle}</div>
                    <div className={styles.tdSolved}>
                      <span className={styles.solvedVal}>{l.solved}</span>
                    </div>
                  </div>
                );
              })}

              {tableRows.length === 0 && (
                <div className={styles.empty}>No users yet. Be the first!</div>
              )}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
    </>
  );
}