import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Input, Select, Button, Space, Tag, Avatar, Row, Col, DatePicker, Modal, message,
} from 'antd';
import { SearchOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { getTouristList, banTourist, unbanTourist, type TouristInfo } from '../../../services/user';
import { UserStatus } from '@wudong/shared';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const statusMap: Record<string, { color: string; label: string }> = {
  [UserStatus.ACTIVE]: { color: 'green', label: '正常' },
  [UserStatus.BANNED]: { color: 'red', label: '已禁用' },
};

const TouristList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<TouristInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTouristList({
        page,
        pageSize,
        keyword: keyword || undefined,
        status: status || undefined,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      });
      setData(res.data.data.list);
      setTotal(res.data.data.total);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword, status, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleBan = async (id: number) => {
    Modal.confirm({
      title: '确认禁用该用户?',
      content: '禁用后用户将无法登录和使用平台功能',
      okText: '确认禁用',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await banTourist(id);
        message.success('已禁用该用户');
        fetchData();
      },
    });
  };

  const handleUnban = async (id: number) => {
    Modal.confirm({
      title: '确认解禁该用户?',
      content: '解禁后用户将恢复使用权限',
      okText: '确认解禁',
      cancelText: '取消',
      onOk: async () => {
        await unbanTourist(id);
        message.success('已解禁该用户');
        fetchData();
      },
    });
  };

  const columns: ColumnsType<TouristInfo> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 60,
      render: (avatar: string) => <Avatar src={avatar} size="small" icon={<UserOutlined />} />,
    },
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 100 },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 140,
      render: (phone: string) => phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '-',
    },
    {
      title: '注册时间',
      dataIndex: 'registeredAt',
      width: 180,
      render: (v: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (s: string) => {
        const cfg = statusMap[s] || { color: 'default', label: s };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/users/tourist/${record.id}`)}
          >
            查看
          </Button>
          {record.status === UserStatus.ACTIVE ? (
            <Button
              type="link"
              size="small"
              danger
              icon={<StopOutlined />}
              onClick={() => handleBan(record.id)}
            >
              禁用
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handleUnban(record.id)}
            >
              解禁
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card title="游客用户管理">
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="搜索用户名/手机号"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
          />
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Select
            placeholder="状态筛选"
            value={status || undefined}
            onChange={(v) => setStatus(v || '')}
            style={{ width: '100%' }}
            allowClear
            options={[
              { label: '正常', value: UserStatus.ACTIVE },
              { label: '已禁用', value: UserStatus.BANNED },
            ]}
          />
        </Col>
        <Col xs={24} sm={10} md={8}>
          <RangePicker
            style={{ width: '100%' }}
            value={dateRange as any}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
            placeholder={['注册开始', '注册结束']}
          />
        </Col>
        <Col xs={24} sm={4} md={3}>
          <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />} block>
            查询
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        scroll={{ x: 900 }}
      />
    </Card>
  );
};

export default TouristList;
