import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Input, Select, Button, Row, Col, Space, Tag, DatePicker, message, Modal,
} from 'antd';
import { SearchOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { getOrders, approveRefund, rejectRefund, type OrderInfo } from '../../../services/order';
import { OrderStatus, ModuleType } from '@wudong/shared';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const moduleMap: Record<string, string> = {
  [ModuleType.CLOTHING]: '华服', [ModuleType.FOOD]: '美食',
  [ModuleType.LODGING]: '住宿', [ModuleType.TRAVEL]: '出行',
};

const statusMap: Record<string, { color: string; label: string }> = {
  [OrderStatus.PENDING_PAY]: { color: 'orange', label: '待支付' },
  [OrderStatus.PAID]: { color: 'blue', label: '已支付' },
  [OrderStatus.CONFIRMED]: { color: 'cyan', label: '已确认' },
  [OrderStatus.SHIPPED]: { color: 'purple', label: '已发货' },
  [OrderStatus.RECEIVED]: { color: 'green', label: '已收货' },
  [OrderStatus.REFUNDING]: { color: 'red', label: '退款中' },
  [OrderStatus.REFUNDED]: { color: 'default', label: '已退款' },
  [OrderStatus.CANCELLED]: { color: 'default', label: '已取消' },
};

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [module, setModule] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders({
        page, pageSize, keyword: keyword || undefined,
        module: module || undefined, status: status || undefined,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      });
      setData(res.data.data.list);
      setTotal(res.data.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize, keyword, module, status, dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = () => { setPage(1); fetchData(); };

  const handleApproveRefund = (id: number) => {
    Modal.confirm({ title: '确认批准退款?', okText: '批准', cancelText: '取消',
      onOk: async () => { await approveRefund(id); message.success('退款已批准'); fetchData(); } });
  };

  const handleRejectRefund = (id: number) => {
    let reason = '';
    Modal.confirm({
      title: '拒绝退款',
      content: <Input.TextArea placeholder="请输入拒绝原因" rows={3}
        onChange={(e) => { reason = e.target.value; }} />,
      okText: '确认拒绝', okType: 'danger', cancelText: '取消',
      onOk: async () => { await rejectRefund(id, reason || '不符退款条件'); message.success('退款已拒绝'); fetchData(); },
    });
  };

  const columns: ColumnsType<OrderInfo> = [
    { title: '订单号', dataIndex: 'orderNo', width: 180, ellipsis: true },
    { title: '模块', dataIndex: 'module', width: 80, render: (m: string) => moduleMap[m] || m },
    { title: '商家', dataIndex: 'merchantName', width: 140 },
    { title: '用户', dataIndex: 'userName', width: 100 },
    { title: '金额', dataIndex: 'amount', width: 100, render: (v: number) => <span style={{ fontWeight: 500 }}>¥{v.toFixed(2)}</span> },
    { title: '状态', dataIndex: 'status', width: 90, render: (s: string) => {
      const cfg = statusMap[s] || { color: 'default', label: s };
      return <Tag color={cfg.color}>{cfg.label}</Tag>;
    }},
    { title: '下单时间', dataIndex: 'createdAt', width: 170, render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm') },
    { title: '操作', key: 'actions', width: 240, fixed: 'right', render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/orders/${record.id}`)}>详情</Button>
        {record.status === OrderStatus.REFUNDING && (
          <>
            <Button type="link" size="small" style={{ color: '#52c41a' }}
              onClick={() => handleApproveRefund(record.id)}>批准退款</Button>
            <Button type="link" size="small" danger
              onClick={() => handleRejectRefund(record.id)}>拒绝退款</Button>
          </>
        )}
      </Space>
    )},
  ];

  return (
    <Card title="全局订单" extra={<Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={5}>
          <Input placeholder="搜索订单号" prefix={<SearchOutlined />}
            value={keyword} onChange={(e) => setKeyword(e.target.value)} onPressEnter={handleSearch} allowClear />
        </Col>
        <Col xs={24} sm={6} md={3}>
          <Select placeholder="模块" value={module || undefined} onChange={(v) => setModule(v || '')}
            style={{ width: '100%' }} allowClear
            options={Object.entries(moduleMap).map(([k, v]) => ({ label: v, value: k }))} />
        </Col>
        <Col xs={24} sm={6} md={3}>
          <Select placeholder="状态" value={status || undefined} onChange={(v) => setStatus(v || '')}
            style={{ width: '100%' }} allowClear
            options={Object.entries(statusMap).map(([k, v]) => ({ label: v.label, value: k }))} />
        </Col>
        <Col xs={24} sm={10} md={7}>
          <RangePicker style={{ width: '100%' }} value={dateRange as any}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            placeholder={['开始时间', '结束时间']} />
        </Col>
        <Col xs={24} sm={4} md={3}>
          <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />} block>查询</Button>
        </Col>
      </Row>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 1200 }} />
    </Card>
  );
};

export default OrderList;
