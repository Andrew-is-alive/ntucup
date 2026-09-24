(function () {
    "use strict";

    const config = window.NTUCUP_CONFIG || {};
    const UPDATED_KEY = "ntucup:public-updated-at";
    const CORE_KEYS = new Set([
        "matches", "teams", "newbieTeams", "teamData", "brackets",
        "officialStats", "gameIDCounter", "customTeams", "customMatches",
        "customTournaments", "customGameIDCounter", "gamesStarted",
        "newbieStarted", "payPerMatch", "initialized"
    ]);

    function isTournamentKey(key) {
        return CORE_KEYS.has(key) || key.endsWith("FirstClick");
    }

    function showStatus(message, state = "idle") {
        let status = document.getElementById("public-data-status");
        if (!status) {
            status = document.createElement("p");
            status.id = "public-data-status";
            status.setAttribute("role", "status");
            status.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:2000;margin:0;padding:8px 12px;border-radius:999px;background:#172033;color:white;font:14px Arial,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.22)";
            document.body.appendChild(status);
        }
        status.textContent = message;
        status.dataset.state = state;
    }

    function showLastUpdated(value, cached = false) {
        const lastUpdated = document.getElementById("last-updated");
        if (!lastUpdated) return;
        if (!value) {
            lastUpdated.textContent = "No published results yet";
            return;
        }
        const formatted = new Date(value).toLocaleString();
        lastUpdated.textContent = cached ? `${formatted} (cached)` : formatted;
    }

    function replaceCachedSnapshot(payload) {
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
            throw new Error("The published tournament data is invalid.");
        }

        const oldKeys = [];
        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (key && isTournamentKey(key)) oldKeys.push(key);
        }
        oldKeys.forEach(key => localStorage.removeItem(key));

        for (const [key, value] of Object.entries(payload)) {
            if (!isTournamentKey(key)) continue;
            localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
        }
    }

    window.ntucupPublicDataReady = (async function () {
        try {
            if (!config.supabaseUrl || !config.supabasePublishableKey || !window.supabase?.createClient) {
                throw new Error("Live results are not configured.");
            }

            const client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
                auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
            });
            const { data, error } = await client
                .from("tournament_snapshots")
                .select("payload, updated_at")
                .eq("slug", config.tournamentSlug || "ntu-cup")
                .eq("is_published", true)
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error("No tournament results have been published yet.");

            const previousUpdatedAt = localStorage.getItem(UPDATED_KEY);
            if (previousUpdatedAt !== data.updated_at) {
                replaceCachedSnapshot(data.payload);
                localStorage.setItem(UPDATED_KEY, data.updated_at);
                window.location.reload();
                return new Promise(() => {});
            }

            const formatted = new Date(data.updated_at).toLocaleString();
            showLastUpdated(data.updated_at);
            showStatus(`Updated ${formatted}`, "success");
            window.dispatchEvent(new CustomEvent("ntucup:data-ready", { detail: data }));
            return data;
        } catch (error) {
            console.error("Unable to load live NTU Cup results:", error);
            showLastUpdated(localStorage.getItem(UPDATED_KEY), true);
            showStatus(`${error.message} Showing the last saved copy.`, "error");
            return null;
        } finally {
            document.documentElement.classList.remove("public-data-pending");
        }
    })();
})();
