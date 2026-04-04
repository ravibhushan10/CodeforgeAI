import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import axios from 'axios';
import styles from './Problems.module.css';
import { FaMagnifyingGlass, FaShuffle } from "react-icons/fa6";
import Seo from '../components/Seo.jsx';

export default function Problems() {
  const { user, loading: authLoading, diffBadge, toast, openPayment } = useApp();
  const navigate = useNavigate();

  const [problems,     setProblems]     = useState([]);
  const [allProblems,  setAllProblems]  = useState([]);
  const [fetching,     setFetching]     = useState(false);
  const [initialDone,  setInitialDone]  = useState(false);
  const [search,       setSearch]       = useState('');
  const [diff,         setDiff]         = useState('All');
  const [tag,          setTag]          = useState('All');
  const [popupProblem, setPopupProblem] = useState(null);

  const isPro       = user?.plan === 'pro';
  const solvedIds   = new Set((user?.solved || []).map(s => s._id || s));
  const totalSolved = user?.solved?.length || 0;

  const searchRef = useRef(search);
  const diffRef   = useRef(diff);
  const tagRef    = useRef(tag);
  const isProRef  = useRef(isPro);
  useEffect(() => { searchRef.current = search; }, [search]);
  useEffect(() => { diffRef.current   = diff;   }, [diff]);
  useEffect(() => { tagRef.current    = tag;    }, [tag]);
  useEffect(() => { isProRef.current  = isPro;  }, [isPro]);

  const { data: tagsData } = useQuery({
    queryKey:  ['problem-tags'],
    queryFn:   () => axios.get('/api/problems/tags').then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });
  const tags = tagsData ? ['All', ...tagsData] : ['All'];

  const { data: totalData } = useQuery({
    queryKey:  ['problems-total'],
    queryFn:   () => axios.get('/api/problems/total').then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });
  const totalCount = totalData?.total || 0;

  const fetchProblems = useCallback(async () => {
    setFetching(true);
    try {
      const params = {};
      if (searchRef.current)         params.search     = searchRef.current;
      if (diffRef.current !== 'All') params.difficulty = diffRef.current;
      if (tagRef.current  !== 'All') params.tag        = tagRef.current;

      const { data } = await axios.get('/api/problems', { params: { ...params, limit: 500 } });
      const all = data.problems;

      const visible = isProRef.current
        ? all
        : all.filter(p => p.number <= 40);

      setProblems(visible);

      if (!searchRef.current && diffRef.current === 'All' && tagRef.current === 'All') {
        setAllProblems(visible);
      }
    } catch {
      toast('Failed to load problems', 'error');
    } finally {
      setFetching(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authLoading) return;
    fetchProblems().then(() => setInitialDone(true));
  }, [authLoading]);

  useEffect(() => {
    if (!initialDone) return;
    fetchProblems();
  }, [diff, tag]);

  const debounceRef = useRef(null);
  useEffect(() => {
    if (!initialDone) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (search === '') { fetchProblems(); return; }
    debounceRef.current = setTimeout(() => fetchProblems(), 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const handleClearFilters = () => { setDiff('All'); setTag('All'); setSearch(''); };

  const easy   = allProblems.filter(p => p.difficulty === 'Easy').length;
  const medium = allProblems.filter(p => p.difficulty === 'Medium').length;
  const hard   = allProblems.filter(p => p.difficulty === 'Hard').length;
  const total  = allProblems.length;

  const handleRandom = async () => {
    try {
      const { data } = await axios.get('/api/problems', { params: { limit: 500 } });
      const pool = isPro
        ? data.problems
        : data.problems.filter(p => p.number <= 40 && !p.premium);
      if (pool.length) navigate(`/problems/${pool[Math.floor(Math.random() * pool.length)].slug}`);
    } catch { toast('Could not load random problem', 'error'); }
  };

  const showSkeleton = authLoading || (!initialDone && problems.length === 0);

  return (
    <>
     <Seo title="Problems" noindex={true} path="/problems" />
    <div className={`${styles.page} page-animate`}>
      <div className={styles.inner}>

        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideTitle}>Tags</div>
            <div className={styles.tagList}>
              {tags.map(t => (
                <button key={t}
                className={`${styles.tagBtn} ${tag === t ? styles.tagActive : ''}`}
                  onClick={() => setTag(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className={styles.main}>

          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <FaMagnifyingGlass className={styles.searchIcon} />
              <input
                className={`input ${styles.searchInput}`}
                placeholder="Search problems…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    fetchProblems();
                  }
                }}
              />
            </div>

            <div className={styles.diffDropWrap}>
              <select className={styles.diffSelect} value={diff} onChange={e => setDiff(e.target.value)}>
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {user && total > 0 && (
              <div className={styles.solvedDropWrap}>
                <button className={styles.solvedCounter}>
                  <span className={styles.solvedNum}>{totalSolved}</span>
                  <span className={styles.solvedSlash}>/</span>
                  <span className={styles.solvedTotal}>{total}</span>
                  <span className={styles.solvedLabel}>solved</span>
                  <span className={styles.solvedArrow}>▾</span>
                </button>
                <div className={styles.solvedDropdown}>
                  <div className={styles.solvedDropRow}>
                    <span className={styles.solvedDropDot} style={{ background: 'var(--green)' }} />
                    <span className={styles.solvedDropLabel}>Easy</span>
                    <span className={styles.solvedDropVal}>
                      {user.solved?.filter(p => p.difficulty === 'Easy').length || 0}
                      <span className={styles.solvedDropTotal}> / {easy}</span>
                    </span>
                  </div>
                  <div className={styles.solvedDropRow}>
                    <span className={styles.solvedDropDot} style={{ background: 'var(--orange)' }} />
                    <span className={styles.solvedDropLabel}>Medium</span>
                    <span className={styles.solvedDropVal}>
                      {user.solved?.filter(p => p.difficulty === 'Medium').length || 0}
                      <span className={styles.solvedDropTotal}> / {medium}</span>
                    </span>
                  </div>
                  <div className={styles.solvedDropRow}>
                    <span className={styles.solvedDropDot} style={{ background: 'var(--red)' }} />
                    <span className={styles.solvedDropLabel}>Hard</span>
                    <span className={styles.solvedDropVal}>
                      {user.solved?.filter(p => p.difficulty === 'Hard').length || 0}
                      <span className={styles.solvedDropTotal}> / {hard}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button className={`btn btn-ghost btn-sm ${styles.randomBtn}`} onClick={handleRandom}>
              <FaShuffle style={{ fontSize: 13 }} /> Pick Random
            </button>
          </div>

          <div className={styles.resultsRow}>
            <span className="text-muted" style={{ fontSize: '.8rem' }}>
              {showSkeleton ? '\u00a0' : `${problems.length} problem${problems.length !== 1 ? 's' : ''}`}
            </span>
            {(diff !== 'All' || tag !== 'All' || search) && (
              <button className="btn btn-ghost btn-sm" onClick={handleClearFilters}>
                ✕ Clear filters
              </button>
            )}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th style={{ width: 44 }}>Status</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Tags</th>
                  <th>Acceptance</th>
                </tr>
              </thead>
              <tbody>
                {showSkeleton
                  ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={`sk-${i}`} className={styles.skeletonRow}>
                        <td><div className={`skeleton ${styles.skCell}`} style={{ width: 24 }} /></td>
                        <td><div className={`skeleton ${styles.skCell}`} style={{ width: 20, borderRadius: '50%' }} /></td>
                        <td><div className={`skeleton ${styles.skCell}`} style={{ width: `${140 + (i % 4) * 40}px` }} /></td>
                        <td><div className={`skeleton ${styles.skCell}`} style={{ width: 60 }} /></td>
                        <td><div className={`skeleton ${styles.skCell}`} style={{ width: 80 }} /></td>
                        <td><div className={`skeleton ${styles.skCell}`} style={{ width: 44 }} /></td>
                      </tr>
                    ))
                    : problems.map(p => {
                      const isSolved  = solvedIds.has(p._id);
                      const isLocked  = !isPro && p.premium;
                      const popupOpen = popupProblem === p._id;

                      return (
                        <tr
                          key={p._id}
                          className={`
                            ${isSolved ? styles.solvedRow : ''}
                            ${isLocked ? styles.lockedRow : ''}
                            ${popupOpen ? styles.popupOpenRow : ''}
                            ${styles.clickableRow}
                          `}
                          onClick={(e) => {
                            if (popupOpen) { setPopupProblem(null); return; }
                            if (isLocked)  { setPopupProblem(p._id); return; }
                            navigate(`/problems/${p.slug}`);
                          }}
                        >
                          <td className={styles.numCell}>{p.number}</td>

                          <td className={styles.statusCell}>
                            {isSolved
                              ? <span className={styles.solvedIcon}>✓</span>
                              : <span className={styles.unsolvedIcon} />}
                          </td>

                          <td className={styles.titleCell} style={{ position: 'relative' }}>
                            <span className={styles.titleLink}>
                              {p.title}
                              {!isPro && p.premium && (
                                <span className="badge badge-premium" style={{ marginLeft: 8 }}>
                                  Premium
                                </span>
                              )}
                            </span>

                            <div className={styles.companies}>
                              {(p.companies || []).slice(0, 3).map(c => (
                                <span key={c} className={styles.company}>{c}</span>
                              ))}
                            </div>

                            {popupOpen && (
                              <div
                                className={styles.inlinePopup}
                                onClick={e => e.stopPropagation()}
                              >
                                <div className={styles.inlinePopupText}>
                                  <strong>Premium Problem</strong>
                                  <span>Unlock Pro to access all premium problems</span>
                                </div>
                                <button
                                  className={`btn btn-primary btn-sm ${styles.inlinePopupBtn}`}
                                  onClick={() => { setPopupProblem(null); openPayment(); }}
                                >
                                  Unlock Pro
                                </button>
                                <button
                                  className={styles.inlinePopupClose}
                                  onClick={e => { e.stopPropagation(); setPopupProblem(null); }}
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </td>

                          <td>
                            <span className={`badge ${diffBadge(p.difficulty)}`}>{p.difficulty}</span>
                          </td>

                          <td className={styles.tagsCell}>
                            {(p.tags || []).slice(0, 2).map(t => (
                              <button
                                key={t}
                                className={styles.tagChip}
                                onClick={e => { e.stopPropagation(); setTag(t); }}
                              >
                                {t}
                              </button>
                            ))}
                          </td>

                          <td className={styles.acceptCell}>{p.acceptance?.toFixed(1)}%</td>
                        </tr>
                      );
                    })
                  }

                {!isPro && !showSkeleton && totalCount > 0 && (
                  <tr className={styles.upgradeRow}>
                    <td colSpan={6} className={styles.upgradeCell}>
                      <div className={styles.upgradeBanner}>
                        <div className={styles.upgradeText}>
                          <span className={styles.upgradeTitle}>
                            Showing 40 out of {totalCount}+ problems
                          </span>
                          <span className={styles.upgradeSub}>
                            Upgrade to Pro to unlock all {totalCount}+ problems
                          </span>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={openPayment}>
                          Unlock Pro · ₹10/month
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {!showSkeleton && !fetching && problems.length === 0 && (
              <div className={styles.empty}>
                <p>No problems found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
