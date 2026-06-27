import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Input, Select, Button, Row, Col, DatePicker, Tag, Space, Typography,
} from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api from '../../../services/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface OperationLog {
  id: number;
  operator: string;
  action: string;
  target: string;
  content: string;
  ip: string;
  createdAt: string;
}

const actionColors: Record<string, string> = {
  CREATE: 'green', UPDATE: 'blue', DELETE: 'red',
  LOGIN: 'cyan', LOGOUT: 'default', EXPORT: 'purple',
};

const OperationLogPage: React.FC = () => {
  const [data, setData] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [action, setAction] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/logs', {
        params: {
          page, pageSize,
          keyword: keyword || undefined,
          action: action || undefined,
          startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
          endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
        },
      });
      const body = res.data;
      setData(body.data?.list || []);
      setTotal(body.data?.total || 0);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword, action, dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => { setPage(1); fetchData(); };

  const columns: ColumnsType<OperationLog> = [
    { title: '操作人', dataIndex: 'operator', width: 120 },
    {
      title: '操作类型', dataIndex: 'action', width: 100,
      render: (a: string) => (
        <Tag color={actionColors[a] || 'default'}>{a}</Tag>
      ),
    },
    { title: '操作对象', dataIndex: 'target', width: 150, ellipsis: true },
    {
      title: '内容', dataIndex: 'content', width: 250, ellipsis: true,
      render: (c: string) => (
        <Text ellipsis={{ tooltip: c }} style={{ maxWidth: 230 }}>{c}</Text>
      ),
    },
    {
      title: 'IP地址', dataIndex: 'ip', width: 140,
      render: (ip: string) => <Text code>{ip}</Text>,
    },
    {
      title: '操作时间', dataIndex: 'createdAt', width: 180,
      render: (v: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  return (
    <Card
      title="操作日志"
      extra={<Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input placeholder="操作人/内容搜索" prefix={<SearchOutlined />}
            value={keyword} onChange={(e) => setKeyword(e.target.value)} onPressEnter={handleSearch} allowClear />
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Select placeholder="操作类型" value={action || undefined} onChange={(v) => setAction(v || '')}
            style={{ width: '100%' }} allowClear
            options={[
              { label: '创建', value: 'CREATE' }, { label: '更新', value: 'UPDATE' },
              { label: '删除', value: 'DELETE' }, { label: '登录', value: 'LOGIN' },
              { label: '导出', value: 'EXPORT' },
            ]} />
        </Col>
        <Col xs={24} sm={10} md={8}>
          <RangePicker style={{ width: '100%' }}
            value={dateRange as any}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            placeholder={['开始时间', '结束时间']} showTime />
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

export default OperationLogPage;
