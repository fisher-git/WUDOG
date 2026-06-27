import React, { useEffect, useState, useCallback } from 'react';
import { Card, Form, InputNumber, Button, message, Spin, Descriptions } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { getCommissionConfigs, updateCommission } from '../../../services/system';
import type { CommissionConfigInfo } from '@wudong/shared';
import dayjs from 'dayjs';

const moduleLabels: Record<string, string> = {
  clothing: '非遗手工坊 (华服)',
  food: '特色美食 (美食)',
  lodging: '民宿客栈 (住宿)',
  travel: '景区出行 (出行)',
};

const CommissionConfig: React.FC = () => {
  const [configs, setConfigs] = useState<CommissionConfigInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCommissionConfigs();
      setConfigs(res.data.data || []);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const cfg of configs) {
        await updateCommission(cfg.id, cfg.commissionRate);
      }
      message.success('佣金配置已保存（仅对新订单生效）');
    } catch { } finally { setSaving(false); }
  };

  const handleRateChange = (id: number, rate: number | null) => {
    if (rate === null) return;
    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, commissionRate: rate } : c)),
    );
  };

  return (
    <Spin spinning={loading}>
      <Card title="平台抽佣比例配置" extra={
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveAll} loading={saving}>保存配置</Button>
      }>
        {configs.map((cfg) => (
          <Card key={cfg.id} size="small" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <strong>{moduleLabels[cfg.module] || cfg.module}</strong>
                <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                  模块：{cfg.module} · 更新于 {dayjs(cfg.updatedAt).format('YYYY-MM-DD HH:mm')}
                </div>
              </div>
              <div>
                <InputNumber
                  value={cfg.commissionRate * 100}
                  onChange={(v) => handleRateChange(cfg.id, v !== null ? v / 100 : null)}
                  min={0}
                  max={30}
                  precision={1}
                  addonAfter="%"
                  style={{ width: 140 }}
                  size="large"
                />
              </div>
            </div>
          </Card>
        ))}
        {configs.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>暂无佣金配置数据</div>
        )}
      </Card>
    </Spin>
  );
};

export default CommissionConfig;
