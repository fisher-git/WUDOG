import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Input, Select, Button, Space, Tag, Row, Col, Modal, message,
} from 'antd';
import { SearchOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { getMerchantList, updateMerchantStatus, type MerchantQuery } from '../../../services/user';
import type { MerchantInfo } from '@wudong/shared';
import { MerchantStatus, ModuleType } from '@wudong/shared';
import dayjs from 'dayjs';

const statusMap: Record<string, { color: string; label: string }> = {
  [MerchantStatus.ACTIVE]: { color: 'green', label: '正常' },
  [MerchantStatus.SUSPENDED]: { color: 'orange', label: '已停用' },
  [MerchantStatus.CLOSED]: { color: 'red', label: '已关闭' },
};

const moduleMap: Record<string, string> = {
  [ModuleType.CLOTHING]: '华服',
  [ModuleType.FOOD]: '美食',
  [ModuleType.LODGING]: '住宿',
  [ModuleType.TRAVEL]: '出行',
};

const MerchantList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MerchantInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [module, setModule] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: MerchantQuery = {
        page, pageSize,
        keyword: keyword || undefined,
        module: module || undefined,
        status: status || undefined,
      };
      const res = await getMerchantList(params);
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword, module, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => { setPage(1); fetchData(); };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const labelMap: Record<string, string> = {
      [MerchantStatus.ACTIVE]: '启用',
      [MerchantStatus.SUSPENDED]: '停用',
      [MerchantStatus.CLOSED]: '关闭',
    };
    Modal.confirm({
      title: `确认${labelMap[newStatus] || '变更'}该商户?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await updateMerchantStatus(id, newStatus);
        message.success('状态已更新');
        fetchData();
      },
    });
  };

  const columns: ColumnsType<MerchantInfo> = [
    { title: '店铺名称', dataIndex: 'shopName', width: 150 },
    {
      title: '模块', dataIndex: 'module', width: 80,
      render: (m: string) => moduleMap[m] || m,
    },
    { title: '联系人', dataIndex: 'contactName', width: 100 },
    {
      title: '联系电话', dataIndex: 'contactPhone', width: 140,
      render: (p: string) => p?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '-',
    },
    {
      title: '入驻时间', dataIndex: 'settledAt', width: 180,
      render: (v: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (s: string) => {
        const cfg = statusMap[s] || { color: 'default', label: s };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '操作', key: 'actions', width: 240, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/users/merchant/${record.id}`)}>
            查看
          </Button>
          {record.status === MerchantStatus.ACTIVE ? (
            <Button type="link" size="small" danger icon={<StopOutlined />}
              onClick={() => handleStatusChange(record.id, MerchantStatus.SUSPENDED)}>
              停用
            </Button>
          ) : (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} style={{ color: '#52c41a' }}
              onClick={() => handleStatusChange(record.id, MerchantStatus.ACTIVE)}>
              启用
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card title="商户管理">
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input placeholder="搜索店铺/联系人" prefix={<SearchOutlined />}
            value={keyword} onChange={(e) => setKeyword(e.target.value)} onPressEnter={handleSearch} allowClear />
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Select placeholder="模块筛选" value={module || undefined} onChange={(v) => setModule(v || '')}
            style={{ width: '100%' }} allowClear
            options={Object.entries(moduleMap).map(([k, v]) => ({ label: v, value: k }))} />
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Select placeholder="状态筛选" value={status || undefined} onChange={(v) => setStatus(v || '')}
            style={{ width: '100%' }} allowClear
            options={Object.entries(statusMap).map(([k, v]) => ({ label: v.label, value: k }))} />
        </Col>
        <Col xs={24} sm={4} md={3}>
          <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />} block>查询</Button>
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

export default MerchantList;
