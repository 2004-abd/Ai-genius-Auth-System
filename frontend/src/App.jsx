import React, { useMemo, useState } from "react";
import {
  BrainCircuit,
  Crown,
  KeyRound,
  Lock,
  LogOut,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRoundCheck,
  Zap
} from "lucide-react";
import { apiRequest, API_URL } from "./api/client";

const demoUsers = [
  {
    label: "Admin",
    email: "admin@aigenius.com",
    password: "admin123",
    role: "Admin",
    description: "Can access all APIs including cache purge."
  },
  {
    label: "Premium User",
    email: "premium@aigenius.com",
    password: "premium123",
    role: "Premium_User",
    description: "Can access free and premium AI models."
  },
  {
    label: "Free User",
    email: "free@aigenius.com",
    password: "free123",
    role: "Free_User",
    description: "Can access only the free AI model."
  }
];

const roleColors = {
  Admin: "danger",
  Premium_User: "premium",
  Free_User: "free"
};

function getSavedUser() {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
}

function App() {
  const [form, setForm] = useState({
    email: "admin@aigenius.com",
    password: "admin123"
  });

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );

  const [user, setUser] = useState(getSavedUser);

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "info",
    title: "Ready",
    message: "Login with any demo account and test RBAC protected AI endpoints."
  });

  const [apiOutput, setApiOutput] = useState(null);

  const tokenPreview = useMemo(() => {
    if (!accessToken) return "No access token yet";
    return `${accessToken.slice(0, 24)}...${accessToken.slice(-18)}`;
  }, [accessToken]);

  const saveSession = (data) => {
    setAccessToken(data.accessToken);

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    localStorage.setItem("accessToken", data.accessToken);
  };

  const login = async (event) => {
    event.preventDefault();
    setLoading(true);
    setApiOutput(null);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });

      saveSession(data);

      setStatus({
        type: "success",
        title: "Login successful",
        message: `${data.user.email} logged in as ${data.user.role}. Refresh token is stored in httpOnly cookie.`
      });

      setApiOutput(data);
    } catch (error) {
      setStatus({
        type: "error",
        title: "Login failed",
        message: error.message
      });

      setApiOutput(error.data || { message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/auth/refresh", {
        method: "POST"
      });

      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);

      setStatus({
        type: "success",
        title: "Token refreshed",
        message: "A new access token was generated using the refresh token cookie."
      });

      setApiOutput(data);
    } catch (error) {
      setStatus({
        type: "error",
        title: "Refresh failed",
        message: error.message
      });

      setApiOutput(error.data || { message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/auth/logout", {
        method: "POST"
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setAccessToken("");
      setUser(null);
      setApiOutput(data);

      setStatus({
        type: "success",
        title: "Logged out",
        message: "Refresh token removed from whitelist and cookie cleared."
      });
    } catch (error) {
      setStatus({
        type: "error",
        title: "Logout failed",
        message: error.message
      });

      setApiOutput(error.data || { message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const callProtectedApi = async (path, method = "GET", body = null) => {
    setLoading(true);

    try {
      const data = await apiRequest(
        path,
        {
          method,
          body: body ? JSON.stringify(body) : undefined
        },
        accessToken
      );

      setApiOutput(data);

      setStatus({
        type: "success",
        title: "API allowed",
        message: data.message || "Protected API request completed successfully."
      });
    } catch (error) {
      setApiOutput(error.data || { message: error.message });

      setStatus({
        type: error.status === 403 ? "warning" : "error",
        title: error.status === 403 ? "Access denied by RBAC" : "Request failed",
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const chooseDemoUser = (demoUser) => {
    setForm({
      email: demoUser.email,
      password: demoUser.password
    });

    setStatus({
      type: "info",
      title: `${demoUser.label} selected`,
      message: demoUser.description
    });
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-left">
          <div className="brand-mark">
            <BrainCircuit size={30} />
          </div>

          <div>
            <p className="eyebrow">MA 216 Web Engineering and AI</p>
            <h1>AI-Genius Secure Auth Console</h1>
            <p className="hero-copy">
              JWT access tokens, httpOnly refresh cookies, and RBAC-protected
              premium AI APIs in one clean dashboard.
            </p>
          </div>
        </div>

        <div className="hero-stats">
          <div>
            <strong>3</strong>
            <span>Roles</span>
          </div>

          <div>
            <strong>4</strong>
            <span>Auth APIs</span>
          </div>

          <div>
            <strong>3</strong>
            <span>AI APIs</span>
          </div>
        </div>
      </section>

      <section className="layout-grid">
        <aside className="panel login-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Step 1</p>
              <h2>Login</h2>
            </div>

            <KeyRound className="muted-icon" />
          </div>

          <div className="demo-list">
            {demoUsers.map((demoUser) => (
              <button
                key={demoUser.email}
                type="button"
                className={`demo-user ${
                  form.email === demoUser.email ? "active" : ""
                }`}
                onClick={() => chooseDemoUser(demoUser)}
              >
                <span className={`role-dot ${roleColors[demoUser.role]}`} />

                <span>
                  <strong>{demoUser.label}</strong>
                  <small>{demoUser.email}</small>
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={login} className="login-form">
            <label>
              Email
              <input
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value
                  })
                }
                placeholder="admin@aigenius.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({
                    ...form,
                    password: event.target.value
                  })
                }
                placeholder="admin123"
              />
            </label>

            <button className="primary-btn" disabled={loading}>
              <Lock size={18} />
              {loading ? "Processing..." : "Login and Generate Tokens"}
            </button>
          </form>
        </aside>

        <section className="panel dashboard-panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Step 2</p>
              <h2>Security Session</h2>
            </div>

            <ShieldCheck className="muted-icon" />
          </div>

          <div className={`status-box ${status.type}`}>
            <strong>{status.title}</strong>
            <p>{status.message}</p>
          </div>

          <div className="session-card">
            <div>
              <span className="label">Logged-in user</span>
              <strong>{user ? user.email : "Not logged in"}</strong>
            </div>

            <div>
              <span className="label">Role</span>
              <strong
                className={
                  user ? `role-pill ${roleColors[user.role]}` : "role-pill"
                }
              >
                {user ? user.role : "None"}
              </strong>
            </div>

            <div className="token-line">
              <span className="label">Access token preview</span>
              <code>{tokenPreview}</code>
            </div>
          </div>

          <div className="action-grid">
            <button
              onClick={() => callProtectedApi("/ai/free-model")}
              disabled={!accessToken || loading}
            >
              <Sparkles size={18} />
              Free Model
            </button>

            <button
              onClick={() =>
                callProtectedApi("/ai/premium-model", "POST", {
                  prompt: "Create a premium AI product launch caption."
                })
              }
              disabled={!accessToken || loading}
            >
              <Crown size={18} />
              Premium Model
            </button>

            <button
              onClick={() => callProtectedApi("/ai/purge-cache", "DELETE")}
              disabled={!accessToken || loading}
            >
              <Trash2 size={18} />
              Admin Purge Cache
            </button>
          </div>

          <div className="secondary-actions">
            <button onClick={refreshToken} disabled={loading}>
              <RefreshCcw size={17} />
              Refresh Access Token
            </button>

            <button onClick={logout} disabled={loading || !user}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </section>
      </section>

      <section className="bottom-grid">
        <div className="panel mini-panel">
          <Zap className="mini-icon" />
          <h3>Access Token</h3>
          <p>
            Short-lived token returned in JSON response and sent in
            Authorization Bearer header.
          </p>
        </div>

        <div className="panel mini-panel">
          <UserRoundCheck className="mini-icon" />
          <h3>Refresh Token</h3>
          <p>
            Long-lived token stored in secure httpOnly cookie and checked
            against whitelist.
          </p>
        </div>

        <div className="panel mini-panel">
          <ShieldCheck className="mini-icon" />
          <h3>RBAC</h3>
          <p>
            Free, Premium, and Admin endpoints are protected by role-based
            middleware.
          </p>
        </div>
      </section>

      <section className="panel response-panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">API Response</p>
            <h2>Live Output</h2>
          </div>

          <span className="api-url">{API_URL}</span>
        </div>

        <pre>
          {JSON.stringify(
            apiOutput || {
              message: "No API response yet."
            },
            null,
            2
          )}
        </pre>
      </section>
    </main>
  );
}

export default App;