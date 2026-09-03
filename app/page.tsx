"use client";

import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "upload", label: "Upload a ledger" },
  { id: "score", label: "Trust score" },
  { id: "borrowers", label: "Entrepreneurs" },
  { id: "registry", label: "On-chain registry" },
];

const WEEK_DATA = [
  { day: "Mon", count: 11 },
  { day: "Tue", count: 16 },
  { day: "Wed", count: 14 },
  { day: "Thu", count: 21 },
  { day: "Fri", count: 18 },
  { day: "Sat", count: 9 },
  { day: "Sun", count: 5 },
];

type UploadStage = "idle" | "uploading" | "read" | "vouched";

export default function Home() {
  const [activeView, setActiveView] = useState("overview");

  // ---------- upload flow state ----------
  const [stage, setStage] = useState<UploadStage>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showVouchDialog, setShowVouchDialog] = useState(false);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleChooseFile() {
    if (stage !== "idle") return;
    setStage("uploading");
    setUploadProgress(0);

    progressTimer.current = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          if (progressTimer.current) clearInterval(progressTimer.current);
          return 100;
        }
        return p + 8;
      });
    }, 60);

    setTimeout(() => {
      setStage("read");
      setTimeout(() => setShowVouchDialog(true), 600);
    }, 1300);
  }

  function confirmVouch() {
    setShowVouchDialog(false);
    setStage("vouched");
  }

  function resetUpload() {
    setStage("idle");
    setUploadProgress(0);
    setShowVouchDialog(false);
  }

  // ---------- trust score animated donut ----------
  const targetScore = 78;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (activeView !== "score") {
      setDisplayScore(0);
      return;
    }
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(interval);
      } else {
        setDisplayScore(current);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [activeView]);

  const maxCount = Math.max(...WEEK_DATA.map((d) => d.count));

  return (
    <div className="shell">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="#241A08" strokeWidth="2">
              <path d="M4 19V6a2 2 0 0 1 2-2h9l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
              <path d="M8 10h8M8 14h5" />
            </svg>
          </div>
          <div>
            <div className="brand-name">TrustStream</div>
            <div className="brand-sub">Ledger to reputation</div>
          </div>
        </div>

        <div className="nav-group">
          <div className="nav-label">Your work</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => setActiveView(item.id)}
            >
              <NavIcon id={item.id} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="sidebar-foot">
          Signed in as <b>Home Ground branch</b>
          <br />
          Base Sepolia testnet
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="main">
        <div className="topbar">
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input type="text" placeholder="Find an entrepreneur, ledger, or wallet" />
          </div>
          <div className="who">
            <div>
              <div className="who-name" style={{ textAlign: "right" }}>Ananya Sharma</div>
              <div className="who-role">Community leader</div>
            </div>
            <div className="avatar">AS</div>
          </div>
        </div>

        <div className="content">
          {/* ============ OVERVIEW ============ */}
          <section className={`view ${activeView === "overview" ? "active" : ""}`}>
            <div className="view-head">
              <h1>Good morning, Ananya</h1>
              <p>Here&apos;s how the ledgers you&apos;ve vouched for are doing this month, and what they&apos;ve unlocked.</p>
            </div>

            <div className="stat-row">
              <div className="stat liftable">
                <div className="stat-label">Entrepreneurs onboarded</div>
                <div className="stat-value">128</div>
                <div className="stat-delta">+9 this month</div>
              </div>
              <div className="stat trust liftable">
                <div className="stat-label">Average trust score</div>
                <div className="stat-value">71 / 100</div>
                <div className="stat-delta">+4 points</div>
              </div>
              <div className="stat liftable">
                <div className="stat-label">Ledgers waiting on a vouch</div>
                <div className="stat-value">6</div>
              </div>
              <div className="stat trust liftable">
                <div className="stat-label">Micro-loans unlocked</div>
                <div className="stat-value">₹4,860</div>
                <div className="stat-delta">across 41 loans</div>
              </div>
            </div>

            <div className="grid-2">
              <div className="panel liftable">
                <div className="panel-title">
                  Trust scores handed out this week <span className="tag">hover a bar</span>
                </div>
                <div className="bars">
                  {WEEK_DATA.map((d) => (
                    <div className="bar-col" key={d.day}>
                      <div className="bar-tooltip">{d.count} scores</div>
                      <div className="bar" style={{ height: `${(d.count / maxCount) * 100}%` }} />
                      <span>{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel liftable">
                <div className="panel-title">Needs your vouch</div>
                <div className="list-row">
                  <div>
                    <div className="list-main">Fatima Sheikh</div>
                    <div className="list-sub">Tailoring · 14 entries</div>
                  </div>
                  <span className="pill pending">Pending</span>
                </div>
                <div className="list-row">
                  <div>
                    <div className="list-main">Rohan Gupta</div>
                    <div className="list-sub">Grain trading · 22 entries</div>
                  </div>
                  <span className="pill pending">Pending</span>
                </div>
                <div className="list-row">
                  <div>
                    <div className="list-main">Meena Kumari</div>
                    <div className="list-sub">Fish trading · 9 entries</div>
                  </div>
                  <span className="pill pending">Pending</span>
                </div>
              </div>
            </div>

            <div className="panel liftable">
              <div className="panel-title">Recently unlocked</div>
              <div className="list-row">
                <div>
                  <div className="list-main">Ritu Verma</div>
                  <div className="list-sub">Score 78 · Tier 2</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="list-main">₹2,000 unlocked</div>
                  <div className="list-sub">4% interest</div>
                </div>
              </div>
              <div className="list-row">
                <div>
                  <div className="list-main">Suresh Patil</div>
                  <div className="list-sub">Score 64 · Tier 1</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="list-main">₹1,200 unlocked</div>
                  <div className="list-sub">6% interest</div>
                </div>
              </div>
              <div className="list-row">
                <div>
                  <div className="list-main">Lakshmi Iyer</div>
                  <div className="list-sub">Score 82 · Tier 2</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="list-main">₹2,000 unlocked</div>
                  <div className="list-sub">4% interest</div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ UPLOAD ============ */}
          <section className={`view ${activeView === "upload" ? "active" : ""}`}>
            <div className="view-head">
              <h1>Upload a ledger</h1>
              <p>Photograph the paper ledger, let TrustStream read it, then send it to a community leader to vouch for.</p>
            </div>

            <div className="steps">
              <div className={`step ${stage === "idle" ? "on" : "done"}`}>
                <div className="step-num">
                  {stage === "idle" ? "1" : <TickIcon />}
                </div>
                <div>
                  <div className="step-title">Capture</div>
                  <div className="step-sub">Photo of the pages</div>
                </div>
              </div>
              <div className={`step ${stage === "uploading" ? "on" : stage === "read" || stage === "vouched" ? "done" : ""}`}>
                <div className="step-num">
                  {stage === "read" || stage === "vouched" ? <TickIcon /> : "2"}
                </div>
                <div>
                  <div className="step-title">Read</div>
                  <div className="step-sub">Entries pulled out</div>
                </div>
              </div>
              <div className={`step ${showVouchDialog ? "on" : stage === "vouched" ? "done" : ""}`}>
                <div className="step-num">
                  {stage === "vouched" ? <TickIcon /> : "3"}
                </div>
                <div>
                  <div className="step-title">Vouch</div>
                  <div className="step-sub">A leader confirms it</div>
                </div>
              </div>
            </div>

            <div className="upload-grid">
              <div>
                <div className="dropzone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 16V4M8 8l4-4 4 4" />
                    <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                  </svg>
                  <h3>Drop a photo here, or take one now</h3>
                  <p>Handwriting, smudges, and bad light are all fine — that&apos;s what it&apos;s built for.</p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button className="btn brass" onClick={handleChooseFile} disabled={stage !== "idle"}>
                      Use camera
                    </button>
                    <button className="btn ghost" onClick={handleChooseFile} disabled={stage !== "idle"}>
                      Choose a file
                    </button>
                    {stage !== "idle" && (
                      <button className="btn ghost" onClick={resetUpload}>Start over</button>
                    )}
                  </div>

                  {stage === "uploading" && (
                    <div className="upload-progress-wrap">
                      <div className="upload-progress-track">
                        <i style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <div className="upload-progress-label">Uploading ledger_page_1.jpg — {uploadProgress}%</div>
                    </div>
                  )}
                </div>

                {(stage === "read" || stage === "vouched") && (
                  <div className="panel" style={{ marginTop: "14px" }}>
                    <div className="panel-title">
                      Reading the ledger <span className="tag">3 of 3 pages read</span>
                    </div>
                    <div className="file-row">
                      <FileIcon />
                      <div className="file-meta">
                        ledger_page_1.jpg — 14 entries found
                        <div className="file-progress"><i style={{ width: "100%" }} /></div>
                      </div>
                    </div>
                    <div className="file-row">
                      <FileIcon />
                      <div className="file-meta">
                        ledger_page_2.jpg — 11 entries found
                        <div className="file-progress"><i style={{ width: "100%" }} /></div>
                      </div>
                    </div>
                    <div className="file-row">
                      <FileIcon />
                      <div className="file-meta">
                        ledger_page_3.jpg — 2 entries need a closer look
                        <div className="file-progress"><i style={{ width: "70%", background: "var(--brass)" }} /></div>
                      </div>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                      <div className="exception-row">
                        <span className="warn">Low confidence</span>
                        <span>Entry #9 — amount is smudged</span>
                        <span style={{ color: "var(--brass-deep)", fontWeight: 600 }}>Review</span>
                      </div>
                      <div className="exception-row">
                        <span className="warn">Low confidence</span>
                        <span>Entry #23 — date unclear</span>
                        <span style={{ color: "var(--brass-deep)", fontWeight: 600 }}>Review</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="panel">
                  <div className="panel-title">Read settings</div>
                  <div className="check-row">
                    <input type="checkbox" defaultChecked />
                    <div>
                      <div>
                        Flag entries the model isn&apos;t sure about
                        <span>Anything under 85% confidence gets marked for a human to check.</span>
                      </div>
                    </div>
                  </div>
                  <div className="check-row">
                    <input type="checkbox" defaultChecked />
                    <div>
                      <div>
                        Match repayments to their original loan
                        <span>Groups entries into full loan-and-repayment cycles.</span>
                      </div>
                    </div>
                  </div>
                  <div className="check-row">
                    <input type="checkbox" />
                    <div>
                      <div>
                        Translate handwritten notes
                        <span>Useful when entries are in a regional language.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="panel" style={{ marginTop: "14px" }}>
                  <div className="panel-title">Vouch</div>
                  <div className="voucher-card">
                    <div className="name-dot">AS</div>
                    <div>
                      <b>Ananya Sharma</b>
                      <span>Home Ground branch · community leader</span>
                    </div>
                  </div>

                  {stage === "vouched" ? (
                    <div className="vouched-note">
                      <TickIcon />
                      Vouched just now — score is being calculated and written to the registry.
                    </div>
                  ) : (
                    <button
                      className="btn brass"
                      style={{ width: "100%", justifyContent: "center" }}
                      disabled={stage !== "read"}
                      onClick={() => setShowVouchDialog(true)}
                    >
                      {stage === "read" ? "Confirm vouch" : "Waiting on the reading step"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ============ SCORE ============ */}
          <section className={`view ${activeView === "score" ? "active" : ""}`}>
            <div className="view-head">
              <h1>Ritu Verma&apos;s trust score</h1>
              <p>Built from 19 months of vouched ledger entries. Every change here is written to the registry.</p>
            </div>

            <div className="score-layout">
              <div className="stamp-wrap liftable">
                <div
                  className="stamp"
                  style={{
                    background: `conic-gradient(var(--trust) ${displayScore * 3.6}deg, var(--line) ${displayScore * 3.6}deg)`,
                  }}
                >
                  <div className="stamp-hole">
                    <div className="num">{displayScore}</div>
                    <div className="out-of">out of 100</div>
                  </div>
                </div>
                <div className="stamp-name">Ritu Verma</div>
                <div className="stamp-sub">Tailoring · vouched by Ananya Sharma</div>
                <div className="unlock-box">
                  <b>₹2,000 at 4%</b>
                  This score clears the Tier 2 threshold — the loan offer is ready to send.
                </div>
                <div className="score-desc">
                  <b>What 78 means:</b> scores below 40 stay in Tier 0 with no loan offer yet. 40–65 unlocks Tier 1, small
                  short-term loans. 65 and above unlocks Tier 2, like Ritu&apos;s — larger amounts at a lower rate, based on
                  consistently on-time repayments.
                </div>
              </div>

              <div className="panel liftable">
                <div className="panel-title">What went into this score</div>
                <div className="metric">
                  <div className="metric-top"><b>On-time repayments</b><span>92%</span></div>
                  <div className="track"><i style={{ width: "92%" }} /></div>
                </div>
                <div className="metric">
                  <div className="metric-top"><b>Ledger kept for</b><span>19 months</span></div>
                  <div className="track"><i style={{ width: "75%" }} /></div>
                </div>
                <div className="metric">
                  <div className="metric-top"><b>How often she trades</b><span>3–4 times / week</span></div>
                  <div className="track"><i style={{ width: "68%" }} /></div>
                </div>
                <div className="metric">
                  <div className="metric-top"><b>Entries needing a second look</b><span>2 of 47</span></div>
                  <div className="track"><i style={{ width: "15%", background: "var(--rust)" }} /></div>
                </div>

                <div className="voucher-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div>
                    Vouched by <b>Ananya Sharma</b> on 12 Aug 2026. If this ledger turns out to be false, both the score and
                    the vouch are revoked, and the account is banned from the registry.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ BORROWERS ============ */}
          <section className={`view ${activeView === "borrowers" ? "active" : ""}`}>
            <div className="view-head">
              <h1>Entrepreneurs</h1>
              <p>Everyone whose ledger has come through your branch, vouched or not.</p>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Trade</th><th>Score</th><th>Status</th><th>Last ledger update</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><div className="name-cell"><div className="name-dot">RV</div>Ritu Verma</div></td>
                    <td>Tailoring</td>
                    <td className="score-chip">78</td>
                    <td><span className="pill vouched">Vouched</span></td>
                    <td>2 days ago</td>
                  </tr>
                  <tr>
                    <td><div className="name-cell"><div className="name-dot">SP</div>Suresh Patil</div></td>
                    <td>Bicycle repair</td>
                    <td className="score-chip">64</td>
                    <td><span className="pill vouched">Vouched</span></td>
                    <td>5 days ago</td>
                  </tr>
                  <tr>
                    <td><div className="name-cell"><div className="name-dot">FS</div>Fatima Sheikh</div></td>
                    <td>Tailoring</td>
                    <td className="score-chip">—</td>
                    <td><span className="pill pending">Pending vouch</span></td>
                    <td>Today</td>
                  </tr>
                  <tr>
                    <td><div className="name-cell"><div className="name-dot">LI</div>Lakshmi Iyer</div></td>
                    <td>Poultry</td>
                    <td className="score-chip">82</td>
                    <td><span className="pill vouched">Vouched</span></td>
                    <td>1 week ago</td>
                  </tr>
                  <tr>
                    <td><div className="name-cell"><div className="name-dot">RG</div>Rohan Gupta</div></td>
                    <td>Grain trading</td>
                    <td className="score-chip">—</td>
                    <td><span className="pill pending">Pending vouch</span></td>
                    <td>Yesterday</td>
                  </tr>
                  <tr>
                    <td><div className="name-cell"><div className="name-dot">VS</div>Vikram Singh</div></td>
                    <td>Phone repair</td>
                    <td className="score-chip">22</td>
                    <td><span className="pill banned">Banned — false ledger</span></td>
                    <td>6 weeks ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ============ REGISTRY ============ */}
          <section className={`view ${activeView === "registry" ? "active" : ""}`}>
            <div className="view-head">
              <h1>On-chain registry</h1>
              <p>Every score, vouch, and ban is written here — anyone can check it without asking your branch.</p>
            </div>

            <div className="reg-grid">
              <div className="reg-card liftable">
                <div className="top"><h4>Entrepreneurs on network</h4></div>
                <div className="big">128</div>
              </div>
              <div className="reg-card liftable">
                <div className="top"><h4>Reputation events</h4></div>
                <div className="big">122</div>
              </div>
              <div className="reg-card liftable">
                <div className="top"><h4>RPC endpoints</h4></div>
                <div className="big">2</div>
              </div>
              <div className="reg-card liftable">
                <div className="top"><h4>Pending vouches</h4></div>
                <div className="big">6</div>
              </div>
            </div>

            <div className="net-grid">
              <div className="net-card liftable">
                <div className="top">
                  <h4>Base Sepolia</h4>
                  <div className="dot-status"><i></i>Syncing</div>
                </div>
                <div className="net-metrics">
                  <div className="net-metric"><span>Latest block</span><b>18,224,109</b></div>
                  <div className="net-metric"><span>Processed</span><b>18,224,109</b></div>
                  <div className="net-metric"><span>Latency</span><b>142ms</b></div>
                  <div className="net-metric"><span>Errors</span><b>0</b></div>
                </div>
              </div>
              <div className="net-card liftable">
                <div className="top">
                  <h4>Ethereum Sepolia</h4>
                  <div className="dot-status"><i></i>Syncing</div>
                </div>
                <div className="net-metrics">
                  <div className="net-metric"><span>Latest block</span><b>6,481,220</b></div>
                  <div className="net-metric"><span>Processed</span><b>6,480,958</b></div>
                  <div className="net-metric"><span>Latency</span><b>168ms</b></div>
                  <div className="net-metric"><span>Errors</span><b>0</b></div>
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="panel liftable">
                <div className="panel-title">Registry configuration</div>
                <div className="reg-config-row">
                  <div>
                    <div className="main">TrustStream Registry (Base)</div>
                    <div className="sub">Chain 84532 · score + vouch data</div>
                  </div>
                  <span className="tag">Default</span>
                </div>
                <div className="reg-config-row">
                  <div>
                    <div className="main">Vouch Attestations (Base)</div>
                    <div className="sub">Chain 84532 · community leader sign-offs</div>
                  </div>
                  <span className="tag">Default</span>
                </div>
                <div className="reg-config-row">
                  <div>
                    <div className="main">Ban List (Base)</div>
                    <div className="sub">Chain 84532 · fraud registry</div>
                  </div>
                  <span className="tag">Default</span>
                </div>
              </div>

              <div className="panel liftable">
                <div className="panel-title">System status</div>
                <div className="service-row"><span>Database</span><span className="service-status">Connected</span></div>
                <div className="service-row"><span>Base RPC</span><span className="service-status">Configured</span></div>
                <div className="service-row"><span>AI extraction API</span><span className="service-status">Configured</span></div>
                <div className="service-row"><span>Indexer</span><span className="service-status">Active</span></div>
              </div>
            </div>

            <div className="panel liftable" style={{ marginBottom: "16px" }}>
              <div className="panel-title">Quick actions</div>
              <div className="qa-grid">
                <div className="qa-card liftable">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M18 8v6M15 11h6"/></svg>
                  <div>
                    <b>Register entrepreneur</b>
                    <span>Add a new person and mint their first trust badge.</span>
                  </div>
                </div>
                <div className="qa-card liftable">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-14 9V3Z"/></svg>
                  <div>
                    <b>Run indexer</b>
                    <span>Poll the registry contracts for new events.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel liftable" style={{ marginBottom: "16px" }}>
              <div className="panel-title">Recent entries</div>
              <div className="event-row"><span className="event-tag mint">Mint</span><span>Trust badge minted for Ritu Verma — score 78</span><span className="tx">0x4a2…e91</span></div>
              <div className="event-row"><span className="event-tag update">Update</span><span>Score updated for Suresh Patil, 58 → 64</span><span className="tx">0x8b1…2fd</span></div>
              <div className="event-row"><span className="event-tag mint">Mint</span><span>Trust badge minted for Lakshmi Iyer — score 82</span><span className="tx">0x0e7…caa</span></div>
              <div className="event-row"><span className="event-tag ban">Ban</span><span>Vikram Singh banned — ledger did not match vouch</span><span className="tx">0x93d…105</span></div>
            </div>

            <div className="panel liftable">
              <div className="panel-title">Check a wallet against the ban list</div>
              <div className="check-tool">
                <input type="text" placeholder="0x… wallet address" />
                <button className="btn brass">Check</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ---------- tick confirmation dialog ---------- */}
      {showVouchDialog && (
        <div className="dialog-overlay" onClick={() => setShowVouchDialog(false)}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-tick"><TickIcon /></div>
            <h3>Vouch for this ledger?</h3>
            <p>Ananya Sharma is confirming Ritu Verma&apos;s ledger is genuine. This can&apos;t be undone once written to the registry.</p>
            <div className="dialog-actions">
              <button className="btn ghost" onClick={() => setShowVouchDialog(false)}>Cancel</button>
              <button className="btn brass" onClick={confirmVouch}>Confirm vouch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function NavIcon({ id }: { id: string }) {
  switch (id) {
    case "overview":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12l2-2 4 4 8-8 4 4" />
          <path d="M3 20h18" />
        </svg>
      );
    case "upload":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 16V4M8 8l4-4 4 4" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
      );
    case "score":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "borrowers":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="8" r="3" />
          <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
          <circle cx="18" cy="9" r="2.3" />
          <path d="M15.5 14.2c2.6.2 4.5 2.2 4.5 5.8" />
        </svg>
      );
    case "registry":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="6" rx="1" />
          <rect x="3" y="14" width="18" height="6" rx="1" />
          <path d="M7 7h.01M7 17h.01" />
        </svg>
      );
    default:
      return null;
  }
}