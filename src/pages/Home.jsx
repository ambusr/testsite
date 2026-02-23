import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Video, Award, ChevronRight, CheckCircle2, Phone, Mail, GraduationCap } from 'lucide-react';

function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo-container">
            <img src="/Logo.png" alt="Edufy Logo" className="logo-image" />
            <span>Edufy</span>
          </Link>
          <div className="nav-links">
            <a href="#about" className="nav-link">About Classes</a>
            <a href="#specialities" className="nav-link">Specialities</a>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero-section" style={{ paddingTop: '140px', paddingBottom: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <div className="container">
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '4rem', alignItems: 'center' }}>
              <div className="hero-content animate-fade-in">
                <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary-color)', border: '1px solid var(--glass-border)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)', display: 'inline-block', boxShadow: '0 0 10px var(--primary-color)' }}></span>
                  LETS CRACK THE EXAMS TOGETHER
                </div>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-1px', lineHeight: '1.1' }}>
                  A Digital Platform For <span className="text-gradient">All Your Learning Needs</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '540px' }}>
                  We provide individual tuition and intensive revision classes for Class V-X (All Boards) and XI-XII (Science & Commerce).
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                    Join Now <ArrowRight size={20} />
                  </button>
                  <button className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                    Free Demo Class
                  </button>
                </div>

                <div className="stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '4rem', padding: '1.5rem', background: 'var(--glass-bg)', borderRadius: '1rem', border: '1px solid var(--glass-border)', backdropFilter: 'blur(16px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.75rem', color: 'var(--primary-color)' }}>
                      <Video size={24} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', color: 'white' }}>One-on-One</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Live Teaching</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '0.75rem', color: 'var(--secondary-color)' }}>
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', color: 'white' }}>Special CS</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>For +1 & +2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Hero Cards instead of Image */}
              <div className="hero-cards layout-stack animate-float" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glow-backdrop" style={{ position: 'absolute', top: '50%', left: '50%', width: '150%', height: '150%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 60%)', transform: 'translate(-50%, -50%)', zIndex: -1 }}></div>

                <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderRadius: '1.5rem', transform: 'rotate(-2deg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'white' }}>Intensive Revision</h3>
                    <Award color="var(--primary-color)" size={28} />
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={18} color="var(--primary-color)" /> Special Revision Classes
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={18} color="var(--primary-color)" /> X & XII Board Exams
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={18} color="var(--primary-color)" /> Previous Year Question Solving
                    </li>
                  </ul>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(30,41,59,0.8)', marginLeft: '2rem', transform: 'rotate(2deg)', border: '1px solid rgba(244,63,94,0.2)' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem' }}>Core Basic Courses</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Mathematics', 'English', 'Hindi', 'Malayalam'].map(subject => (
                      <span key={subject} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.875rem', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subjects Banner */}
        <div style={{ background: 'var(--primary-color)', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
              {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Social Science'].map(sub => (
                <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ opacity: 0.5 }}>•</span> {sub}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features / Specialities Section */}
        <section id="specialities" style={{ padding: '8rem 0', background: 'var(--bg-secondary)', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our <span className="text-gradient-secondary">Specialities</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                We provide a comprehensive suite of learning experiences designed to ensure academic excellence.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {[
                { icon: <Users size={24} />, title: "Personal Mentoring", desc: "Expert teachers providing individualized attention and guidance.", color: "var(--primary-color)" },
                { icon: <BookOpen size={24} />, title: "Chapter-wise Discussion", desc: "Thorough review of every chapter to build strong foundational knowledge.", color: "var(--secondary-color)" },
                { icon: <CheckCircle2 size={24} />, title: "Regular Tests", desc: "Frequent assessments followed by monthly feedback reports.", color: "#8b5cf6" },
                { icon: <BookOpen size={24} />, title: "Entire Syllabus Revision", desc: "Complete coverage of the syllabus before your final board exams.", color: "#10b981" },
                { icon: <Video size={24} />, title: "Live Doubt Clearing", desc: "Interactive sessions to resolve any confusion immediately.", color: "#f59e0b" },
                { icon: <CheckCircle2 size={24} />, title: "Daily Homework", desc: "Consistent practice through homework after each live session.", color: "#3b82f6" }
              ].map((feature, idx) => (
                <div key={idx} className="feature-item glass-panel" style={{ padding: '2rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}>
                  <div style={{ padding: '1rem', background: `rgba(255,255,255,0.05)`, borderRadius: '1rem', color: feature.color, width: 'fit-content', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section style={{ padding: '6rem 0', textAlign: 'center' }}>
          <div className="container">
            <div className="glass-panel" style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))', position: 'relative', overflow: 'hidden', border: '1px solid var(--primary-color)' }}>
              <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '140%', height: '200%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }}></div>
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Crack the Exams Together?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.125rem' }}>Get in touch with us for individual tuition or intensive revision classes.</p>

                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '50%' }}><Phone size={20} color="var(--primary-color)" /></div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontWeight: '600' }}>Call Us</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+91 7012989505 / 8547959081</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+91 8606835693 / 7994117120</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '50%' }}><Mail size={20} color="var(--secondary-color)" /></div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontWeight: '600' }}>Email Us</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>edufylearn@gmail.com</p>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', boxShadow: 'var(--shadow-glow)' }}>
                  Contact Us Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: 'black', padding: '3rem 0', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="logo-container">
            <img src="/Logo.png" alt="Edufy Logo" style={{ height: '30px' }} />
            <span style={{ fontSize: '1.25rem' }}>Edufy</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} Edufy Platform. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
