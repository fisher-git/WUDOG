import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Select, Row, Col, message, Typography,
} from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { SettlementSheetInfo } from '@wudong/shared';
import { SettlementStatus } from '@wudong/shared';
import { getSettlements, generateSettlement, confirmSettlement } from '../../../services/finance';
import { getMerchantList } from '../../../services/user';
import dayjs from 'dayjs';

const { Text } = Typography;

const statusMap: Record<string, { color: string; label: string }> = {
  [SettlementStatus.PENDING]: { color: 'orange', label: '待确认' },
  [SettlementStatus.CONFIRMED]: { color: 'green', label: '已确认' },
  [SettlementStatus.PAID]: { color: 'blue', label: '已付款' },
};

const SettlementList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SettlementSheetInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<number>();
  const [selectedPeriod, setSelectedPeriod] = useState('T+7');
  const [generating, setGenerating] = useState(false);
  const [merchants, setMerchants] = useState<Array<{ id: number; shopName: string }>>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSettlements({ page, pageSize });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    getMerchantList({ page: 1, pageSize: 1000 })
      .then((res) => setMerchants(res.data.list.map((m) => ({ id: m.id, shopName: m.shopName }))))
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!selectedMerchant) { message.warning('请选择商家'); return; }
    setGenerating(true);
    try {
      await generateSettlement({ merchantId: selectedMerchant, period: selectedPeriod });
      message.success('结算单已生成');
      setGenerateOpen(false);
      fetchData();
    } catch { } finally { setGenerating(false); }
  };

  const handleConfirm = async (id: number) => {
    Modal.confirm({ title: '确认该结算单?', content: '确认后结算金额将进入打款流程', okText: '确认', cancelText: '取消',
      onOk: async () => { await confirmSettlement(id); message.success('已确认'); fetchData(); } });
  };

  const columns: ColumnsType<SettlementSheetInfo> = [
    { title: '结算周期', dataIndex: 'period', width: 140 },
    { title: '商家', dataIndex: 'merchantName', width: 150 },
    { title: '订单数', dataIndex: 'totalOrders', width: 80 },
    { title: '总金额', dataIndex: 'totalAmount', width: 120, render: (v: number) => <Text strong>¥{v.toLocaleString()}</Text> },
    { title: '佣金', dataIndex: 'totalCommission', width: 120, render: (v: number) => <Text type="warning">¥{v.toLocaleString()}</Text> },
    { title: '商家收入', dataIndex: 'totalIncome', width: 120, render: (v: number) => <Text type="success">¥{v.toLocaleString()}</Text> },
    { title: '状态', dataIndex: 'status', width: 90, render: (s: string) => {
      const cfg = statusMap[s] || { color: 'default', label: s };
      return <Tag color={cfg.color}>{cfg.label}</Tag>;
    }},
    { title: '创建时间', dataIndex: 'createdAt', width: 170, render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm') },
    { title: '操作', key: 'actions', width: 200, fixed: 'right', render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/finance/${record.id}`)}>详情</Button>
        {record.status === SettlementStatus.PENDING && (
          <Button type="link" size="small" icon={<CheckOutlined />}
            style={{ color: '#52c41a' }} onClick={() => handleConfirm(record.id)}>确认</Button>
        )}
      </Space>
    )},
  ];

  return (
    <Card title="结算管理" extra={
      <Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setGenerateOpen(true)}>生成结算单</Button>
      </Space>
    }>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 1150 }} />

      <Modal title="生成结算单" open={generateOpen} onOk={handleGenerate}
        onCancel={() => setGenerateOpen(false)} confirmLoading={generating} okText="生成">
        <p style={{ marginBottom: 16 }}>选择商家和结算周期：</p>
        <Select placeholder="选择商家" value={selectedMerchant} onChange={setSelectedMerchant}
          showSearch optionFilterProp="label"
          options={merchants.map((m) => ({ label: m.shopName, value: m.id }))}
          style={{ width: '100%', marginBottom: 16 }} />
        <Select value={selectedPeriod} onChange={setSelectedPeriod}
          options={[
            { label: 'T+7 (每周结算)', value: 'T+7' },
            { label: 'T+15 (半月结算)', value: 'T+15' },
            { label: 'T+30 (月结算)', value: 'T+30' },
          ]}
          style={{ width: '100%' }} />
      </Modal>
    </Card>
  );
};

export default SettlementList;
