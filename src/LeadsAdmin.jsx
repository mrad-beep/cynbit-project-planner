import { useState } from 'react';
import { Button, Card, Col, Popconfirm, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { TIER_COLOR, clearLeads, getLeads, weeksText } from './scoper.js';

function exportCsv(leads) {
  const head = ['Date', 'Name', 'Email', 'Phone', 'Need', 'Size', 'Timeline', 'Services', 'Description'];
  const rows = leads.map((l) => [l.createdAt, l.name, l.email, l.phone, l.need, l.tier, weeksText(l.weeks), l.services.join('; '), l.description]);
  const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cynbit-leads.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsAdmin() {
  const [leads, setLeads] = useState(getLeads());
  const count = (tier) => leads.filter((l) => l.tier === tier).length;

  const columns = [
    { title: 'Date', dataIndex: 'createdAt', render: (v) => new Date(v).toLocaleDateString() },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Need', dataIndex: 'need' },
    { title: 'Size', dataIndex: 'tier', render: (t) => <Tag color={TIER_COLOR[t]}>{t}</Tag> },
    { title: 'Timeline', dataIndex: 'weeks', render: weeksText },
  ];

  return (
    <div className="wrap" style={{ padding: '40px 20px' }}>
      <Typography.Title level={2}>Leads from the Project Planner</Typography.Title>
      <Typography.Paragraph type="secondary">Demo view. Leads are stored in this browser only; a real version would sit behind a login.</Typography.Paragraph>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} md={6}><Card><Statistic title="Total leads" value={leads.length} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Starter" value={count('Starter')} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Growth" value={count('Growth')} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Scale" value={count('Scale')} /></Card></Col>
      </Row>

      <Space style={{ marginBottom: 16 }}>
        <Button icon={<DownloadOutlined />} disabled={!leads.length} onClick={() => exportCsv(leads)}>Export CSV</Button>
        <Popconfirm title="Delete all leads?" okText="Delete" onConfirm={() => { clearLeads(); setLeads([]); }}>
          <Button danger icon={<DeleteOutlined />} disabled={!leads.length}>Clear all</Button>
        </Popconfirm>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={leads}
        scroll={{ x: true }}
        locale={{ emptyText: 'No leads yet. Complete the planner on the home page to add one.' }}
        expandable={{
          expandedRowRender: (l) => (
            <div>
              <p><b>Project:</b> {l.description}</p>
              <p><b>Services:</b> {l.services.join(', ') || 'None'}{l.product ? ` | Product: ${l.product}` : ''}</p>
              <p><b>Contact:</b> {l.email}{l.phone ? `, ${l.phone}` : ''}</p>
            </div>
          ),
        }}
      />
    </div>
  );
}
