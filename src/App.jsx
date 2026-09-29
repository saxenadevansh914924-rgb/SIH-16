import React, { useMemo, useState, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  Database,
  Download,
  FileText,
  Filter,
  Globe2,
  Layers,
  LayoutDashboard,
  Leaf,
  Map,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
  Sun,
  Moon,
  Clock3,
  MapPin,
  CircleHelp,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import {
  researchService,
  datasetService,
  projectService,
  analyticsService,
  gisService,
  innovationService,
  notificationService,
} from "./data/services";
const research = researchService.list();
const datasets = datasetService.list();
const projects = projectService.list();
const { activity, states, distribution } = analyticsService.getOverview();
const regions = gisService.listRegions();
const challenges = innovationService.list();
const seedNotifications = notificationService.list();

const nav = [
  ["Overview", LayoutDashboard, "/app"],
  ["Research Repository", BookOpen, "/research"],
  ["Datasets", Database, "/datasets"],
  ["AI Research Assistant", BrainCircuit, "/assistant"],
  ["GIS Intelligence", Map, "/gis"],
  ["Policy Analytics", TrendingUp, "/analytics"],
  ["Policy Simulation", SlidersHorizontal, "/simulation"],
  ["Research Workspace", Users, "/workspace"],
  ["Innovation Hub", Sparkles, "/innovation"],
  ["Notifications", Bell, "/notifications"],
];
const titleMap = {
  "/app": "National Overview",
  "/research": "Research Repository",
  "/datasets": "Datasets",
  "/assistant": "AI Research Assistant",
  "/gis": "GIS Intelligence",
  "/analytics": "Policy Analytics",
  "/simulation": "Policy Simulation",
  "/workspace": "Research Workspace",
  "/innovation": "Innovation Hub",
  "/notifications": "Notifications",
  "/profile": "Researcher Profile",
};
const colors = ["#40d6c2", "#8b7cf6", "#f3b957", "#59a9f8", "#ed7d9c"];
function App() {
  const [theme, setTheme] = useState(
      localStorage.getItem("bhoomi-theme") || "dark",
    ),
    [collapsed, setCollapsed] = useState(false),
    [drawer, setDrawer] = useState(false),
    [palette, setPalette] = useState(false),
    [globalSearch, setGlobalSearch] = useState(""),
    [notifications, setNotifications] = useState(seedNotifications),
    [bookmarks, setBookmarks] = useState([]);
  const location = useLocation(),
    navigate = useNavigate(),
    unread = notifications.filter((n) => n.unread).length;
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("bhoomi-theme", theme);
  }, [theme]);
  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((x) => !x);
      }
      if (e.key === "Escape") {
        setPalette(false);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  const toggleBookmark = (id) =>
    setBookmarks((v) =>
      v.includes(id) ? v.filter((x) => x !== id) : [...v, id],
    );
  const page = location.pathname.startsWith("/research/")
    ? "Research details"
    : titleMap[location.pathname] || "National Overview";
  const matches = useMemo(() => {
    const q = globalSearch.toLowerCase();
    return q
      ? [
          ...research.map((x) => ({
            label: x.title,
            to: `/research/${x.id}`,
            kind: "Research",
          })),
          ...datasets.map((x) => ({
            label: x.name,
            to: "/datasets",
            kind: "Dataset",
          })),
          ...projects.map((x) => ({
            label: x.name,
            to: "/workspace",
            kind: "Project",
          })),
          { label: "GIS Intelligence", to: "/gis", kind: "Page" },
        ]
          .filter((x) => x.label.toLowerCase().includes(q))
          .slice(0, 7)
      : [];
  }, [globalSearch]);
  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${drawer ? "drawer-open" : ""}`}
      >
        <div className="brand">
          <div className="brand-mark">
            <Globe2 size={20} />
          </div>
          {!collapsed && (
            <div>
              <strong>
                Bhoomi<span>Intel</span>
              </strong>
              <small>LAND GOVERNANCE PLATFORM</small>
            </div>
          )}
          <button
            className="icon-button mobile-close"
            onClick={() => setDrawer(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">{!collapsed && "WORKSPACE"}</div>
        <nav>
          {nav.map(([label, Icon, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/app"}
              onClick={() => setDrawer(false)}
              className={({ isActive }) =>
                "nav-item " + (isActive ? "active" : "")
              }
              title={collapsed ? label : ""}
            >
              <Icon size={17} />
              {!collapsed && <span>{label}</span>}
              {label === "Notifications" && unread > 0 && !collapsed && (
                <i className="nav-count">{unread}</i>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="prototype-chip">
            <span className="live-dot" />
            {!collapsed && (
              <>
                Prototype environment <span className="demo-tag">DEMO</span>
              </>
            )}
          </div>
          <button className="profile-mini" onClick={() => navigate("/profile")}>
            <div className="avatar">AS</div>
            {!collapsed && (
              <>
                <div className="profile-mini-info">
                  <b>Arjun Sharma</b>
                  <small>Researcher</small>
                </div>
                <MoreHorizontal size={17} />
              </>
            )}
          </button>
        </div>
        <button
          className="collapse-button"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <>
              <PanelLeftClose size={15} /> Collapse sidebar
            </>
          )}
        </button>
      </aside>
      {drawer && <div className="scrim" onClick={() => setDrawer(false)} />}
      <main className="main-shell">
        <header className="topbar">
          <div className="top-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setDrawer(true)}
            >
              <Menu size={19} />
            </button>
            <div className="breadcrumbs">
              <span>Platform</span>
              <ChevronRight size={13} />
              <b>{page}</b>
            </div>
          </div>
          <div className="top-actions">
            <button className="global-search" onClick={() => setPalette(true)}>
              <Search size={16} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="icon-button theme-switch"
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              className="icon-button top-bell"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={17} />
              {unread > 0 && <i />}
            </button>
            <button className="top-avatar" onClick={() => navigate("/profile")}>
              AS
            </button>
          </div>
        </header>
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/app"
              element={<Dashboard navigate={navigate} bookmarks={bookmarks} />}
            />
            <Route
              path="/research"
              element={
                <ResearchPage
                  navigate={navigate}
                  bookmarks={bookmarks}
                  toggleBookmark={toggleBookmark}
                />
              }
            />
            <Route
              path="/research/:id"
              element={
                <ResearchDetail
                  navigate={navigate}
                  bookmarks={bookmarks}
                  toggleBookmark={toggleBookmark}
                />
              }
            />
            <Route path="/datasets" element={<DatasetsPage />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/gis" element={<GISPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route
              path="/workspace"
              element={<Workspace bookmarks={bookmarks} navigate={navigate} />}
            />
            <Route path="/innovation" element={<Innovation />} />
            <Route
              path="/notifications"
              element={
                <NotificationsPage
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              }
            />
            <Route
              path="/profile"
              element={<Profile theme={theme} setTheme={setTheme} />}
            />
            <Route
              path="*"
              element={<Dashboard navigate={navigate} bookmarks={bookmarks} />}
            />
          </Routes>
        </div>
        <footer className="footer">
          <span>© 2025 Bhoomi Intelligence</span>
          <span>
            <span className="prototype-label">
              <i /> PROTOTYPE DATA
            </span>
            <span className="footer-divider" />
            For demonstration only
          </span>
        </footer>
      </main>
      {palette && (
        <div className="modal-overlay" onClick={() => setPalette(false)}>
          <div className="command-modal" onClick={(e) => e.stopPropagation()}>
            <div className="command-input">
              <Search size={19} />
              <input
                autoFocus
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search research, datasets, projects..."
              />
              <kbd>ESC</kbd>
            </div>
            <div className="command-results">
              {matches.length ? (
                matches.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(m.to);
                      setPalette(false);
                      setGlobalSearch("");
                    }}
                  >
                    <span className="result-icon">
                      <FileText size={16} />
                    </span>
                    <span>
                      {m.label}
                      <small>{m.kind}</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                ))
              ) : (
                <div className="command-hint">
                  {globalSearch
                    ? "No matches found"
                    : "Type to search across the platform"}
                  <div className="command-shortcuts">
                    <span>
                      <kbd>↑</kbd>
                      <kbd>↓</kbd> Navigate
                    </span>
                    <span>
                      <kbd>↵</kbd> Open
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <div className="landing-nav">
        <div className="brand-mark">
          <Globe2 size={20} />
        </div>
        <div className="landing-brand">
          <b>
            Bhoomi<span>Intel</span>
          </b>
          <small>LAND GOVERNANCE INTELLIGENCE</small>
        </div>
        <button
          className="button secondary small"
          onClick={() => navigate("/app")}
        >
          Enter platform <ArrowRight size={15} />
        </button>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> NATIONAL RESEARCH & POLICY
            INTELLIGENCE
          </div>
          <h1>
            Evidence for a more
            <br />
            <em>informed</em> relationship
            <br />
            with land.
          </h1>
          <p>
            Connecting research, policy, geospatial intelligence and evidence
            for better land governance.
          </p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => navigate("/app")}>
              Explore platform <ArrowRight size={16} />
            </button>
            <button
              className="button secondary"
              onClick={() => navigate("/assistant")}
            >
              <BrainCircuit size={16} /> AI Research Assistant
            </button>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars">
              <span>R</span>
              <span>P</span>
              <span>G</span>
              <span>+</span>
            </div>
            <div>
              <b>One connected evidence ecosystem</b>
              <small>Research · Policy · Place</small>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="india-graphic">
            <div className="map-grid" />
            <div className="india-shape">⌖</div>
            <span className="map-point p1" />
            <span className="map-point p2" />
            <span className="map-point p3" />
            <div className="map-callout">
              <span className="live-dot" /> LIVE EVIDENCE NETWORK{" "}
              <b>42 layers connected</b>
            </div>
            <div className="visual-coord">
              20° 35′ N&nbsp;&nbsp; 78° 57′ E<br />
              INDIA · DEMO VIEW
            </div>
          </div>
          <div className="floating-stat stat-one">
            <b>1,248</b>
            <small>Research papers</small>
            <span>
              <ArrowUpRight size={12} /> +12.4%
            </span>
          </div>
          <div className="floating-stat stat-two">
            <div className="mini-bars">
              {[34, 51, 43, 67, 55, 78, 68, 92].map((h, i) => (
                <i style={{ height: h + "%" }} key={i} />
              ))}
            </div>
            <small>Evidence activity</small>
            <b>Growing steadily</b>
          </div>
        </div>
      </section>
      <section className="landing-metrics">
        <div>
          <b>1,248</b>
          <span>Research records</span>
        </div>
        <div>
          <b>386</b>
          <span>Curated datasets</span>
        </div>
        <div>
          <b>74</b>
          <span>Active projects</span>
        </div>
        <div>
          <b>42</b>
          <span>GIS layers</span>
        </div>
        <small>Illustrative prototype data</small>
      </section>
      <section className="landing-features">
        <div className="section-kicker">A CONNECTED TOOLKIT</div>
        <div className="landing-section-head">
          <h2>
            From fragmented evidence
            <br />
            to <em>shared intelligence.</em>
          </h2>
          <p>
            A common workspace for the people researching, shaping and
            stewarding land policy.
          </p>
        </div>
        <div className="feature-grid">
          {[
            [
              BookOpen,
              "Research intelligence",
              "Discover studies, policy reports and field evidence in one searchable repository.",
              "/research",
              "teal",
            ],
            [
              Map,
              "Geospatial intelligence",
              "Bring research into its place context with layered, interactive map views.",
              "/gis",
              "blue",
            ],
            [
              TrendingUp,
              "Policy analytics",
              "Explore research activity, land-use trends and policy indicators.",
              "/analytics",
              "violet",
            ],
            [
              BrainCircuit,
              "AI research assistant",
              "Ask natural-language questions grounded in the demo evidence collection.",
              "/assistant",
              "cyan",
            ],
            [
              SlidersHorizontal,
              "Policy simulation",
              "Explore illustrative scenario shifts through adjustable local parameters.",
              "/simulation",
              "amber",
            ],
            [
              Sparkles,
              "Innovation hub",
              "Turn new ideas into collaborative challenges, pilots and research.",
              "/innovation",
              "pink",
            ],
          ].map(([I, t, d, l, c]) => (
            <button
              className="feature-card"
              onClick={() => location.assign(l)}
              key={t}
            >
              <span className={"feature-icon " + c}>
                <I size={19} />
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="feature-link">
                Explore <ArrowRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>
      <div className="landing-bottom">
        <div>
          <div className="brand-mark">
            <Globe2 size={18} />
          </div>
          <span>Bhoomi Intelligence · Prototype experience</span>
        </div>
        <span>Built for evidence-led land governance</span>
      </div>
    </div>
  );
}

function PageHead({ eyebrow, title, desc, action, children }) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
        {children}
      </div>
      {action && <div className="page-head-action">{action}</div>}
    </div>
  );
}
function DemoFlag() {
  return (
    <span className="prototype-label">
      <i /> PROTOTYPE DATA
    </span>
  );
}
function Dashboard({ navigate }) {
  const data = activity;
  return (
    <>
      <PageHead
        eyebrow="MONDAY, SEPTEMBER 29, 2025"
        title="National overview"
        desc="A connected view of land governance research, data and policy activity across India."
        action={
          <button className="button secondary small">
            <Download size={15} /> Export overview
          </button>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>Last synced just now</span>
        </div>
      </PageHead>
      <div className="kpi-grid">
        {[
          [
            BookOpen,
            "Total research",
            "1,248",
            "+12.4%",
            "vs last quarter",
            "teal",
          ],
          [
            Database,
            "Total datasets",
            "386",
            "+8.2%",
            "vs last quarter",
            "blue",
          ],
          [
            Users,
            "Active projects",
            "74",
            "+6.1%",
            "vs last quarter",
            "violet",
          ],
          [
            FileText,
            "Policy studies",
            "219",
            "+4.8%",
            "vs last quarter",
            "amber",
          ],
          [Layers, "GIS layers", "42", "+3 new", "this month", "cyan"],
          [
            Sparkles,
            "Innovation challenges",
            "18",
            "+5 new",
            "this quarter",
            "pink",
          ],
        ].map(([I, l, v, g, s, c]) => (
          <div className="kpi-card" key={l}>
            <div className="kpi-top">
              <span className={"kpi-icon " + c}>
                <I size={16} />
              </span>
              <MoreHorizontal size={16} className="muted" />
            </div>
            <div className="kpi-value">{v}</div>
            <div className="kpi-label">{l}</div>
            <div className="kpi-change">
              <span>
                <ArrowUpRight size={13} />
                {g}
              </span>
              {s}
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel chart-panel wide">
          <div className="panel-head">
            <div>
              <h2>Research activity over time</h2>
              <p>Publications and policy studies · 2025</p>
            </div>
            <button className="select-like">
              Last 8 months <ChevronDown size={14} />
            </button>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 8, right: 8, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="papersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#40d6c2" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#40d6c2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 5"
                  stroke="var(--line)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 9,
                    color: "var(--text)",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "var(--muted)" }}
                />
                <Area
                  name="Research papers"
                  type="monotone"
                  dataKey="papers"
                  stroke="#40d6c2"
                  strokeWidth={2.3}
                  fill="url(#papersFill)"
                />
                <Line
                  name="Policy studies"
                  type="monotone"
                  dataKey="policy"
                  stroke="#8b7cf6"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel state-panel">
          <div className="panel-head">
            <div>
              <h2>State-wise activity</h2>
              <p>Research records by state</p>
            </div>
            <button
              className="more-button"
              onClick={() => navigate("/analytics")}
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="state-list">
            {states.slice(0, 5).map((s, i) => (
              <div className="state-row" key={s.name}>
                <span className="state-rank">0{i + 1}</span>
                <span className="state-name">{s.name}</span>
                <span className="state-bar">
                  <i
                    style={{
                      width: `${s.value / 1.9}%`,
                      background: colors[i],
                    }}
                  />
                </span>
                <b>{s.value}</b>
              </div>
            ))}
          </div>
          <div className="panel-foot">
            <span className="live-dot" /> Activity shown is illustrative
          </div>
        </section>
        <section className="panel distribution-panel">
          <div className="panel-head">
            <div>
              <h2>Dataset distribution</h2>
              <p>Across evidence themes</p>
            </div>
            <button
              className="more-button"
              onClick={() => navigate("/datasets")}
            >
              Browse <ArrowRight size={13} />
            </button>
          </div>
          <div className="donut-content">
            <div className="donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    innerRadius={48}
                    outerRadius={66}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {distribution.map((e, i) => (
                      <Cell key={i} fill={colors[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <b>386</b>
                <small>datasets</small>
              </div>
            </div>
            <div className="legend-list">
              {distribution.map((x, i) => (
                <div key={x.name}>
                  <i style={{ background: colors[i] }} />
                  {x.name}
                  <b>{x.value}%</b>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="panel policy-panel">
          <div className="panel-head">
            <div>
              <h2>Policy pulse</h2>
              <p>Emerging evidence themes</p>
            </div>
            <span className="pulse-tag">
              <i /> LIVE SIGNALS
            </span>
          </div>
          <div className="signal">
            <div>
              <span className="signal-icon teal">
                <Leaf size={16} />
              </span>
              <div>
                <b>Climate resilient land use</b>
                <small>Research momentum</small>
              </div>
            </div>
            <strong>
              +24% <ArrowUpRight size={14} />
            </strong>
          </div>
          <div className="signal">
            <div>
              <span className="signal-icon violet">
                <Database size={16} />
              </span>
              <div>
                <b>Digital land records</b>
                <small>Policy attention</small>
              </div>
            </div>
            <strong>
              +18% <ArrowUpRight size={14} />
            </strong>
          </div>
          <div className="signal">
            <div>
              <span className="signal-icon amber">
                <Users size={16} />
              </span>
              <div>
                <b>Community tenure</b>
                <small>Evidence gap</small>
              </div>
            </div>
            <strong className="attention">Explore</strong>
          </div>
        </section>
        <section className="panel recent-panel">
          <div className="panel-head">
            <div>
              <h2>Recent research</h2>
              <p>Latest additions to the repository</p>
            </div>
            <button
              className="more-button"
              onClick={() => navigate("/research")}
            >
              View repository <ArrowRight size={13} />
            </button>
          </div>
          <ResearchRows
            items={research.slice(0, 3)}
            onOpen={(id) => navigate("/research/" + id)}
          />
        </section>
        <section className="panel projects-panel">
          <div className="panel-head">
            <div>
              <h2>Active projects</h2>
              <p>Research teams at work</p>
            </div>
            <button
              className="more-button"
              onClick={() => navigate("/workspace")}
            >
              Workspace <ArrowRight size={13} />
            </button>
          </div>
          <div className="project-list">
            {projects.slice(0, 2).map((p) => (
              <div className="project-row" key={p.id}>
                <div className={"project-dot " + p.tone} />
                <div className="project-info">
                  <b>{p.name}</b>
                  <small>
                    {p.members} members · {p.status}
                  </small>
                  <div className="progress-track">
                    <i style={{ width: p.progress + "%" }} />
                  </div>
                </div>
                <span className="progress-percent">{p.progress}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="quick-actions">
        <div>
          <span className="quick-symbol">
            <Zap size={16} />
          </span>
          <div>
            <b>Move from evidence to action</b>
            <small>Pick up where your work takes you.</small>
          </div>
        </div>
        {[
          ["Explore research", BookOpen, "/research"],
          ["Open GIS explorer", Map, "/gis"],
          ["Ask the AI assistant", BrainCircuit, "/assistant"],
          ["Run a simulation", SlidersHorizontal, "/simulation"],
        ].map(([t, I, l]) => (
          <button key={t} onClick={() => navigate(l)}>
            <I size={15} />
            {t}
            <ArrowRight size={13} />
          </button>
        ))}
      </section>
    </>
  );
}

function ResearchRows({ items, onOpen }) {
  return (
    <div className="research-rows">
      {items.map((r) => (
        <button
          className="research-row"
          onClick={() => onOpen(r.id)}
          key={r.id}
        >
          <span className="doc-icon">
            <FileText size={17} />
          </span>
          <span className="research-row-main">
            <b>{r.title}</b>
            <small>
              {r.author} <i /> {r.org}
            </small>
          </span>
          <span className="research-row-tag">{r.topic}</span>
          <span className="research-row-year">{r.year}</span>
          <ArrowRight size={15} className="muted" />
        </button>
      ))}
    </div>
  );
}

function ResearchPage({ navigate, bookmarks, toggleBookmark }) {
  const [query, setQuery] = useState(""),
    [state, setState] = useState("All states"),
    [type, setType] = useState("All types"),
    [sort, setSort] = useState("Newest first"),
    [mode, setMode] = useState("Keyword");
  const filtered = research
    .filter(
      (r) =>
        `${r.title} ${r.abstract} ${r.topic} ${r.author} ${r.org}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (state === "All states" || r.state === state) &&
        (type === "All types" || r.type === type),
    )
    .sort((a, b) =>
      sort === "Newest first"
        ? b.year - a.year
        : a.title.localeCompare(b.title),
    );
  return (
    <>
      <PageHead
        eyebrow="EVIDENCE LIBRARY"
        title="Research repository"
        desc="Discover research, policy reports and case studies across India's land governance landscape."
        action={
          <button className="button primary small">
            <Plus size={15} /> Add research
          </button>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>{research.length} records indexed</span>
        </div>
      </PageHead>
      <div className="repo-toolbar">
        <div className="repo-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research, topics, authors..."
          />
          <kbd>/</kbd>
        </div>
        <div className="filter-group">
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option>All states</option>
            {[...new Set(research.map((r) => r.state))].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>All types</option>
            {[...new Set(research.map((r) => r.type))].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Newest first</option>
            <option>Title A–Z</option>
          </select>
          <button className="button secondary small">
            <Filter size={15} /> Filters
          </button>
        </div>
      </div>
      <div className="search-mode">
        <span>Search mode</span>
        {["Keyword", "AI Semantic"].map((item) => (
          <button
            key={item}
            className={mode === item ? "active" : ""}
            onClick={() => setMode(item)}
          >
            {item === "AI Semantic" && <Sparkles size={12} />} {item}
          </button>
        ))}
        {mode === "AI Semantic" && (
          <span className="semantic-active">
            <Sparkles size={13} /> AI-powered semantic search · locally matched
            demo evidence
          </span>
        )}
      </div>
      <div className="repository-layout">
        <section className="repository-results">
          <div className="results-heading">
            <b>{filtered.length} results</b>
            <span>
              Curated collection <i /> Updated today
            </span>
          </div>
          {filtered.length ? (
            filtered.map((r) => (
              <article className="research-card" key={r.id}>
                <div className="research-card-top">
                  <span className="doc-icon large">
                    <FileText size={18} />
                  </span>
                  <span className="content-type">{r.type}</span>
                  <span className="research-card-actions">
                    <button
                      className={
                        "icon-button bookmark-button " +
                        (bookmarks.includes(r.id) ? "saved" : "")
                      }
                      title="Bookmark"
                      onClick={() => toggleBookmark(r.id)}
                    >
                      <Bookmark
                        size={16}
                        fill={
                          bookmarks.includes(r.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                    <button className="icon-button">
                      <MoreHorizontal size={17} />
                    </button>
                  </span>
                </div>
                <button
                  className="research-title-button"
                  onClick={() => navigate("/research/" + r.id)}
                >
                  <h2>{r.title}</h2>
                </button>
                <p className="research-abstract">{r.abstract}</p>
                <div className="research-meta">
                  <span>
                    <Users size={13} />
                    {r.author}
                  </span>
                  <span>
                    <Globe2 size={13} />
                    {r.org}
                  </span>
                </div>
                <div className="research-card-bottom">
                  <div className="tag-row">
                    <span>{r.topic}</span>
                    <span>
                      <MapPin size={12} />
                      {r.state}
                    </span>
                    <span>{r.year}</span>
                  </div>
                  <button
                    className="text-link"
                    onClick={() => navigate("/research/" + r.id)}
                  >
                    View research <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <Search size={26} />
              <h3>No research found</h3>
              <p>Try another keyword or adjust the filters.</p>
            </div>
          )}
          <div className="pagination">
            <span>
              Showing <b>{filtered.length}</b> of 1,248 records
            </span>
            <div>
              <button disabled>
                <ChevronLeft size={15} />
              </button>
              <button className="current">1</button>
              <button>2</button>
              <button>3</button>
              <span>…</span>
              <button>42</button>
              <button>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
        <aside className="repository-aside">
          <div className="panel aside-panel">
            <div className="aside-heading">
              <span className="aside-icon teal">
                <TrendingUp size={16} />
              </span>
              <div>
                <b>Trending topics</b>
                <small>Across the collection</small>
              </div>
            </div>
            {[
              ["Land acquisition", "128 studies"],
              ["Digital land records", "96 studies"],
              ["Climate resilience", "84 studies"],
              ["Urban expansion", "67 studies"],
              ["Community tenure", "52 studies"],
            ].map(([a, b], i) => (
              <button
                className="topic-trend"
                onClick={() => setQuery(a)}
                key={a}
              >
                <span className="trend-num">0{i + 1}</span>
                <span>
                  {a}
                  <small>{b}</small>
                </span>
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
          <div className="panel semantic-promo">
            <div className="semantic-icon">
              <Sparkles size={18} />
            </div>
            <h3>Search by meaning</h3>
            <p>
              Find relevant evidence even when your keywords don't match the
              document.
            </p>
            <button
              className="button secondary small"
              onClick={() => navigate("/assistant")}
            >
              Try semantic search <ArrowRight size={14} />
            </button>
          </div>
          <div className="panel aside-panel">
            <div className="aside-heading">
              <span className="aside-icon violet">
                <Bookmark size={16} />
              </span>
              <div>
                <b>Saved research</b>
                <small>Your reading list</small>
              </div>
            </div>
            <div className="saved-summary">
              <strong>{bookmarks.length}</strong>
              <span>bookmarked records</span>
              <button
                className="text-link"
                onClick={() => navigate("/workspace")}
              >
                View workspace <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function ResearchDetail({ navigate, bookmarks, toggleBookmark }) {
  const { id } = useParams(),
    r = research.find((x) => x.id === id) || research[0],
    related = research
      .filter(
        (x) => x.id !== r.id && (x.topic === r.topic || x.state === r.state),
      )
      .slice(0, 3);
  return (
    <>
      <button className="back-link" onClick={() => navigate("/research")}>
        <ChevronLeft size={15} /> Research repository
      </button>
      <div className="detail-layout">
        <main>
          <div className="detail-overline">
            <span className="content-type">{r.type}</span>
            <span>·</span>
            <span>{r.year}</span>
            <span>·</span>
            <DemoFlag />
          </div>
          <h1 className="detail-title">{r.title}</h1>
          <div className="detail-authors">
            <div className="avatar small-avatar">{r.author.slice(0, 1)}</div>
            <span>
              <b>{r.author}</b>
              <small>{r.org}</small>
            </span>
          </div>
          <div className="detail-actions">
            <button
              className={
                "button secondary " + (bookmarks.includes(r.id) ? "saved" : "")
              }
              onClick={() => toggleBookmark(r.id)}
            >
              <Bookmark
                size={15}
                fill={bookmarks.includes(r.id) ? "currentColor" : "none"}
              />
              {bookmarks.includes(r.id) ? "Saved" : "Bookmark"}
            </button>
            <button
              className="button secondary"
              onClick={() => navigate("/assistant")}
            >
              <BrainCircuit size={15} /> Ask AI about this research
            </button>
            <button
              className="button secondary"
              onClick={() => navigate("/datasets")}
            >
              <Database size={15} /> View dataset
            </button>
          </div>
          <section className="panel detail-section">
            <div className="section-title">
              <span>01</span>
              <h2>Abstract</h2>
            </div>
            <p>
              {r.abstract} Drawing on a mixed-methods review of institutional
              practices and published evidence, this study outlines practical
              considerations for evidence-led land governance. Findings are
              presented for research and discussion; all figures are
              illustrative in this prototype.
            </p>
          </section>
          <section className="panel detail-section">
            <div className="section-title">
              <span>02</span>
              <h2>Key findings</h2>
            </div>
            <div className="finding-list">
              <div>
                <i>01</i>
                <span>
                  Coordinated data access can help researchers identify evidence
                  gaps earlier in policy design.
                </span>
              </div>
              <div>
                <i>02</i>
                <span>
                  Place-specific context matters when interpreting land
                  governance outcomes across regions.
                </span>
              </div>
              <div>
                <i>03</i>
                <span>
                  Transparent evaluation frameworks can strengthen collaboration
                  between institutions and communities.
                </span>
              </div>
            </div>
          </section>
          <section className="panel detail-section">
            <div className="section-title">
              <span>03</span>
              <h2>Document details</h2>
            </div>
            <div className="detail-info-grid">
              {[
                ["Authors", r.author],
                ["Organization", r.org],
                ["Year", r.year],
                ["State", r.state],
                ["Topic", r.topic],
                ["Document type", r.type],
                ["Length", `${r.pages} pages`],
                ["Record ID", r.id.toUpperCase()],
              ].map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
            </div>
          </section>
          <section className="panel detail-section">
            <div className="section-title">
              <span>04</span>
              <h2>Keywords</h2>
            </div>
            <div className="tag-row keyword-tags">
              {r.keywords.map((k) => (
                <span key={k}>{k}</span>
              ))}
            </div>
          </section>
        </main>
        <aside className="detail-aside">
          <div className="panel aside-panel">
            <div className="aside-heading">
              <span className="aside-icon teal">
                <BookOpen size={16} />
              </span>
              <div>
                <b>Related research</b>
                <small>More evidence to explore</small>
              </div>
            </div>
            {related.length ? (
              related.map((x) => (
                <button
                  className="related-item"
                  key={x.id}
                  onClick={() => navigate("/research/" + x.id)}
                >
                  <span className="content-type">
                    {x.type} · {x.year}
                  </span>
                  <b>{x.title}</b>
                  <small>{x.org}</small>
                  <ArrowRight size={14} />
                </button>
              ))
            ) : (
              <p className="subtle">
                Explore other research in the repository.
              </p>
            )}
          </div>
          <div className="panel note-card">
            <div className="note-icon">
              <CircleHelp size={16} />
            </div>
            <b>Working with evidence</b>
            <p>
              Research entries shown here are fictional demo records. Verify
              source material before using it in a real policy context.
            </p>
          </div>
          <div className="panel citation-card">
            <b>Reference this record</b>
            <p>
              {r.author} ({r.year}). <i>{r.title}.</i> {r.org}.
            </p>
            <button
              className="text-link"
              onClick={(e) => {
                e.currentTarget.innerText = "Citation copied";
              }}
            >
              Copy citation <ArrowRight size={13} />
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function DatasetsPage() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All categories"),
    [saved, setSaved] = useState([]);
  const items = datasets.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) &&
      (category === "All categories" || d.category === category),
  );
  return (
    <>
      <PageHead
        eyebrow="CURATED DATA CATALOGUE"
        title="Datasets"
        desc="Explore structured and geospatial evidence for land governance research."
        action={
          <button className="button secondary small">
            <Download size={15} /> Data catalogue
          </button>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>386 datasets · 42 geospatial layers</span>
        </div>
      </PageHead>
      <div className="catalogue-banner">
        <div className="catalogue-symbol">
          <Database size={20} />
        </div>
        <div>
          <b>Evidence, with context.</b>
          <p>
            Each dataset includes provenance, coverage and update information to
            support responsible reuse.
          </p>
        </div>
        <div className="catalogue-stats">
          <span>
            <b>7</b>States represented
          </span>
          <span>
            <b>5</b>Evidence themes
          </span>
        </div>
      </div>
      <div className="repo-toolbar">
        <div className="repo-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search datasets..."
          />
        </div>
        <div className="filter-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All categories</option>
            {[...new Set(datasets.map((d) => d.category))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button className="button secondary small">
            <SlidersHorizontal size={15} /> Refine
          </button>
        </div>
      </div>
      <div className="dataset-grid">
        {items.map((d, i) => (
          <article className="panel dataset-card" key={d.id}>
            <div className="dataset-card-top">
              <span className={"dataset-art art-" + (i % 4)}>
                <Database size={20} />
                <i />
                <i />
                <i />
              </span>
              <button
                className={
                  "icon-button bookmark-button " +
                  (saved.includes(d.id) ? "saved" : "")
                }
                onClick={() =>
                  setSaved((s) =>
                    s.includes(d.id)
                      ? s.filter((x) => x !== d.id)
                      : [...s, d.id],
                  )
                }
              >
                <Bookmark
                  size={16}
                  fill={saved.includes(d.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <div className="dataset-tags">
              <span>{d.category}</span>
              <DemoFlag />
            </div>
            <h2>{d.name}</h2>
            <p>
              A prototype collection supporting regional research and
              evidence-informed land-use decisions.
            </p>
            <div className="dataset-meta">
              <span>
                <MapPin size={13} />
                {d.state}
              </span>
              <span>
                <FileText size={13} />
                {d.format}
              </span>
            </div>
            <div className="dataset-bottom">
              <span>
                <Clock3 size={13} /> Updated {d.updated}
              </span>
              <b>{d.records}</b>
            </div>
            <button
              className="dataset-open"
              onClick={(e) => {
                e.currentTarget.innerText = "Dataset preview opened";
              }}
            >
              Preview dataset <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>
      <div className="panel data-note">
        <span className="note-icon">
          <CircleHelp size={17} />
        </span>
        <div>
          <b>About this catalogue</b>
          <p>
            Dataset records in this prototype are fictional and use illustrative
            metadata. They are designed to demonstrate how a future shared
            catalogue could work.
          </p>
        </div>
      </div>
    </>
  );
}

function Assistant() {
  const [messages, setMessages] = useState([]),
    [input, setInput] = useState(""),
    [active, setActive] = useState(""),
    [loading, setLoading] = useState(false);
  const ask = async (question) => {
    const q = question.trim();
    if (!q || loading) return;
    const prior = messages;
    setMessages((m) => [...m, { q, a: "", loading: true }]);
    setInput("");
    setActive(q);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...prior.flatMap((m) => [
              { role: "user", content: m.q },
              ...(m.a ? [{ role: "assistant", content: m.a }] : []),
            ]),
            { role: "user", content: q },
          ],
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "The assistant could not answer right now.",
        );
      setMessages((m) =>
        m.map((item, index) =>
          index === m.length - 1
            ? { ...item, a: result.answer, loading: false }
            : item,
        ),
      );
    } catch (error) {
      setMessages((m) =>
        m.map((item, index) =>
          index === m.length - 1
            ? { ...item, a: error.message, loading: false, error: true }
            : item,
        ),
      );
    } finally {
      setLoading(false);
    }
  };
  const all = messages.length ? messages : [];
  return (
    <>
      <PageHead
        eyebrow="EVIDENCE-GROUNDED DISCOVERY"
        title="AI research assistant"
        desc="Ask a question. Explore the research and data behind the answer."
        action={
          <button
            className="button secondary small"
            onClick={() => {
              setMessages([]);
              setActive("");
              setLoading(false);
            }}
          >
            <Plus size={15} /> New conversation
          </button>
        }
      >
        <div className="head-meta">
          <span className="ai-status">
            <i /> OpenAI powered · prototype evidence
          </span>
          <span>Grounded in local demo records</span>
        </div>
      </PageHead>
      <div className="assistant-shell">
        <aside className="assistant-history">
          <div className="history-head">
            <b>Conversations</b>
            <button
              className="icon-button"
              onClick={() => {
                setMessages([]);
                setActive("");
              }}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            className="new-chat"
            onClick={() => {
              setMessages([]);
              setActive("");
            }}
          >
            <Plus size={15} /> New conversation
          </button>
          <div className="history-group">
            TODAY
            {(active
              ? [active]
              : [
                  "Land governance challenges",
                  "Land records across states",
                  "Relevant planning datasets",
                ]
            ).map((x, i) => (
              <button
                className={
                  "history-item " +
                  (active === x || (!active && i === 0) ? "selected" : "")
                }
                key={x}
                onClick={() => setActive(x)}
              >
                <MessageSquareText size={14} />
                <span>{x}</span>
                <MoreHorizontal size={14} />
              </button>
            ))}
          </div>
          <div className="history-note">
            <Sparkles size={16} />
            <span>
              <b>Research with context</b>
              <small>
                Answers cite evidence from the prototype collection.
              </small>
            </span>
          </div>
        </aside>
        <section className="assistant-chat">
          <div className="chat-context">
            <span className="context-dot" />
            <span>Land governance evidence collection</span>
            <span className="context-divider" />
            <span>7 sources indexed</span>
            <button className="more-button">
              Context <ChevronDown size={13} />
            </button>
          </div>
          <div className="chat-scroll">
            {all.length ? (
              all.map((m, i) => (
                <div className="message-pair" key={i}>
                  <div className="user-message">
                    <span className="avatar user-avatar">AS</span>
                    <p>{m.q}</p>
                  </div>
                  <div className="assistant-message">
                    <div className="assistant-mark">
                      <BrainCircuit size={16} />
                    </div>
                    <div className="answer-content">
                      <div className="answer-label">
                        <b>Bhoomi Assistant</b>
                        <span className="ai-prototype-pill">
                          OPENAI RESPONSE
                        </span>
                        <span>Just now</span>
                      </div>
                      <p className={m.error ? "assistant-error" : ""}>
                        {m.loading ? "Bhoomi Assistant is thinking…" : m.a}
                      </p>
                      <div className="answer-citations">
                        <span>Based on 3 evidence sources</span>
                        <button
                          onClick={() =>
                            document
                              .getElementById("evidence-panel")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          View sources <ArrowRight size={13} />
                        </button>
                      </div>
                      <div className="answer-actions">
                        <button onClick={() => {}}>Copy response</button>
                        <button onClick={() => {}}>
                          Helpful <Check size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="chat-welcome">
                <span className="welcome-symbol">
                  <BrainCircuit size={23} />
                </span>
                <div className="eyebrow">YOUR EVIDENCE DESK</div>
                <h2>
                  What would you like
                  <br />
                  to understand?
                </h2>
                <p>
                  Ask a question about land governance and I’ll connect it to
                  research, policy reports and relevant datasets.
                </p>
                <div className="suggestion-grid">
                  {[
                    "What are the major land governance challenges in India?",
                    "Compare land governance research across states.",
                    "Which datasets are relevant to land-use planning?",
                    "How can GIS support land governance?",
                  ].map((s, i) => (
                    <button key={s} onClick={() => ask(s)}>
                      <span>0{i + 1}</span>
                      {s}
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="chat-composer">
            <div className="composer-box">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Ask about land governance evidence..."
                rows="1"
              />
              <div className="composer-tools">
                <span>
                  <Sparkles size={13} /> Answers include source citations
                </span>
                <button disabled={!input.trim()} onClick={() => ask(input)}>
                  <Send size={15} />
                </button>
              </div>
            </div>
            <small>
              AI responses use OpenAI and the local demo research catalogue.
              Verify original sources before relying on findings.
            </small>
          </div>
        </section>
        <aside className="evidence-panel" id="evidence-panel">
          <div className="evidence-head">
            <div>
              <span className="eyebrow">ANSWER CONTEXT</span>
              <h3>Evidence sources</h3>
            </div>
            <button className="icon-button">
              <MoreHorizontal size={17} />
            </button>
          </div>
          <p className="evidence-intro">
            Research referenced in the current answer.
          </p>
          {(messages.length
            ? [research[0], research[1], research[2]]
            : [research[0], research[1], datasets[0]]
          ).map((r, i) => (
            <div className="evidence-card" key={r.id}>
              <div className="evidence-card-top">
                <span className="source-type">{r.type || "Dataset"}</span>
                <span className="relevance">{[92, 87, 81][i]}% match</span>
              </div>
              <b>{r.title || r.name}</b>
              <small>
                {r.org || r.state} · {r.year || "2025"}
              </small>
              <div className="relevance-track">
                <i style={{ width: [92, 87, 81][i] + "%" }} />
              </div>
              <button
                className="text-link"
                onClick={() =>
                  r.id?.startsWith("r") && location.assign("/research/" + r.id)
                }
              >
                Open source <ArrowRight size={12} />
              </button>
            </div>
          ))}
          <button
            className="button secondary full-width"
            onClick={() => location.assign("/research")}
          >
            Browse research collection <ArrowRight size={14} />
          </button>
          <div className="evidence-caveat">
            <CircleHelp size={15} />
            <span>
              <b>Prototype AI response</b>
              <small>
                Responses are predefined demonstrations, not generated analysis.
              </small>
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}
function answerFor(q) {
  const s = q.toLowerCase();
  if (s.includes("acquisition") || s.includes("disput"))
    return "The demo collection points to recurring concerns around acquisition timelines, rehabilitation planning, grievance pathways and the availability of consistent records. Research in this area highlights the value of transparent processes, accessible information and place-specific evaluation.";
  if (s.includes("dataset") || s.includes("planning"))
    return "For land-use planning, the prototype catalogue includes district land-use classification, urban growth and agricultural change, and rainfall and land-stress indicators. Combining these layers can help frame a regional question, while their illustrative metadata should be verified before real use.";
  if (s.includes("gis") || s.includes("map"))
    return "GIS can connect research findings to their geographic context, support comparison across regions, and reveal where evidence is limited. In this prototype, map layers demonstrate how research activity, policy indicators and case studies could be explored together.";
  if (s.includes("state") || s.includes("compare"))
    return "The demo repository includes research from Uttar Pradesh, Maharashtra, Rajasthan, Madhya Pradesh, Tamil Nadu, Karnataka and Bihar. Differences in topic coverage suggest useful questions for comparative research, though the counts here are fictional and should not be interpreted as official state statistics.";
  return "Based on the available research collection, major recurring themes include fragmented land records, acquisition delays, disputes, limited interoperability between systems, and gaps in evidence-based policy evaluation. The sources point to the importance of transparent records, stronger coordination and locally grounded evidence.";
}

function GISPage() {
  const [selected, setSelected] = useState(regions[0]),
    [placeQuery, setPlaceQuery] = useState(""),
    [tileState, setTileState] = useState("loading"),
    [tileVersion, setTileVersion] = useState(0),
    [layers, setLayers] = useState({
      States: true,
      Districts: false,
      "Research Activity": true,
      "Policy Indicators": true,
      "Case Studies": false,
    });
  return (
    <>
      <PageHead
        eyebrow="PLACE-BASED EVIDENCE"
        title="GIS intelligence"
        desc="Explore land governance evidence through a geographic lens."
        action={
          <button className="button secondary small">
            <Layers size={15} /> Manage layers
          </button>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>OpenStreetMap · Demo features</span>
        </div>
      </PageHead>
      <div className="gis-layout">
        <aside className="panel layer-panel">
          <div className="panel-head">
            <div>
              <h2>Map layers</h2>
              <p>Choose what to explore</p>
            </div>
            <button className="icon-button">
              <SlidersHorizontal size={16} />
            </button>
          </div>
          <div className="layer-group-label">GOVERNANCE LAYERS</div>
          {Object.entries(layers).map(([k, v], i) => (
            <label className="layer-toggle" key={k}>
              <span className={"layer-swatch swatch-" + i}>
                <i />
              </span>
              <span>
                {k}
                <small>{[7, 75, 7, 6, 7][i]} features</small>
              </span>
              <input
                type="checkbox"
                checked={v}
                onChange={() => setLayers((s) => ({ ...s, [k]: !s[k] }))}
              />
              <i className="switch-track" />
            </label>
          ))}
          <div className="layer-legend">
            <b>ACTIVITY INTENSITY</b>
            <div>
              <span>Low</span>
              <i />
              <span>High</span>
            </div>
          </div>
          <div className="layer-note">
            <CircleHelp size={14} />
            <span>Regional indicators are illustrative prototype data.</span>
          </div>
        </aside>
        <div className="map-stage">
          <MapContainer
            center={[22.8, 79.2]}
            zoom={4.5}
            scrollWheelZoom
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <MapFocus region={selected} />
            <TileLayer
              key={tileVersion}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
              eventHandlers={{
                tileload: () => setTileState("ready"),
                tileerror: () => setTileState("error"),
              }}
            />
            <ZoomControl position="topright" />
            {layers.States &&
              regions.map((r, i) => (
                <Polygon
                  key={`state-${r.name}`}
                  positions={r.shape}
                  pathOptions={{
                    color: colors[i % colors.length],
                    fillColor: colors[i % colors.length],
                    fillOpacity: selected.name === r.name ? 0.24 : 0.1,
                    weight: selected.name === r.name ? 2 : 1,
                  }}
                  eventHandlers={{ click: () => setSelected(r) }}
                >
                  <Popup>
                    <div className="map-popup">
                      <b>{r.name}</b>
                      <span>
                        {r.projects} research projects · {r.datasets} datasets
                      </span>
                      <span>{r.indicator}</span>
                    </div>
                  </Popup>
                </Polygon>
              ))}
            {(layers["Research Activity"] ||
              layers["Policy Indicators"] ||
              layers["Case Studies"] ||
              layers.Districts) &&
              regions.map((r, i) => (
                <CircleMarker
                  key={`marker-${r.name}`}
                  center={r.coords}
                  radius={
                    selected.name === r.name ? 9 : layers.Districts ? 4 : 6
                  }
                  pathOptions={{
                    color: layers["Policy Indicators"]
                      ? "#f3b957"
                      : colors[i % colors.length],
                    fillColor: layers["Policy Indicators"]
                      ? "#f3b957"
                      : colors[i % colors.length],
                    fillOpacity: layers["Case Studies"] ? 0.9 : 0.72,
                    weight: selected.name === r.name ? 3 : 1,
                  }}
                  eventHandlers={{ click: () => setSelected(r) }}
                >
                  <Popup>
                    <div className="map-popup">
                      <b>{r.name}</b>
                      <span>{r.projects} research projects</span>
                      <span>{r.indicator}</span>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
          {tileState === "error" && (
            <div className="map-tile-error">
              <Map size={15} />
              <span>
                <b>OpenStreetMap tiles did not load</b>
                <small>
                  Check your internet connection. Region outlines and markers
                  still work.
                </small>
              </span>
              <button
                onClick={() => {
                  setTileState("loading");
                  setTileVersion((v) => v + 1);
                }}
              >
                Retry
              </button>
            </div>
          )}
          {tileState === "loading" && (
            <div className="map-tile-loading">
              <span className="live-dot" /> Loading OpenStreetMap…
            </div>
          )}
          <div className="map-search">
            <Search size={15} />
            <input
              value={placeQuery}
              onChange={(e) => setPlaceQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const match = regions.find((r) =>
                    r.name.toLowerCase().includes(placeQuery.toLowerCase()),
                  );
                  if (match) setSelected(match);
                }
              }}
              placeholder="Search a state, e.g. Rajasthan..."
              list="gis-places"
            />
            <datalist id="gis-places">
              {regions.map((r) => (
                <option key={r.name} value={r.name} />
              ))}
            </datalist>
          </div>
          <div className="map-scale">
            Illustrative regional data<span>Last updated Sep 2025</span>
          </div>
          <div className="map-mobile-data">
            <MapPin size={14} />
            {selected.name} <ChevronDown size={14} />
          </div>
        </div>
        <aside className="panel region-panel">
          <div className="region-panel-top">
            <span className="region-label">
              <MapPin size={12} /> SELECTED REGION
            </span>
            <button className="icon-button">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <h2>{selected.name}</h2>
          <p className="region-subtitle">Regional evidence overview</p>
          <div className="region-mini-map">
            <div className="mini-map-graphic">
              <span className="mini-state active" />
              <span className="mini-state s2" />
              <span className="mini-state s3" />
              <i className="mini-map-pin" />
            </div>
            <span>
              INDIA
              <br />
              REGIONAL VIEW
            </span>
          </div>
          <div className="region-metrics">
            <div>
              <b>{selected.projects}</b>
              <small>Research projects</small>
            </div>
            <div>
              <b>{selected.datasets}</b>
              <small>Datasets</small>
            </div>
            <div>
              <b>{selected.studies}</b>
              <small>Policy studies</small>
            </div>
            <div>
              <b>{selected.caseStudies}</b>
              <small>Case studies</small>
            </div>
          </div>
          <div className="region-indicator">
            <span className="indicator-icon">
              <Activity size={15} />
            </span>
            <div>
              <small>POLICY INDICATOR</small>
              <b>{selected.indicator}</b>
            </div>
            <ArrowUpRight size={14} />
          </div>
          <div className="region-links">
            <button onClick={() => location.assign("/research")}>
              View regional research <ArrowRight size={14} />
            </button>
            <button onClick={() => location.assign("/datasets")}>
              Explore datasets <ArrowRight size={14} />
            </button>
            <button onClick={() => location.assign("/analytics")}>
              Compare region <ArrowRight size={14} />
            </button>
          </div>
          <div className="region-foot">
            <i /> PROTOTYPE DATA · NOT OFFICIAL STATISTICS
          </div>
        </aside>
      </div>
    </>
  );
}

function MapFocus({ region }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(region.coords, Math.max(map.getZoom(), 5.5), { duration: 0.65 });
  }, [map, region]);
  return null;
}

function AnalyticsPage() {
  const [tab, setTab] = useState("Overview"),
    [compare, setCompare] = useState([
      "Uttar Pradesh",
      "Maharashtra",
      "Rajasthan",
    ]);
  return (
    <>
      <PageHead
        eyebrow="EVIDENCE & INDICATORS"
        title="Policy analytics"
        desc="Explore research signals, land-use patterns and policy indicators across states."
        action={
          <button className="button secondary small">
            <Download size={15} /> Export analysis
          </button>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>Illustrative trends · 2025</span>
        </div>
      </PageHead>
      <div className="analytics-tabs">
        {[
          "Overview",
          "Research intelligence",
          "Policy intelligence",
          "Land-use trends",
        ].map((t) => (
          <button
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="analytics-kpis">
        {[
          ["Research publications", "1,248", "+12.4%", "papers indexed"],
          ["Dataset growth", "386", "+8.2%", "records available"],
          ["State activity", "7", "Across India", "states in demo"],
          ["Policy indicators", "24", "+3 this month", "signals tracked"],
        ].map((x, i) => (
          <div className="panel analytics-kpi" key={x[0]}>
            <span className={"analytics-kpi-icon tone-" + i}>
              {
                [
                  <BookOpen size={17} />,
                  <Database size={17} />,
                  <MapPin size={17} />,
                  <Activity size={17} />,
                ][i]
              }
            </span>
            <small>{x[0]}</small>
            <div>
              <b>{x[1]}</b>
              <span className="positive-change">
                <ArrowUpRight size={12} />
                {x[2]}
              </span>
            </div>
            <span className="muted-text">{x[3]}</span>
          </div>
        ))}
      </div>
      <div className="analytics-grid">
        <section className="panel chart-panel wide">
          <div className="panel-head">
            <div>
              <h2>Research intelligence</h2>
              <p>Publication and policy activity over time</p>
            </div>
            <button className="select-like">
              Jan – Aug 2025 <ChevronDown size={14} />
            </button>
          </div>
          <div className="chart-wrap medium">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activity}
                margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 5"
                  stroke="var(--line)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 9,
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Line
                  name="Research papers"
                  dataKey="papers"
                  stroke="#40d6c2"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: "#40d6c2" }}
                />
                <Line
                  name="Policy studies"
                  dataKey="policy"
                  stroke="#8b7cf6"
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: "#8b7cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Evidence themes</h2>
              <p>Dataset mix by topic</p>
            </div>
            <button className="more-button">
              <MoreHorizontal size={17} />
            </button>
          </div>
          <div className="donut-content analytics-donut">
            <div className="donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {distribution.map((e, i) => (
                      <Cell key={i} fill={colors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <b>386</b>
                <small>records</small>
              </div>
            </div>
            <div className="legend-list">
              {distribution.map((x, i) => (
                <div key={x.name}>
                  <i style={{ background: colors[i] }} />
                  {x.name}
                  <b>{x.value}%</b>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Policy indicator trends</h2>
              <p>Illustrative index · Q1–Q4</p>
            </div>
            <button className="select-like">
              2025 <ChevronDown size={13} />
            </button>
          </div>
          <div className="chart-wrap medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { q: "Q1", records: 45, planning: 36 },
                  { q: "Q2", records: 53, planning: 43 },
                  { q: "Q3", records: 62, planning: 49 },
                  { q: "Q4", records: 71, planning: 58 },
                ]}
                margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="recordFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b7cf6" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#8b7cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 5"
                  stroke="var(--line)"
                  vertical={false}
                />
                <XAxis
                  dataKey="q"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 9,
                  }}
                />
                <Area
                  name="Record access"
                  dataKey="records"
                  stroke="#8b7cf6"
                  fill="url(#recordFill)"
                  strokeWidth={2}
                />
                <Area
                  name="Planning alignment"
                  dataKey="planning"
                  stroke="#40d6c2"
                  fill="transparent"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel chart-panel wide">
          <div className="panel-head">
            <div>
              <h2>State comparison</h2>
              <p>Research activity and evidence coverage</p>
            </div>
            <button className="select-like">
              Research activity <ChevronDown size={13} />
            </button>
          </div>
          <div className="compare-select">
            {states.map((s) => (
              <label key={s.name}>
                <input
                  type="checkbox"
                  checked={compare.includes(s.name)}
                  onChange={() =>
                    setCompare((c) =>
                      c.includes(s.name)
                        ? c.filter((x) => x !== s.name)
                        : [...c, s.name],
                    )
                  }
                />
                <i />
                {s.name}
              </label>
            ))}
          </div>
          <div className="chart-wrap compare-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={states.filter((s) => compare.includes(s.name))}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 5"
                  stroke="var(--line)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 9,
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Research records"
                  radius={[5, 5, 0, 0]}
                >
                  {states
                    .filter((s) => compare.includes(s.name))
                    .map((s, i) => (
                      <Cell key={s.name} fill={colors[i % colors.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <div className="analytics-disclaimer">
        <CircleHelp size={15} />
        <span>
          All figures, trends and state comparisons on this page are fictional
          prototype data. They do not represent official government statistics.
        </span>
      </div>
    </>
  );
}

function Simulation() {
  const [params, setParams] = useState({
      allocation: 40,
      urban: 20,
      infrastructure: 30,
      climate: 15,
    }),
    [result, setResult] = useState(false),
    [name, setName] = useState("Balanced growth");
  const update = (k, v) => {
    setParams((p) => ({ ...p, [k]: Number(v) }));
    setResult(false);
  };
  const data = result
    ? [
        {
          name: "Agricultural",
          baseline: 52,
          scenario: Math.max(
            30,
            52 -
              Math.round(
                (params.urban - 20) * 0.3 + (params.infrastructure - 30) * 0.12,
              ),
          ),
        },
        {
          name: "Urban",
          baseline: 18,
          scenario: Math.min(
            40,
            18 +
              Math.round(
                (params.urban - 20) * 0.45 +
                  (params.infrastructure - 30) * 0.16,
              ),
          ),
        },
        {
          name: "Forest & commons",
          baseline: 21,
          scenario: Math.max(12, 21 - Math.round((params.climate - 15) * 0.16)),
        },
        { name: "Other", baseline: 9, scenario: 10 },
      ]
    : [
        { name: "Agricultural", baseline: 52, scenario: 52 },
        { name: "Urban", baseline: 18, scenario: 18 },
        { name: "Forest & commons", baseline: 21, scenario: 21 },
        { name: "Other", baseline: 9, scenario: 9 },
      ];
  return (
    <>
      <PageHead
        eyebrow="EXPLORE POLICY TRADE-OFFS"
        title="Policy simulation"
        desc="Build an illustrative land-use scenario and compare its potential indicator shifts."
        action={
          <span className="simulation-warning">
            <CircleHelp size={14} /> DEMO MODEL · NOT A FORECAST
          </span>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>Local scenario calculator</span>
        </div>
      </PageHead>
      <div className="simulation-grid">
        <section className="panel simulation-controls">
          <div className="panel-head">
            <div>
              <h2>Scenario parameters</h2>
              <p>Adjust the assumptions for this scenario.</p>
            </div>
            <button className="icon-button">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <label className="scenario-name">
            SCENARIO NAME
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="slider-list">
            {[
              [
                "allocation",
                "Land-use allocation",
                "Share of area prioritised for productive land",
                0,
                100,
                "%",
              ],
              [
                "urban",
                "Urban expansion",
                "Illustrative growth pressure across urban edges",
                0,
                50,
                "%",
              ],
              [
                "infrastructure",
                "Infrastructure development",
                "Planned transport and public works intensity",
                0,
                60,
                "%",
              ],
              [
                "climate",
                "Climate risk factor",
                "Relative exposure incorporated in scenario",
                0,
                40,
                "%",
              ],
            ].map(([k, l, d, min, max, suffix]) => (
              <div className="slider-item" key={k}>
                <div className="slider-heading">
                  <b>{l}</b>
                  <strong>
                    {params[k]}
                    {suffix}
                  </strong>
                </div>
                <p>{d}</p>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={params[k]}
                  style={{
                    "--range-fill": `${((params[k] - min) / (max - min)) * 100}%`,
                  }}
                  onChange={(e) => update(k, e.target.value)}
                />
                <div className="range-ends">
                  <span>
                    {min}
                    {suffix}
                  </span>
                  <span>
                    {max}
                    {suffix}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="simulation-controls-foot">
            <span>
              <CircleHelp size={14} /> Adjust values to explore trade-offs.
            </span>
            <button className="button primary" onClick={() => setResult(true)}>
              <Zap size={15} /> Run simulation
            </button>
          </div>
        </section>
        <div className="simulation-results">
          <div className="panel scenario-summary">
            <span className="scenario-icon">
              <SlidersHorizontal size={17} />
            </span>
            <div>
              <span className="eyebrow">CURRENT SCENARIO</span>
              <h3>{name || "Untitled scenario"}</h3>
              <p>
                {result
                  ? "Scenario calculated locally using illustrative assumptions."
                  : "Adjust parameters, then run your scenario to see a comparison."}
              </p>
            </div>
            <span className="scenario-state">
              <i />
              {result ? "Complete" : "Draft"}
            </span>
          </div>
          <section className="panel scenario-chart-panel">
            <div className="panel-head">
              <div>
                <h2>Land-use composition</h2>
                <p>
                  Baseline compared with {name || "scenario"} · indicative share
                </p>
              </div>
              <span className="comparison-key">
                <i /> Baseline <i /> Scenario
              </span>
            </div>
            <div className="chart-wrap sim-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 6, right: 20, left: 5, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 5"
                    stroke="var(--line)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 70]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={115}
                    tick={{ fill: "var(--muted)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                      borderRadius: 9,
                    }}
                  />
                  <Bar
                    dataKey="baseline"
                    name="Baseline"
                    fill="#64748b"
                    radius={[0, 4, 4, 0]}
                    barSize={10}
                  />
                  <Bar
                    dataKey="scenario"
                    name="Scenario"
                    fill="#40d6c2"
                    radius={[0, 4, 4, 0]}
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="scenario-table">
              <div className="scenario-table-head">
                <span>Indicator</span>
                <span>Baseline</span>
                <span>Scenario</span>
                <span>Change</span>
              </div>
              {data.map((d) => (
                <div className="scenario-table-row" key={d.name}>
                  <b>{d.name} land</b>
                  <span>{d.baseline}%</span>
                  <span>{d.scenario}%</span>
                  <strong
                    className={
                      d.scenario > d.baseline
                        ? "up-change"
                        : d.scenario < d.baseline
                          ? "down-change"
                          : ""
                    }
                  >
                    {d.scenario > d.baseline ? "+" : ""}
                    {d.scenario - d.baseline} pp
                  </strong>
                </div>
              ))}
            </div>
            <button
              className="button secondary full-width"
              disabled={!result}
              onClick={() => {
                localStorage.setItem(
                  "bhoomi-last-simulation",
                  JSON.stringify({ name, params, data }),
                );
                alert("Scenario saved to your research workspace.");
              }}
            >
              <Bookmark size={15} /> Save scenario to workspace
            </button>
          </section>
          <div className="simulation-note">
            <CircleHelp size={16} />
            <span>
              <b>Prototype scenario simulation</b>
              <small>
                This local calculator demonstrates scenario comparison only. It
                is not a scientific model or government forecast; all outputs
                are illustrative.
              </small>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function Workspace({ bookmarks, navigate }) {
  const [selected, setSelected] = useState(projects[0]),
    [tab, setTab] = useState("Overview");
  const [scenario, setScenario] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("bhoomi-last-simulation") || "null",
      );
    } catch {
      return null;
    }
  });
  return (
    <>
      <PageHead
        eyebrow="COLLABORATIVE RESEARCH"
        title="Research workspace"
        desc="Keep projects, evidence and shared work moving in one place."
        action={
          <button className="button primary small">
            <Plus size={15} /> New project
          </button>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>3 active projects</span>
        </div>
      </PageHead>
      <div className="workspace-stats">
        {[
          ["Active projects", "03", Activity],
          [
            "Saved research",
            String(bookmarks.length).padStart(2, "0"),
            Bookmark,
          ],
          ["Bookmarked datasets", "02", Database],
          ["Collaborators", "25", Users],
        ].map(([t, n, I]) => (
          <div className="panel workspace-stat" key={t}>
            <span>
              <I size={16} />
            </span>
            <div>
              <small>{t}</small>
              <b>{n}</b>
            </div>
          </div>
        ))}
      </div>
      <div className="workspace-layout">
        <section className="panel project-list-panel">
          <div className="panel-head">
            <div>
              <h2>My projects</h2>
              <p>Collaborative work in progress</p>
            </div>
            <button className="icon-button">
              <SlidersHorizontal size={15} />
            </button>
          </div>
          {projects.map((p) => (
            <button
              className={
                "workspace-project " + (selected.id === p.id ? "selected" : "")
              }
              key={p.id}
              onClick={() => setSelected(p)}
            >
              <div className={"project-dot " + p.tone} />
              <div className="workspace-project-info">
                <b>{p.name}</b>
                <small>
                  {p.lead} · {p.members} members
                </small>
                <div className="progress-track">
                  <i style={{ width: p.progress + "%" }} />
                </div>
              </div>
              <span className="status-pill">{p.status}</span>
              <ChevronRight size={14} />
            </button>
          ))}
          <button className="add-project">
            <Plus size={15} /> Create a project
          </button>
        </section>
        <section className="panel project-detail-panel">
          <div className="project-detail-banner">
            <div className={"project-detail-mark " + selected.tone}>
              <Leaf size={21} />
            </div>
            <div>
              <span className="eyebrow">
                RESEARCH PROJECT · {selected.id.toUpperCase()}
              </span>
              <h2>{selected.name}</h2>
              <div className="project-detail-meta">
                <span>
                  <Users size={13} />
                  {selected.members} collaborators
                </span>
                <span>
                  <Clock3 size={13} />
                  Due {selected.deadline}
                </span>
                <span className="status-pill">{selected.status}</span>
              </div>
            </div>
            <button className="icon-button">
              <MoreHorizontal size={17} />
            </button>
          </div>
          <div className="project-tabs">
            {["Overview", "Research", "Datasets", "Members", "Timeline"].map(
              (x) => (
                <button
                  className={tab === x ? "active" : ""}
                  onClick={() => setTab(x)}
                  key={x}
                >
                  {x}
                </button>
              ),
            )}
          </div>
          {tab === "Overview" ? (
            <div className="project-overview">
              <div className="project-progress-box">
                <div>
                  <span>PROJECT COMPLETION</span>
                  <b>{selected.progress}%</b>
                </div>
                <div className="progress-track">
                  <i style={{ width: selected.progress + "%" }} />
                </div>
                <small>Updated 2 hours ago by {selected.lead}</small>
              </div>
              <h3>Project overview</h3>
              <p>{selected.summary}</p>
              <div className="project-overview-cards">
                <div>
                  <span className="overview-icon teal">
                    <FileText size={16} />
                  </span>
                  <b>Research library</b>
                  <small>{bookmarks.length + 12} linked records</small>
                  <button
                    className="text-link"
                    onClick={() => setTab("Research")}
                  >
                    Open library <ArrowRight size={12} />
                  </button>
                </div>
                <div>
                  <span className="overview-icon violet">
                    <Database size={16} />
                  </span>
                  <b>Data catalogue</b>
                  <small>8 datasets connected</small>
                  <button
                    className="text-link"
                    onClick={() => setTab("Datasets")}
                  >
                    View datasets <ArrowRight size={12} />
                  </button>
                </div>
              </div>
              <h3 className="activity-heading">Recent activity</h3>
              {[
                [
                  "Dr. Meera Kulkarni",
                  "Added 3 research papers to the project",
                  "2h ago",
                ],
                [
                  "Ananya Singh",
                  "Updated the project methodology",
                  "Yesterday",
                ],
                [
                  "You",
                  "Bookmarked “Land Acquisition and Community Displacement Patterns”",
                  "Yesterday",
                ],
              ].map((x) => (
                <div className="activity-row" key={x[0] + x[1]}>
                  <div className="avatar activity-avatar">
                    {x[0].slice(0, 1)}
                  </div>
                  <div>
                    <b>{x[0]}</b>
                    <small>{x[1]}</small>
                  </div>
                  <span>{x[2]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="project-tab-body">
              {tab === "Research" ? (
                <>
                  <h3>Research library</h3>
                  <p>Evidence connected to this project.</p>
                  <ResearchRows
                    items={research.slice(0, 3)}
                    onOpen={(id) => navigate("/research/" + id)}
                  />
                  <button
                    className="button secondary small"
                    onClick={() => navigate("/research")}
                  >
                    <Plus size={14} /> Add research
                  </button>
                </>
              ) : tab === "Datasets" ? (
                <>
                  <h3>Connected datasets</h3>
                  <p>Shared data sources for this project.</p>
                  {datasets.slice(0, 3).map((d) => (
                    <div className="linked-data" key={d.id}>
                      <Database size={16} />
                      <b>{d.name}</b>
                      <span>{d.format}</span>
                    </div>
                  ))}
                  <button
                    className="button secondary small"
                    onClick={() => navigate("/datasets")}
                  >
                    <Plus size={14} /> Browse datasets
                  </button>
                </>
              ) : tab === "Members" ? (
                <>
                  <h3>Project members</h3>
                  {[
                    "Dr. Meera Kulkarni · Project lead",
                    "Ananya Singh · Researcher",
                    "Rahul Patel · GIS analyst",
                    "Priya Nair · Policy analyst",
                  ].map((x) => (
                    <div className="member-row" key={x}>
                      <span className="avatar activity-avatar">{x[0]}</span>
                      {x}
                      <span className="member-status">Active</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h3>Project timeline</h3>
                  {[
                    ["Sep 04", "Evidence review started", "Complete"],
                    ["Sep 18", "Regional data mapping", "Complete"],
                    ["Oct 04", "Draft policy framework", "In progress"],
                    ["Oct 24", "Final synthesis", "Upcoming"],
                  ].map((x) => (
                    <div className="timeline-row" key={x[0]}>
                      <span>{x[0]}</span>
                      <i />
                      <b>{x[1]}</b>
                      <small>{x[2]}</small>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </section>
      </div>
      {scenario && (
        <div className="saved-scenario-strip">
          <span className="scenario-icon">
            <SlidersHorizontal size={16} />
          </span>
          <div>
            <b>Saved simulation: {scenario.name}</b>
            <small>Scenario parameters stored locally in your workspace.</small>
          </div>
          <button className="text-link" onClick={() => navigate("/simulation")}>
            Reopen simulation <ArrowRight size={13} />
          </button>
        </div>
      )}
    </>
  );
}

function Innovation() {
  const [selected, setSelected] = useState(challenges[0]),
    [modal, setModal] = useState(false),
    [submitted, setSubmitted] = useState(false);
  return (
    <>
      <PageHead
        eyebrow="IDEAS INTO PRACTICE"
        title="Innovation hub"
        desc="Connect emerging ideas with challenges, research grants and pilot opportunities."
        action={
          <button className="button secondary small">
            <Sparkles size={15} /> About the hub
          </button>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>3 featured opportunities</span>
        </div>
      </PageHead>
      <div className="innovation-banner">
        <div className="innovation-art">
          <div className="innovation-orbit orbit-a" />
          <div className="innovation-orbit orbit-b" />
          <Sparkles size={28} />
          <span>
            IDEAS
            <br />→ IMPACT
          </span>
        </div>
        <div>
          <span className="eyebrow">OPEN CALL · OCTOBER 2025</span>
          <h2>
            Make evidence work
            <br />
            better for everyone.
          </h2>
          <p>
            Join researchers and practitioners tackling the most pressing
            questions in land governance.
          </p>
          <button
            className="button primary small"
            onClick={() => {
              setSelected(challenges[0]);
              setModal(true);
            }}
          >
            Explore the open call <ArrowRight size={14} />
          </button>
        </div>
        <div className="innovation-badges">
          <span>
            <Users size={14} /> 250+ participants
          </span>
          <span>
            <Globe2 size={14} /> Nationwide
          </span>
          <span>
            <Clock3 size={14} /> Rolling opportunities
          </span>
        </div>
      </div>
      <div className="innovation-section-head">
        <div>
          <span className="eyebrow">FIND YOUR NEXT CHALLENGE</span>
          <h2>Opportunities for change</h2>
        </div>
        <div className="innovation-filters">
          <button className="active">All opportunities</button>
          <button>Challenges</button>
          <button>Grants & pilots</button>
        </div>
      </div>
      <div className="challenge-grid">
        {challenges.map((c, i) => (
          <article className="panel challenge-card" key={c.id}>
            <div className="challenge-card-top">
              <span className={"challenge-icon challenge-" + i}>
                {i === 0 ? (
                  <BrainCircuit size={19} />
                ) : i === 1 ? (
                  <Map size={19} />
                ) : (
                  <Target size={19} />
                )}
              </span>
              <span
                className={"status-pill " + (c.status === "Open" ? "open" : "")}
              >
                {c.status === "Open" && <i />}
                {c.status}
              </span>
              <button className="icon-button">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <span className="challenge-type">
              {c.tag} <i /> {c.org}
            </span>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <div className="challenge-meta">
              <span>
                <Clock3 size={13} />
                {c.status === "Closed"
                  ? "Accepting proposals"
                  : `Deadline ${c.deadline}`}
              </span>
              <span>
                <Users size={13} />
                {c.participants} participants
              </span>
            </div>
            <button
              className="button secondary small full-width"
              onClick={() => {
                setSelected(c);
                setModal(true);
              }}
            >
              View opportunity <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>
      <section className="innovation-help">
        <div>
          <span className="help-orb">
            <MessageSquareText size={18} />
          </span>
          <div>
            <b>Have an idea that doesn't fit a challenge?</b>
            <small>
              Share a project proposal with the land governance research
              community.
            </small>
          </div>
        </div>
        <button
          className="button secondary small"
          onClick={() => {
            setSelected(challenges[2]);
            setModal(true);
          }}
        >
          Submit a proposal <ArrowRight size={14} />
        </button>
      </section>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="challenge-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close icon-button"
              onClick={() => setModal(false)}
            >
              <X size={17} />
            </button>
            {submitted ? (
              <div className="submission-success">
                <span>
                  <Check size={23} />
                </span>
                <div className="eyebrow">SUBMISSION RECEIVED</div>
                <h2>Your idea is on its way.</h2>
                <p>
                  This prototype submission has been recorded locally for the
                  demo. Thank you for contributing to land governance
                  innovation.
                </p>
                <span className="prototype-label">
                  <i /> PROTOTYPE SUBMISSION
                </span>
                <button
                  className="button primary"
                  onClick={() => {
                    setModal(false);
                    setSubmitted(false);
                  }}
                >
                  Back to innovation hub
                </button>
              </div>
            ) : (
              <>
                <div className="modal-scroll">
                  <div className="modal-eyebrow">
                    <span className="content-type">{selected.tag}</span>
                    <span className="status-pill open">
                      <i /> {selected.status}
                    </span>
                  </div>
                  <h2>{selected.title}</h2>
                  <p className="modal-org">
                    {selected.org} · Deadline {selected.deadline}
                  </p>
                  <p className="challenge-detail-copy">
                    {selected.description}
                  </p>
                  <div className="challenge-detail-block">
                    <b>Challenge objectives</b>
                    <p>{selected.objective}</p>
                  </div>
                  <div className="challenge-detail-block">
                    <b>Eligibility</b>
                    <p>{selected.eligibility}</p>
                  </div>
                  <div className="challenge-timeline">
                    <span>
                      <i />
                      Call opens<strong>01 Sep 2025</strong>
                    </span>
                    <span>
                      <i />
                      Submissions close<strong>{selected.deadline}</strong>
                    </span>
                    <span>
                      <i />
                      Review period<strong>3 weeks</strong>
                    </span>
                  </div>
                  <div className="submission-form">
                    <div className="section-title">
                      <span>01</span>
                      <h3>Submit your idea</h3>
                    </div>
                    <label>
                      IDEA TITLE
                      <input placeholder="Give your idea a clear name" />
                    </label>
                    <label>
                      DESCRIPTION
                      <textarea
                        rows="3"
                        placeholder="What problem will your idea address? How might it help?"
                      ></textarea>
                    </label>
                    <div className="form-row">
                      <label>
                        TEAM / ORGANIZATION
                        <input placeholder="Your team name" />
                      </label>
                      <label>
                        ATTACHMENT
                        <div className="file-upload">
                          <input
                            type="file"
                            onChange={(e) =>
                              (e.target.parentElement.dataset.filename =
                                e.target.files[0]?.name || "")
                            }
                          />
                          <UploadIcon />
                          <span>Choose a file</span>
                        </div>
                      </label>
                    </div>
                    <span className="prototype-submission-note">
                      <i /> Prototype submission · data stays in this session
                    </span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="button secondary"
                    onClick={() => setModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="button primary"
                    onClick={() => setSubmitted(true)}
                  >
                    <Send size={14} /> Submit idea
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
function UploadIcon() {
  return <Download size={14} />;
}

function NotificationsPage({ notifications, setNotifications }) {
  const [filter, setFilter] = useState("All");
  const unread = notifications.filter((n) => n.unread).length;
  const visible = notifications.filter(
    (n) => filter === "All" || (filter === "Unread" && n.unread),
  );
  return (
    <>
      <PageHead
        eyebrow="YOUR ACTIVITY"
        title="Notifications"
        desc="Stay up to date with research, projects and opportunities."
        action={
          <button
            className="button secondary small"
            disabled={!unread}
            onClick={() =>
              setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })))
            }
          >
            <Check size={15} /> Mark all as read
          </button>
        }
      >
        <div className="head-meta">
          <span className="notification-count">{unread} unread</span>
          <span>·</span>
          <span>{notifications.length} total updates</span>
        </div>
      </PageHead>
      <div className="notification-toolbar">
        <div className="analytics-tabs">
          {["All", "Unread"].map((t) => (
            <button
              className={filter === t ? "active" : ""}
              key={t}
              onClick={() => setFilter(t)}
            >
              {t}
              {t === "Unread" && <span className="filter-count">{unread}</span>}
            </button>
          ))}
        </div>
        <button className="more-button">
          Most recent <ChevronDown size={13} />
        </button>
      </div>
      <div className="notification-list panel">
        {visible.length ? (
          visible.map((n) => (
            <article
              className={"notification-row " + (n.unread ? "unread" : "")}
              key={n.id}
            >
              <span className={"notification-icon " + n.icon}>
                {n.icon === "file" ? (
                  <FileText size={17} />
                ) : n.icon === "activity" ? (
                  <Activity size={17} />
                ) : n.icon === "sparkles" ? (
                  <Sparkles size={17} />
                ) : (
                  <TrendingUp size={17} />
                )}
              </span>
              <div className="notification-copy">
                <div>
                  <h3>{n.title}</h3>
                  {n.unread && <i className="unread-dot" />}
                </div>
                <p>{n.detail}</p>
                <span>
                  <Clock3 size={12} />
                  {n.time}
                </span>
              </div>
              <button
                className="button secondary small"
                onClick={() =>
                  setNotifications((ns) =>
                    ns.map((x) =>
                      x.id === n.id ? { ...x, unread: false } : x,
                    ),
                  )
                }
              >
                {n.unread ? "Mark as read" : "Read"}
              </button>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <Check size={25} />
            <h3>You're all caught up</h3>
            <p>No unread notifications.</p>
          </div>
        )}
      </div>
      <div className="notification-settings">
        <div>
          <Bell size={15} />
          <span>
            <b>Notification preferences</b>
            <small>Manage which platform updates appear in your feed.</small>
          </span>
        </div>
        <button
          className="text-link"
          onClick={() =>
            alert("Notification preferences are a prototype setting.")
          }
        >
          Settings <ArrowRight size={13} />
        </button>
      </div>
    </>
  );
}

function Profile({ theme, setTheme }) {
  const [editing, setEditing] = useState(false),
    [saved, setSaved] = useState(false),
    [profile, setProfile] = useState({
      name: "Arjun Sharma",
      role: "Researcher",
      org: "Centre for Land Policy Studies",
      state: "Uttar Pradesh",
      interests: "Land records, policy evaluation, GIS",
    });
  return (
    <>
      <PageHead
        eyebrow="ACCOUNT & PREFERENCES"
        title="Researcher profile"
        desc="Your identity and workspace preferences."
        action={
          <button
            className="button secondary small"
            onClick={() => {
              setEditing((v) => !v);
              setSaved(false);
            }}
          >
            {editing ? "Cancel" : "Edit profile"}
          </button>
        }
      >
        <div className="head-meta">
          <DemoFlag />
          <span>Local demo profile</span>
        </div>
      </PageHead>
      <div className="profile-layout">
        <section className="panel profile-card">
          <div className="profile-cover">
            <div className="profile-cover-art">
              <Globe2 size={90} />
              <span />
            </div>
            <div className="profile-avatar">AS</div>
          </div>
          <div className="profile-main">
            <div className="profile-heading">
              <div>
                <h2>{profile.name}</h2>
                <span className="role-tag">{profile.role}</span>
              </div>
              <button
                className="button secondary small"
                onClick={() => setEditing((v) => !v)}
              >
                {editing ? "Cancel" : "Edit profile"}
              </button>
            </div>
            {saved && (
              <div className="profile-saved">
                <Check size={13} /> Profile changes saved locally.
              </div>
            )}
            {editing ? (
              <div className="profile-form">
                {[
                  ["name", "Full name"],
                  ["role", "Role"],
                  ["org", "Organization"],
                  ["state", "State"],
                  ["interests", "Research interests"],
                ].map(([k, l]) => (
                  <label key={k}>
                    {l.toUpperCase()}
                    <input
                      value={profile[k]}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, [k]: e.target.value }))
                      }
                    />
                  </label>
                ))}
                <button
                  className="button primary small"
                  onClick={() => {
                    setEditing(false);
                    setSaved(true);
                  }}
                >
                  <Check size={14} /> Save changes
                </button>
              </div>
            ) : (
              <>
                <p className="profile-bio">
                  Researching inclusive approaches to evidence-led land
                  governance and public policy.
                </p>
                <div className="profile-info-list">
                  <div>
                    <span>
                      <Users size={15} />
                    </span>
                    <small>ROLE</small>
                    <b>{profile.role}</b>
                  </div>
                  <div>
                    <span>
                      <Globe2 size={15} />
                    </span>
                    <small>ORGANIZATION</small>
                    <b>{profile.org}</b>
                  </div>
                  <div>
                    <span>
                      <MapPin size={15} />
                    </span>
                    <small>STATE</small>
                    <b>{profile.state}</b>
                  </div>
                  <div>
                    <span>
                      <BookOpen size={15} />
                    </span>
                    <small>RESEARCH INTERESTS</small>
                    <b>{profile.interests}</b>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        <aside className="profile-aside">
          <div className="panel settings-panel">
            <div className="panel-head">
              <div>
                <h2>Appearance</h2>
                <p>Choose your workspace theme.</p>
              </div>
              <span className="settings-icon">
                <Sun size={16} />
              </span>
            </div>
            <div className="theme-options">
              {[
                ["dark", "Dark mode", Moon],
                ["light", "Light mode", Sun],
              ].map(([v, l, I]) => (
                <button
                  className={theme === v ? "selected" : ""}
                  onClick={() => setTheme(v)}
                  key={v}
                >
                  <I size={16} />
                  <span>{l}</span>
                  {theme === v && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
          <div className="panel settings-panel">
            <div className="panel-head">
              <div>
                <h2>My activity</h2>
                <p>Your contribution at a glance.</p>
              </div>
              <span className="settings-icon">
                <Activity size={16} />
              </span>
            </div>
            <div className="profile-activity-stats">
              <div>
                <b>12</b>
                <small>Research saved</small>
              </div>
              <div>
                <b>3</b>
                <small>Projects joined</small>
              </div>
              <div>
                <b>8</b>
                <small>AI conversations</small>
              </div>
            </div>
            <button
              className="text-link"
              onClick={() => location.assign("/workspace")}
            >
              Go to workspace <ArrowRight size={13} />
            </button>
          </div>
          <div className="profile-prototype-note">
            <CircleHelp size={15} />
            <span>
              <b>Demonstration profile</b>
              <small>
                This local profile is for prototype purposes and is not
                connected to an identity provider.
              </small>
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}

export default App;
