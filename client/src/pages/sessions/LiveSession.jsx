import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

export default function LiveSession() {
     const { sessionId } = useParams();
     const { user } = useAuth();
     const { socket } = useSocket();
     const [session, setSession] = useState(null);
     const [polls, setPolls] = useState([]);
     const [questions, setQuestions] = useState([]);
     const [newQuestion, setNewQuestion] = useState('');
     const [activeTab, setActiveTab] = useState('qa'); // 'qa' or 'polls'

     useEffect(() => {
          // Fetch session details, polls, and questions
          const fetchData = async () => {
               try {
                    const [sessionRes, pollsRes, questionsRes] = await Promise.all([
                         axios.get(`/api/sessions/${sessionId}`), // Assuming this endpoint exists or similar
                         axios.get(`/api/polls/session/${sessionId}`),
                         axios.get(`/api/polls/questions/session/${sessionId}`),
                    ]);
                    setSession(sessionRes.data.session);
                    setPolls(pollsRes.data.polls);
                    setQuestions(questionsRes.data.questions);
               } catch (err) {
                    console.error(err);
               }
          };
          fetchData();

          if (socket) {
               socket.emit('join:session', sessionId);

               socket.on('poll:created', (poll) => setPolls(prev => [poll, ...prev]));
               socket.on('poll:updated', (updatedPoll) => setPolls(prev => prev.map(p => p._id === updatedPoll._id ? updatedPoll : p)));
               socket.on('question:added', (q) => setQuestions(prev => [q, ...prev]));
               socket.on('question:updated', (updatedQ) => setQuestions(prev => prev.map(q => q._id === updatedQ._id ? updatedQ : q)));

               return () => {
                    socket.off('poll:created');
                    socket.off('poll:updated');
                    socket.off('question:added');
                    socket.off('question:updated');
               };
          }
     }, [sessionId, socket]);

     const handleVote = async (pollId, optionIndex) => {
          try {
               await axios.post(`/api/polls/${pollId}/vote`, { optionIndex });
               // Socket will update the UI
          } catch (err) { console.error(err); }
     };

     const handleAsk = async (e) => {
          e.preventDefault();
          if (!newQuestion.trim()) return;
          try {
               await axios.post('/api/polls/questions', { session: sessionId, text: newQuestion });
               setNewQuestion('');
          } catch (err) { console.error(err); }
     };

     const handleUpvote = async (qId) => {
          try {
               await axios.post(`/api/polls/questions/${qId}/upvote`);
          } catch (err) { console.error(err); }
     };

     if (!session) return (
          <div className="p-8 space-y-6">
               <div className="skeleton h-32 rounded-2xl w-full" />
               <div className="flex gap-4">
                    <div className="skeleton h-12 flex-1 rounded-xl" />
                    <div className="skeleton h-12 flex-1 rounded-xl" />
               </div>
               <div className="skeleton h-96 rounded-2xl w-full" />
          </div>
     );

     return (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
               <div className="gradient-border-card p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                         <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                              Live Now
                         </span>
                    </div>
                    <div className="relative z-10">
                         <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{session.title}</h1>
                         <div className="flex items-center gap-3 text-[var(--text-muted)]">
                              <span className="flex items-center gap-1.5">
                                   <div className="w-6 h-6 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-xs">🎤</div>
                                   {session.speakerName}
                              </span>
                              <span>•</span>
                              <span>{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                    </div>
                    <div className="orb orb-primary w-[300px] h-[300px] top-[-50%] right-[-10%] opacity-[0.1]" />
               </div>

               <div className="flex p-1 bg-[var(--bg-elevated)] rounded-xl">
                    <button
                         onClick={() => setActiveTab('qa')}
                         className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'qa' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                         Q&A ({questions.length})
                    </button>
                    <button
                         onClick={() => setActiveTab('polls')}
                         className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'polls' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                         Live Polls
                    </button>
               </div>

               <div className="min-h-[400px]">
                    {activeTab === 'qa' && (
                         <div className="space-y-6 animate-slide-up">
                              <form onSubmit={handleAsk} className="relative group">
                                   <input
                                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl py-4 pl-5 pr-24 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                                        placeholder="Ask a question..."
                                        value={newQuestion}
                                        onChange={e => setNewQuestion(e.target.value)}
                                   />
                                   <button
                                        type="submit"
                                        disabled={!newQuestion.trim()}
                                        className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-[var(--color-primary)] text-white font-medium text-sm disabled:opacity-50 disabled:bg-[var(--bg-elevated)] disabled:text-[var(--text-muted)] transition-all"
                                   >
                                        Ask
                                   </button>
                              </form>

                              <div className="space-y-4">
                                   {questions.map((q, idx) => (
                                        <div key={q._id} className="glass-card p-5 flex gap-5 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                             <div className="flex flex-col items-center gap-1">
                                                  <button
                                                       onClick={() => handleUpvote(q._id)}
                                                       className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors group"
                                                  >
                                                       <svg className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                       </svg>
                                                  </button>
                                                  <span className="font-bold text-lg text-[var(--text-primary)]">{q.upvotes?.length || 0}</span>
                                             </div>
                                             <div className="flex-1">
                                                  <p className="text-lg text-[var(--text-primary)] leading-relaxed">{q.text}</p>
                                                  <div className="flex items-center gap-3 mt-3 text-xs text-[var(--text-muted)]">
                                                       <div className="flex items-center gap-1.5">
                                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] flex items-center justify-center text-white font-bold text-[9px]">
                                                                 {(q.user?.name || 'A').charAt(0)}
                                                            </div>
                                                            <span className="font-medium text-[var(--text-secondary)]">{q.user?.name || 'Anonymous'}</span>
                                                       </div>
                                                       <span>•</span>
                                                       <span>{new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                                   {questions.length === 0 && (
                                        <div className="text-center py-12 text-[var(--text-muted)]">
                                             <p className="text-4xl mb-3 opacity-50">💬</p>
                                             <p>No questions yet. Be the first to ask!</p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    )}

                    {activeTab === 'polls' && (
                         <div className="space-y-6 animate-slide-up">
                              {polls.map((poll, idx) => {
                                   const totalVotes = poll.votes?.reduce((acc, v) => acc + (v.count || 0), 0) || 0;
                                   const hasVoted = poll.voters?.includes(user?._id);

                                   return (
                                        <div key={poll._id} className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                             <div className="flex items-center justify-between mb-6">
                                                  <h3 className="font-bold text-xl text-[var(--text-primary)]">{poll.question}</h3>
                                                  {hasVoted && (
                                                       <span className="text-xs font-bold text-[var(--color-success)] bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                                                            Voted
                                                       </span>
                                                  )}
                                             </div>

                                             <div className="space-y-3">
                                                  {poll.options.map((opt, i) => {
                                                       const percentage = totalVotes ? Math.round(((opt.count || 0) / totalVotes) * 100) : 0;
                                                       return (
                                                            <button
                                                                 key={i}
                                                                 onClick={() => !hasVoted && handleVote(poll._id, i)}
                                                                 disabled={hasVoted}
                                                                 className={`relative w-full text-left p-4 rounded-xl overflow-hidden transition-all group ${hasVoted ? 'cursor-default' : 'hover:bg-[var(--bg-elevated)]'
                                                                      }`}
                                                            >
                                                                 {/* Progress Bar Background */}
                                                                 <div
                                                                      className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 opacity-0 transition-opacity duration-300"
                                                                      style={{ width: `${percentage}%`, opacity: 1 }}
                                                                 />

                                                                 <div className="relative flex justify-between items-center z-10">
                                                                      <span className="font-medium text-[var(--text-primary)]">{opt.text}</span>
                                                                      {hasVoted && (
                                                                           <span className="font-bold text-[var(--color-primary-light)] animate-scale-in">{percentage}%</span>
                                                                      )}
                                                                 </div>
                                                            </button>
                                                       );
                                                  })}
                                             </div>
                                             <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)] border-t border-[var(--border-color)] pt-4">
                                                  <span>{totalVotes} total votes</span>
                                                  {hasVoted && <span>Thanks for voting!</span>}
                                             </div>
                                        </div>
                                   );
                              })}
                              {polls.length === 0 && (
                                   <div className="text-center py-12 text-[var(--text-muted)]">
                                        <p className="text-4xl mb-3 opacity-50">📊</p>
                                        <p>No active polls at the moment.</p>
                                   </div>
                              )}
                         </div>
                    )}
               </div>
          </div>
     );
}
