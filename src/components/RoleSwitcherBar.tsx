import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Globe, RotateCcw, Sparkles, LogIn, UserPlus, Copy, Check, Database, RefreshCw, AlertCircle, Key, ExternalLink } from 'lucide-react';
import { UserRole, NavigationTab } from '../types';
import { INITIAL_CHARITIES } from '../data/initialData';
import { supabase, isSupabaseConfigured, getSupabaseConfig, createLiveSupabaseClient, sanitizeSupabaseUrl, sanitizeAnonKey } from '../lib/supabaseClient';

interface RoleSwitcherBarProps {
  currentTab?: NavigationTab;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ currentTab, onNavigateTab }) => {
  const { role, setRole, resetToDefaultData, currentUser, allSubscribers, charities, showToast, isSupabaseConnected } = useApp();
  const [copied, setCopied] = React.useState(false);

  const [showTestModal, setShowTestModal] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    envDetected: boolean;
    urlPreview: string;
    canPingCharities: boolean | null;
    canPingProfiles: boolean | null;
    canPingScores: boolean | null;
    details: string;
  }>({
    envDetected: isSupabaseConfigured,
    urlPreview: import.meta.env.VITE_SUPABASE_URL || 'Not provided',
    canPingCharities: null,
    canPingProfiles: null,
    canPingScores: null,
    details: ''
  });

  const [customUrl, setCustomUrl] = useState(() => {
    return localStorage.getItem('supabase_custom_url') || import.meta.env.VITE_SUPABASE_URL || 'https://hsujhwellraoznlmrqvc.supabase.co';
  });
  const [customKey, setCustomKey] = useState(() => {
    return localStorage.getItem('supabase_custom_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  });

  const saveAndApplyKeys = () => {
    const cleanUrl = sanitizeSupabaseUrl(customUrl);
    const cleanKey = sanitizeAnonKey(customKey);
    setCustomUrl(cleanUrl);
    setCustomKey(cleanKey);
    if (cleanUrl) localStorage.setItem('supabase_custom_url', cleanUrl);
    if (cleanKey) localStorage.setItem('supabase_custom_key', cleanKey);
    showToast('Saved Supabase credentials! Re-testing...');
    runConnectionTest(cleanUrl, cleanKey);
  };

  const runConnectionTest = async (overrideUrl?: string, overrideKey?: string) => {
    setTesting(true);
    const rawUrl = overrideUrl || customUrl || import.meta.env.VITE_SUPABASE_URL || 'https://hsujhwellraoznlmrqvc.supabase.co';
    const rawKey = overrideKey || customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    const activeUrl = sanitizeSupabaseUrl(rawUrl);
    const activeKey = sanitizeAnonKey(rawKey);

    setTestResults({
      envDetected: Boolean(activeUrl && activeKey),
      urlPreview: activeUrl,
      canPingCharities: null,
      canPingProfiles: null,
      canPingScores: null,
      details: 'Pinging Supabase REST endpoints...'
    });

    if (!activeUrl || !activeKey) {
      setTesting(false);
      setTestResults(prev => ({
        ...prev,
        details: 'Missing Anon Key. Please paste your anon public key below and click "Save & Test".'
      }));
      return;
    }

    try {
      const client = createLiveSupabaseClient(activeUrl, activeKey);
      if (!client) {
        throw new Error('Could not initialize Supabase client with given credentials.');
      }

      // Test 1: Charities table
      const charitiesRes = await client.from('charities').select('id, name').limit(1);
      const pingCharities = !charitiesRes.error;

      // Test 2: Profiles table
      const profilesRes = await client.from('profiles').select('id').limit(1);
      const pingProfiles = !profilesRes.error;

      // Test 3: Golf scores table
      const scoresRes = await client.from('golf_scores').select('id').limit(1);
      const pingScores = !scoresRes.error;

      const errors: string[] = [];
      if (charitiesRes.error) errors.push(`charities: ${charitiesRes.error.message}`);
      if (profilesRes.error) errors.push(`profiles: ${profilesRes.error.message}`);
      if (scoresRes.error) errors.push(`golf_scores: ${scoresRes.error.message}`);

      setTestResults({
        envDetected: true,
        urlPreview: activeUrl,
        canPingCharities: pingCharities,
        canPingProfiles: pingProfiles,
        canPingScores: pingScores,
        details: errors.length === 0 
          ? '🎉 All 3 tables responded with HTTP 200 OK! Connection is healthy and active.' 
          : `Some tables returned errors: ${errors.join(' | ')}`
      });
    } catch (err: unknown) {
      setTestResults(prev => ({
        ...prev,
        details: `Connection request failed: ${err instanceof Error ? err.message : String(err)}`
      }));
    } finally {
      setTesting(false);
    }
  };

  const [seeding, setSeeding] = useState(false);

  const seedAllProfilesToSupabase = async () => {
    setSeeding(true);
    const rawUrl = customUrl || import.meta.env.VITE_SUPABASE_URL || 'https://hsujhwellraoznlmrqvc.supabase.co';
    const rawKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    const client = createLiveSupabaseClient(rawUrl, rawKey);

    if (!client) {
      setSeeding(false);
      showToast('Please provide your anon key first.');
      return;
    }

    try {
      showToast('Syncing charities, member profiles & scores to Supabase...');

      // Fallback to INITIAL_CHARITIES if context charities list is empty
      const listToSeed = (charities && charities.length > 0) ? charities : INITIAL_CHARITIES;
      
      const charityRows = listToSeed.map(c => ({
        id: c.id,
        name: c.name,
        tagline: c.tagline || '',
        description: c.description || '',
        category: c.category || 'General',
        logo_url: c.logoUrl || null,
        cover_image: c.coverImage || null,
        website_url: c.websiteUrl || null,
        total_raised: c.totalRaised || 0,
        is_featured: Boolean(c.isFeatured)
      }));

      // Upsert charities and strictly verify
      const { error: charityErr } = await client.from('charities').upsert(charityRows, { onConflict: 'id' });
      if (charityErr) {
        console.error('Charities upsert failed:', charityErr);
        throw new Error(`Charities table rejected write: ${charityErr.message}. Make sure RLS is disabled on charities table.`);
      }

      // Check which charity IDs currently exist in the Supabase charities table
      const { data: existingCharityData, error: charityFetchErr } = await client.from('charities').select('id');
      if (charityFetchErr) {
        console.warn('Could not query charities table:', charityFetchErr.message);
      }
      const existingCharityIdSet = new Set((existingCharityData || []).map(r => r.id));

      // 1. Prepare profile rows - ensure charity_id is valid in Supabase charities table or set to null
      const profileRows = allSubscribers.map(u => {
        const validCharityId = (u.charityId && (existingCharityIdSet.size === 0 || existingCharityIdSet.has(u.charityId)))
          ? u.charityId
          : null;

        return {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          avatar_url: u.avatarUrl,
          home_club: u.homeClub,
          handicap: u.handicap,
          subscription_status: u.subscription.status,
          subscription_plan: u.subscription.plan,
          subscription_amount: u.subscription.amount,
          renewal_date: u.subscription.renewalDate,
          charity_id: validCharityId,
          charity_percentage: u.charityPercentage,
          total_donated: u.totalDonated,
          draws_entered_count: u.drawsEnteredCount
        };
      });

      // Upsert profiles
      const { error: profileErr } = await client.from('profiles').upsert(profileRows, { onConflict: 'id' });
      if (profileErr) {
        throw new Error(`Profile sync failed: ${profileErr.message}`);
      }

      // 2. Prepare score rows for all members
      const scoreRows = allSubscribers.flatMap(u => 
        (u.scores || []).map(s => ({
          id: s.id,
          user_id: u.id,
          points: s.points,
          score_date: s.date,
          course_name: s.courseName || u.homeClub || 'Home Club',
          notes: s.notes || 'Official scorecard entry'
        }))
      );

      if (scoreRows.length > 0) {
        const { error: scoreErr } = await client.from('golf_scores').upsert(scoreRows, { onConflict: 'id' });
        if (scoreErr) {
          console.warn('Score upsert note:', scoreErr.message);
        }
      }

      showToast(`🎉 Success! Synced ${profileRows.length} profiles & ${scoreRows.length} scores directly to Supabase.`);
      // Re-run test to show updated status
      runConnectionTest();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('row-level security') || msg.includes('violates row-level security')) {
        setTestResults(prev => ({
          ...prev,
          details: '⚠️ Supabase RLS (Row Level Security) blocked the insert. Run the 1-line SQL snippet shown below in your Supabase SQL editor to allow inserts.'
        }));
        showToast('Sync blocked by RLS: Run the policy SQL in Supabase SQL Editor (see modal).');
      } else {
        setTestResults(prev => ({ ...prev, details: `Sync failed: ${msg}` }));
        showToast(`Sync failed: ${msg}`);
      }
    } finally {
      setSeeding(false);
    }
  };

  const handleCopyAssignmentUrl = () => {
    const url = `${window.location.origin}/#abhaybhuj.assignment.golfncharity`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    showToast('Copied live submission URL');
    setTimeout(() => setCopied(false), 2000);
  };

  const roles: { id: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; badge: string }[] = [
    { id: 'visitor', label: 'Public Visitor', icon: Globe, badge: 'Role 01' },
    { id: 'subscriber', label: 'Subscriber Portal', icon: User, badge: 'Role 02 (Alex Vance)' },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck, badge: 'Role 03' }
  ];

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md text-xs py-2 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Evaluation Sandbox
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="text-slate-500">ID:</span>
            <span className="text-emerald-400 font-semibold">abhaybhuj.assignment.golfncharity</span>
          </div>
          <button
            onClick={() => {
              setShowTestModal(true);
              runConnectionTest();
            }}
            className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-slate-700 cursor-pointer transition-colors"
            title="Click to test live Supabase connection"
          >
         /*   <Database className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-500">Backend:</span>
            <span className={isSupabaseConnected ? "text-emerald-400 font-semibold flex items-center gap-1" : "text-amber-400 font-semibold flex items-center gap-1"}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              {isSupabaseConnected ? 'Supabase Live (Test)' : 'Supabase (Test Connection)'}
            </span>
          </button>*/
          <button
            onClick={handleCopyAssignmentUrl}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 px-2 py-0.5 rounded hover:bg-slate-900 border border-slate-800/80 cursor-pointer transition-colors"
            title="Copy abhaybhuj.assignment.golfncharity submission URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline font-mono">{copied ? 'Copied URL' : 'Copy URL'}</span>
          </button>
        </div>

        {/* Role Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-500 font-medium px-2 py-0.5 text-[11px]">View Mode:</span>
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  if (onNavigateTab) {
                    if (r.id === 'admin') onNavigateTab('admin');
                    else if (r.id === 'subscriber') onNavigateTab('dashboard');
                    else onNavigateTab('home');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Switch view to ${r.label}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Auth Page shortcuts for Evaluator */}
        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <div className="flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-800/80">
              <button
                onClick={() => onNavigateTab('login')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  currentTab === 'login'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Open dedicated Login Page (§03)"
              >
                <LogIn className="w-3 h-3 text-emerald-400" />
                <span>Login Page</span>
              </button>

              <button
                onClick={() => onNavigateTab('signup')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  currentTab === 'signup'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Open dedicated Signup / Registration Page (§03)"
              >
                <UserPlus className="w-3 h-3 text-emerald-400" />
                <span>Sign Up Page</span>
              </button>
            </div>
          )}

          <button
            onClick={resetToDefaultData}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors px-2 py-1 rounded hover:bg-slate-900 cursor-pointer text-[11px]"
            title="Reset to fresh PRD baseline test data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Baseline Data</span>
          </button>
        </div>
      </div>

      {/* Supabase Connection Test Diagnostics Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Supabase Connection Diagnostics</h3>
                  <p className="text-xs text-slate-400 font-mono">Live PostgreSQL ping check</p>
                </div>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                <div className="text-slate-400 text-[11px]">PROJECT URL:</div>
                <div className="text-cyan-400 break-all font-semibold mt-0.5">{testResults.urlPreview}</div>
              </div>

              <div className="space-y-2">
                <div className="text-slate-300 font-semibold text-xs">Table Ping Tests:</div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="font-mono text-slate-300">1. charities (Directory)</span>
                  {testResults.canPingCharities === null ? (
                    <span className="text-slate-500 font-mono">Awaiting ping...</span>
                  ) : testResults.canPingCharities ? (
                    <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 200 OK
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> FAILED
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="font-mono text-slate-300">2. profiles (Golfers)</span>
                  {testResults.canPingProfiles === null ? (
                    <span className="text-slate-500 font-mono">Awaiting ping...</span>
                  ) : testResults.canPingProfiles ? (
                    <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 200 OK
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> FAILED
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="font-mono text-slate-300">3. golf_scores (Scorecards)</span>
                  {testResults.canPingScores === null ? (
                    <span className="text-slate-500 font-mono">Awaiting ping...</span>
                  ) : testResults.canPingScores ? (
                    <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 200 OK
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> FAILED
                    </span>
                  )}
                </div>
              </div>

              {/* Direct Key Configurator if environment variable isn't baked in */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    Supabase Credentials Config:
                  </span>
                  <a
                    href="https://supabase.com/dashboard/project/hsujhwellraoznlmrqvc/settings/api"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Open Supabase Keys <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Project URL:</label>
                  <input
                    type="text"
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    placeholder="https://your-id.supabase.co"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Anon Public Key (starts with eyJhb...):</label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={e => setCustomKey(e.target.value)}
                    placeholder="Paste anon public key here..."
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={saveAndApplyKeys}
                  className="w-full mt-1 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Save & Test Live Connection
                </button>
              </div>

              <div className={`p-3 rounded-lg border text-[11px] ${
                testResults.canPingCharities && testResults.canPingProfiles && testResults.canPingScores
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : testResults.details.includes('Missing Anon Key') || testResults.details.includes('No VITE_SUPABASE_URL')
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <div className="font-semibold mb-0.5">Status Summary:</div>
                <div className="break-words">{testResults.details || 'Click "Re-run Test" to ping all endpoints.'}</div>
              </div>

              {/* RLS Quick Fix instructions */}
              <div className="bg-slate-950 p-3 rounded-lg border border-amber-500/30 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Supabase Row Level Security (RLS) Fix:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const sql = `-- Allow public app inserts & reads during evaluation\nALTER TABLE profiles DISABLE ROW LEVEL SECURITY;\nALTER TABLE golf_scores DISABLE ROW LEVEL SECURITY;\nALTER TABLE charities DISABLE ROW LEVEL SECURITY;`;
                      if (navigator.clipboard) navigator.clipboard.writeText(sql);
                      showToast('Copied RLS SQL Fix! Paste into Supabase SQL Editor and click Run.');
                    }}
                    className="text-[10px] px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded cursor-pointer"
                  >
                    Copy SQL Fix
                  </button>
                </div>
                <p className="text-slate-400 text-[10px]">
                  By default, Supabase enables RLS and blocks anon inserts until a policy is added or RLS is turned off for the table. Run this in your <strong className="text-slate-200">Supabase SQL Editor</strong>:
                </p>
                <pre className="bg-slate-900 border border-slate-800 rounded p-2 text-emerald-400 font-mono text-[10px] select-all overflow-x-auto">
{`ALTER TABLE charities DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE golf_scores DISABLE ROW LEVEL SECURITY;`}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => runConnectionTest()}
                  disabled={testing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs cursor-pointer transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  {testing ? 'Testing...' : 'Ping Tables'}
                </button>
                <button
                  type="button"
                  onClick={seedAllProfilesToSupabase}
                  disabled={seeding || testing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors disabled:opacity-50"
                  title="Upload all profiles and scores to Supabase"
                >
                  <Database className={`w-3.5 h-3.5 ${seeding ? 'animate-bounce' : ''}`} />
                  {seeding ? 'Syncing...' : 'Sync Data to Supabase'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

