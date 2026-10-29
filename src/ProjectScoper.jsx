import { useState } from 'react';
import { Alert, Button, Card, Checkbox, Descriptions, Divider, Form, Input, Radio, Result, Select, Space, Steps, Tag } from 'antd';
import { FEATURES, GOALS, TIERS_NOTE, TIER_COLOR, TIMELINES, buildPlan, detectGoal, saveLead, weeksText } from './scoper.js';

export default function ProjectScoper() {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  const text = Form.useWatch('description', form) || '';
  const goal = Form.useWatch('goal', form);
  const detected = text.length > 10 ? detectGoal(text) : null;
  const detectedLabel = GOALS.find((g) => g.value === detected)?.label;

  const plan = current === 2 ? buildPlan(form.getFieldsValue(true)) : null;

  const next = async () => {
    try {
      await form.validateFields(current === 0 ? ['description', 'goal'] : ['timeline']);
      setCurrent((c) => c + 1);
    } catch {
      /* validation messages are shown inline */
    }
  };

  const onFinish = (values) => {
    const p = buildPlan(values);
    saveLead({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      name: values.name,
      email: values.email,
      phone: values.phone || '',
      description: values.description,
      need: p.goal.label,
      features: values.features,
      timeline: values.timeline,
      tier: p.tier,
      weeks: p.weeks,
      services: p.services,
      product: p.product || null,
    });
    setDone(true);
  };

  const restart = () => {
    form.resetFields();
    setCurrent(0);
    setDone(false);
  };

  return (
    <Card className="planner">
      {done && (
        <Result
          status="success"
          title="Plan sent"
          subTitle="Saved as a lead in this browser (prototype). In production it would go to the Cynbit team."
          extra={<Button type="primary" onClick={restart}>Plan another project</Button>}
        />
      )}

      <div style={{ display: done ? 'none' : 'block' }}>
        <Steps current={current} size="small" items={[{ title: 'Your need' }, { title: 'Details' }, { title: 'Your plan' }]} style={{ marginBottom: 28 }} />

        <Form form={form} layout="vertical" requiredMark={false} initialValues={{ features: [], timeline: 'quarter' }} onFinish={onFinish}>
          <div hidden={current !== 0}>
            <Form.Item
              name="description"
              label="What do you want to get done?"
              rules={[{ required: true, message: 'Describe your project in a sentence or two' }, { min: 15, message: 'Add a little more detail (at least 15 characters)' }]}
            >
              <Input.TextArea rows={4} maxLength={600} showCount placeholder="Example: We run three cafes and want to reply to Google reviews automatically." />
            </Form.Item>
            {detected && detected !== goal && (
              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message={`This sounds like: ${detectedLabel}`}
                action={<Button size="small" onClick={() => form.setFieldsValue({ goal: detected })}>Use this</Button>}
              />
            )}
            <Form.Item name="goal" label="Closest match" rules={[{ required: true, message: 'Pick the option that fits best' }]}>
              <Select placeholder="Choose one" options={GOALS.map((g) => ({ value: g.value, label: g.label }))} />
            </Form.Item>
          </div>

          <div hidden={current !== 1}>
            <Form.Item name="features" label="Anything specific you need?" className="check-grid">
              <Checkbox.Group options={FEATURES.map((f) => ({ value: f.value, label: f.label }))} />
            </Form.Item>
            <Form.Item name="timeline" label="When do you want to start?" rules={[{ required: true }]}>
              <Radio.Group options={TIMELINES.map((t) => ({ value: t.value, label: t.label }))} />
            </Form.Item>
          </div>

          <div hidden={current !== 2}>
            {plan && (
              <>
                <Descriptions
                  bordered
                  size="small"
                  column={1}
                  items={[
                    { key: 'path', label: 'Recommended path', children: plan.product ? `Start with ${plan.product}` : plan.goal.label },
                    { key: 'tier', label: 'Project size', children: <Tag color={TIER_COLOR[plan.tier]}>{plan.tier}</Tag> },
                    { key: 'time', label: 'Indicative timeline', children: weeksText(plan.weeks) },
                    { key: 'svc', label: 'Cynbit services', children: plan.services.length ? plan.services.map((s) => <Tag key={s} color="cyan">{s}</Tag>) : 'None needed' },
                    { key: 'stack', label: 'Suggested stack', children: plan.stack.map((s) => <Tag key={s}>{s}</Tag>) },
                  ]}
                />
                {plan.notes.map((n) => (
                  <Alert key={n} type="warning" showIcon message={n} style={{ marginTop: 12 }} />
                ))}
                <p className="fine">{TIERS_NOTE}</p>
              </>
            )}
            <Divider>Where should we send it?</Divider>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter your name' }]}>
              <Input autoComplete="name" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Enter your email' }, { type: 'email', message: 'That email does not look right' }]}>
              <Input autoComplete="email" />
            </Form.Item>
            <Form.Item name="phone" label="Phone (optional)">
              <Input autoComplete="tel" />
            </Form.Item>
          </div>

          <Space>
            {current > 0 && <Button onClick={() => setCurrent((c) => c - 1)}>Back</Button>}
            {current < 2 ? (
              <Button type="primary" onClick={next}>Next</Button>
            ) : (
              <Button type="primary" htmlType="submit">Send this plan to Cynbit</Button>
            )}
          </Space>
        </Form>
      </div>
    </Card>
  );
}
