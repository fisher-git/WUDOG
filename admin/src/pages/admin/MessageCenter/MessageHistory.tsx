import React, { useEffect, useState, useCallback } from 'react';
import { Table, Card, Input, Select, Button, Row, Col, DatePicker, Tag, Typography, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SystemMessageInfo } from '@wudong/shared';
import { getHistory } from '../../../services/message';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

const MessageHistory: React.FC = () => {
  const [data, setData] = useState<SystemMessageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHistory({
        page, pageSize, keyword: keyword || undefined, type: type || undefined,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize, keyword, type, dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => { setPage(1); fetchData(); };

  const columns: ColumnsType<SystemMessageInfo> = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '类型', dataIndex: 'type', width: 100, render: (t: string) => {
      const m: Record<string, { color: string; label: string }> = { system: { color: 'blue', label: '系统' }, order: { color: 'green', label: '订单' }, refund: { color: 'orange', label: '退款' }, notification: { color: 'cyan', label: '通知' } };
      return <Tag color={m[t]?.color}>{m[t]?.label || t}</Tag>;
    }},
    { title: '标题', dataIndex: 'title', width: 180, ellipsis: true },
    { title: '内容', dataIndex: 'content', width: 300, ellipsis: true, render: (c: string) => <Paragraph ellipsis={{ rows: 2 }}>{c}</Paragraph> },
    { title: '目标用户', dataIndex: 'userId', width: 100, render: (v: number | null) => v ? v : <Tag>全部</Tag> },
    { title: '阅读状态', dataIndex: 'isRead', width: 90, render: (r: boolean) => r ? <Tag color="green">已读</Tag> : <Tag color="default">未读</Tag> },
    { title: '发送时间', dataIndex: 'createdAt', width: 170, render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm:ss') },
  ];

  return (
    <Card title="消息历史" extra={<Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input placeholder="搜索标题/内容" prefix={<SearchOutlined />}
            value={keyword} onChange={(e) => setKeyword(e.target.value)} onPressEnter={handleSearch} allowClear />
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Select placeholder="类型筛选" value={type || undefined} onChange={(v) => setType(v || '')}
            style={{ width: '100%' }} allowClear options={[
              { label: '系统', value: 'system' }, { label: '订单', value: 'order' },
              { label: '退款', value: 'refund' }, { label: '通知', value: 'notification' },
            ]} />
        </Col>
        <Col xs={24} sm={10} md={8}>
          <RangePicker style={{ width: '100%' }} value={dateRange as any}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)} placeholder={['开始', '结束']} />
        </Col>
        <Col xs={24} sm={4} md={3}>
          <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />} block>查询</Button>
        </Col>
      </Row>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 1100 }} />
    </Card>
  );
};

export default MessageHistory;
