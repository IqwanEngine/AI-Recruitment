//==IqwanEngine: JD Matcher Module
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface MatchResult {
  score: number;
  justification: string;
}

export const JDMatcher: React.FC<{ userName: string; onResult: (text: string) => void }> = ({ userName, onResult }) => {
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleMatch = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/match-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recruiterName: userName, jdContent: jd }),
      });
      const data = await response.json();
      setResult(data);
      onResult(`Match complete! Score: ${data.score}%. ${data.justification}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3 mb-2">
        <Briefcase className="text-cyber-blue" size={20} />
        <h3 className="font-orbitron text-sm tracking-widest text-white/80 uppercase">AI Smart-Match Protocol</h3>
      </div>

      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="PASTE_JOB_DESCRIPTION_HERE..."
        className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-white/80 placeholder:text-white/10 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 outline-none transition-all resize-none font-mono"
      />

      <button
        onClick={handleMatch}
        disabled={loading || !jd.trim()}
        className={`w-full py-4 rounded-xl font-orbitron font-bold text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
          loading 
            ? 'bg-white/5 text-white/20 cursor-wait' 
            : 'bg-cyber-blue text-black hover:shadow-[0_0_20px_rgba(0,241,254,0.4)]'
        }`}
      >
        {loading ? <Zap size={16} className="animate-spin" /> : <Zap size={16} />}
        {loading ? 'ANALYZING_DATA_SHARDS...' : 'CALCULATE_MATCH_SCORE'}
      </button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl border-cyber-blue/30 bg-cyber-blue/5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-orbitron text-cyber-blue/60 uppercase">Compatibility_Score</span>
            <span className={`text-2xl font-black font-orbitron ${result.score > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
              {result.score}%
            </span>
          </div>
          <div className="flex gap-4">
            <div className="mt-1">
              {result.score > 70 ? <CheckCircle2 className="text-green-400" size={16} /> : <AlertCircle className="text-yellow-400" size={16} />}
            </div>
            <p className="text-xs leading-relaxed text-white/70 italic">
              {result.justification}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
