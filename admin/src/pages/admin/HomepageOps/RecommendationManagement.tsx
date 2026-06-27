import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Row, Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RecommendationSlotInfo, RecommendationSlotRequest } from '@wudong/shared';
import { ContentStatus } from '@wudong/shared';
import { getRecommendations, createRecommendation, updateRecommendation, deleteRecommendation } from '../../../services/homepage';
import dayjs from 'dayjs';

const contentTypes = [
  { label: '商品', value: 'product' }, { label: '文章', value: 'article' },
  { label: '活动', value: 'activity' }, { label: '商家', value: 'merchant' },
];

const RecommendationManagement: React.FC = () => {
  const [data, setData] = useState<RecommendationSlotInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRecommendations({ page, pageSize });
      setData(res.data.data.list);
      setTotal(res.data.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenAdd = () => { setEditingId(null); form.resetFields(); setModalOpen(true); };
  const handleOpenEdit = (record: RecommendationSlotInfo) => {
    setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values: RecommendationSlotRequest = await form.validateFields();
      if (editingId) { await updateRecommendation(editingId, values); message.success('更新成功'); }
      else { await createRecommendation(values); message.success('创建成功'); }
      setModalOpen(false); fetchData();
    } catch { }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({ title: '确认删除?', okText: '确认', cancelText: '取消', okType: 'danger',
      onOk: async () => { await deleteRecommendation(id); message.success('已删除'); fetchData(); } });
  };

  const columns: ColumnsType<RecommendationSlotInfo> = [
    { title: '槽位名称', dataIndex: 'slotName', width: 130 },
    { title: '内容类型', dataIndex: 'contentType', width: 100, render: (v: string) => contentTypes.find(c => c.value === v)?.label || v },
    { title: '内容ID', dataIndex: 'contentId', width: 90 },
    { title: '排序', dataIndex: 'sortOrder', width: 70 },
    { title: '状态', dataIndex: 'status', width: 90, render: (s: string) => {
      const m: Record<string, { color: string; label: string }> = { draft: { color: 'default', label: '草稿' }, published: { color: 'green', label: '已发布' }, archived: { color: 'default', label: '已归档' } };
      return <Tag color={m[s]?.color}>{m[s]?.label || s}</Tag>;
    }},
    { title: '创建时间', dataIndex: 'createdAt', width: 170, render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm') },
    { title: '操作', key: 'actions', width: 180, fixed: 'right', render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>编辑</Button>
        <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
      </Space>
    )},
  ];

  return (
    <Card title="推荐位管理" extra={
      <Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>新增</Button>
      </Space>
    }>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 900 }} />
      <Modal title={editingId ? '编辑推荐位' : '新增推荐位'} open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)} destroyOnClose width={520}>
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="slotName" label="槽位名称" rules={[{ required: true }]}>
            <Input placeholder="例如：首页热推、猜你喜欢" maxLength={50} />
          </Form.Item>
          <Form.Item name="contentType" label="内容类型" rules={[{ required: true }]}>
            <Select options={contentTypes} />
          </Form.Item>
          <Form.Item name="contentId" label="内容ID" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sortOrder" label="排序" initialValue={0} rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue={ContentStatus.DRAFT} rules={[{ required: true }]}>
                <Select options={[{ label: '草稿', value: ContentStatus.DRAFT }, { label: '已发布', value: ContentStatus.PUBLISHED }, { label: '已归档', value: ContentStatus.ARCHIVED }]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default RecommendationManagement;
