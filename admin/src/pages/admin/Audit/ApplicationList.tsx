import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Tabs, Input, Button, Space, Tag, Row, Col, Modal, message,
} from 'antd';
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { getApplications, auditApplication } from '../../../services/audit';
import type { MerchantApplicationInfo } from '@wudong/shared';
import { AuditStatus, ModuleType } from '@wudong/shared';
import dayjs from 'dayjs';

const moduleMap: Record<string, string> = {
  [ModuleType.CLOTHING]: '华服', [ModuleType.FOOD]: '美食',
  [ModuleType.LODGING]: '住宿', [ModuleType.TRAVEL]: '出行',
};

const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MerchantApplicationInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tab, setTab] = useState<AuditStatus>(AuditStatus.PENDING);
  const [keyword, setKeyword] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getApplications({
        page, pageSize,
        status: tab,
        keyword: keyword || undefined,
      });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, tab, keyword]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleTabChange = (key: string) => {
    setTab(key as AuditStatus);
    setPage(1);
  };

  const handleQuickAudit = async (id: number, action: 'approve' | 'reject') => {
    if (action === 'reject') {
      Modal.confirm({
        title: '拒绝原因',
        content: (
          <Input.TextArea id="reject-reason" rows={3} placeholder="请输入拒绝原因" />
        ),
        okText: '确认拒绝',
        cancelText: '取消',
        onOk: async () => {
          const reason = (document.getElementById('reject-reason') as HTMLTextAreaElement)?.value;
          await auditApplication(id, { action: 'reject', reason });
          message.success('已拒绝');
          fetchData();
        },
      });
    } else {
      Modal.confirm({
        title: '确认通过该申请?',
        content: '通过后将自动创建商户账号',
        okText: '确认通过',
        onOk: async () => {
          await auditApplication(id, { action: 'approve' });
          message.success('已通过');
          fetchData();
        },
      });
    }
  };

  const columns: ColumnsType<MerchantApplicationInfo> = [
    { title: '店铺名称', dataIndex: 'shopName', width: 140 },
    {
      title: '模块', dataIndex: 'module', width: 80,
      render: (m: string) => moduleMap[m] || m,
    },
    { title: '联系人', dataIndex: 'contactName', width: 100 },
    {
      title: '联系电话', dataIndex: 'contactPhone', width: 140,
      render: (p: string) => p?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    },
    {
      title: '申请时间', dataIndex: 'createdAt', width: 170,
      render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态', dataIndex: 'status', width: 90,
      render: (s: string) => {
        const m: Record<string, { color: string; label: string }> = {
          pending: { color: 'processing', label: '待审核' },
          approved: { color: 'success', label: '已通过' },
          rejected: { color: 'error', label: '已拒绝' },
        };
        return <Tag color={m[s]?.color}>{m[s]?.label || s}</Tag>;
      },
    },
    {
      title: '操作', key: 'actions', width: 260, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/audit/${record.id}`)}>
            详情
          </Button>
          {record.status === AuditStatus.PENDING && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} style={{ color: '#52c41a' }}
                onClick={() => handleQuickAudit(record.id, 'approve')}>
                通过
              </Button>
              <Button type="link" size="small" danger icon={<CloseOutlined />}
                onClick={() => handleQuickAudit(record.id, 'reject')}>
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: AuditStatus.PENDING, label: `待审核` },
    { key: AuditStatus.APPROVED, label: `已通过` },
    { key: AuditStatus.REJECTED, label: `已拒绝` },
  ];

  return (
    <Card title="入驻审核">
      <Tabs activeKey={tab} onChange={handleTabChange} items={tabItems} />
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Input placeholder="搜索店铺/联系人" prefix={<SearchOutlined />}
            value={keyword} onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => { setPage(1); fetchData(); }} allowClear />
        </Col>
        <Col>
          <Button type="primary" icon={<SearchOutlined />}
            onClick={() => { setPage(1); fetchData(); }}>查询</Button>
        </Col>
      </Row>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{
          current: page, pageSize, total, showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); },
        }}
        scroll={{ x: 1000 }} />
    </Card>
  );
};

export default ApplicationList;
