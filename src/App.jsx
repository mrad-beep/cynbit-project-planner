import { useEffect, useState } from 'react';
import { Button, Card, Col, ConfigProvider, Row, Tag, Typography } from 'antd';
import { CloudOutlined, CodeOutlined, HomeOutlined, RiseOutlined, RobotOutlined, ReadOutlined, StarOutlined } from '@ant-design/icons';
import ProjectScoper from './ProjectScoper.jsx';
import LeadsAdmin from './LeadsAdmin.jsx';

const SERVICES = [
  { icon: <CodeOutlined />, title: 'Software development', text: 'Web and mobile apps, built end to end from design to deployment.' },
  { icon: <RobotOutlined />, title: 'AI automation', text: 'Custom LLM tools and agents that take over repetitive work.' },
  { icon: <RiseOutlined />, title: 'Digital marketing and SEO', text: 'Technical SEO and campaigns tied to measurable leads.' },
  { icon: <CloudOutlined />, title: 'Cloud infrastructure', text: 'Secure, scalable deployments on AWS and Azure.' },
];

const PRODUCTS = [
  { icon: <ReadOutlined />, name: 'Cynbit Studio', tag: 'Edtech', text: 'Adaptive coding paths, AI code review, mock interviews and resumes for job-ready developers.' },
  { icon: <HomeOutlined />, name: 'TenantEase', tag: 'SaaS', text: 'Track units, tenants and rent in one dashboard, with automatic payment reminders.' },
  { icon: <StarOutlined />, name: 'Revio', tag: 'Reputation AI', text: 'Sync reviews across platforms and reply with AI, one dashboard for every location.' },
];

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const isAdmin = hash === '#/admin';

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0f766e', borderRadius: 8, fontFamily: "'DM Sans', system-ui, sans-serif" } }}>
      <header className="nav">
        <div className="wrap">
          <a className="logo" href="#/">cyn<span>bit</span></a>
          <nav className="links">
            <a className="hide-sm" href="#services">Services</a>
            <a className="hide-sm" href="#products">Products</a>
            <a className="hide-sm" href="#/admin">Leads</a>
            <Button type="primary" href="#planner">Plan your project</Button>
          </nav>
        </div>
      </header>

      {isAdmin ? (
        <LeadsAdmin />
      ) : (
        <main>
          <div className="hero">
            <div className="wrap">
              <h1>Software and AI automation, built in Jaipur.</h1>
              <p>We design, build and run the systems that let growing businesses spend less time on busywork. Not sure what you need? Tell us the problem and get a plan in two minutes.</p>
              <Button type="primary" size="large" href="#planner">Plan your project</Button>
            </div>
          </div>

          <section id="services">
            <div className="wrap">
              <h2 className="sec-title">What we build</h2>
              <p className="sec-sub">Four services, one team from first sketch to launch.</p>
              <Row gutter={[16, 16]}>
                {SERVICES.map((s) => (
                  <Col xs={24} sm={12} lg={6} key={s.title}>
                    <Card style={{ height: '100%' }}>
                      <div className="card-icon">{s.icon}</div>
                      <Typography.Title level={5}>{s.title}</Typography.Title>
                      <Typography.Paragraph type="secondary">{s.text}</Typography.Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          <section id="products" className="alt">
            <div className="wrap">
              <h2 className="sec-title">Ready-made products</h2>
              <p className="sec-sub">Prefer software you can start using now? Start here.</p>
              <Row gutter={[16, 16]}>
                {PRODUCTS.map((p) => (
                  <Col xs={24} md={8} key={p.name}>
                    <Card style={{ height: '100%' }}>
                      <div className="card-icon">{p.icon}</div>
                      <Typography.Title level={4}>{p.name} <Tag>{p.tag}</Tag></Typography.Title>
                      <Typography.Paragraph type="secondary">{p.text}</Typography.Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          <section id="planner">
            <div className="wrap">
              <h2 className="sec-title">Plan your project</h2>
              <p className="sec-sub">Describe what you need. We match it to the right service or product and estimate the size of the job.</p>
              <ProjectScoper />
            </div>
          </section>
        </main>
      )}

      <footer>
        <div className="wrap">
          <p>Prototype built for the Cynbit Full Stack Developer Intern task. Not the official Cynbit website. Service and product descriptions are paraphrased from cynbit.in.</p>
        </div>
      </footer>
    </ConfigProvider>
  );
}
