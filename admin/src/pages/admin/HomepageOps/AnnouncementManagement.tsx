import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Form, Input, Select, message, Typography,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AnnouncementInfo, AnnouncementRequest } from '@wudong/shared';
import { ContentStatus } from '@wudong/shared';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../../services/homepage';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Paragraph } = Typography;

const AnnouncementManagement: React.FC = () => {
  const [data, setData] = useState<AnnouncementInfo[]>([]);
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
      const res = await getAnnouncements({ page, pageSize });
      setData(res.data.data.list);
      setTotal(res.data.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenAdd = () => { setEditingId(null); form.resetFields(); setModalOpen(true); };
  const handleOpenEdit = (record: AnnouncementInfo) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values: AnnouncementRequest = await form.validateFields();
      if (editingId) { await updateAnnouncement(editingId, values); message.success('更新成功'); }
      else { await createAnnouncement(values); message.success('创建成功'); }
      setModalOpen(false); fetchData();
    } catch { }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({ title: '确认删除?', okText: '确认', cancelText: '取消', okType: 'danger',
      onOk: async () => { await deleteAnnouncement(id); message.success('已删除'); fetchData(); } });
  };

  const columns: ColumnsType<AnnouncementInfo> = [
    { title: '标题', dataIndex: 'title', width: 160, ellipsis: true },
    { title: '内容', dataIndex: 'content', width: 300, ellipsis: true, render: (c: string) => <Paragraph ellipsis={{ rows: 2 }}>{c}</Paragraph> },
    { title: '发布时间', dataIndex: 'publishedAt', width: 170, render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-' },
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
    <Card title="公告管理" extra={
      <Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>新增</Button>
      </Space>
    }>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 1000 }} />
      <Modal title={editingId ? '编辑公告' : '新增公告'} open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)} destroyOnClose width={560}>
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入标题" maxLength={100} />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={5} placeholder="请输入公告内容" maxLength={2000} showCount />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={ContentStatus.DRAFT} rules={[{ required: true }]}>
            <Select options={[
              { label: '草稿', value: ContentStatus.DRAFT }, { label: '已发布', value: ContentStatus.PUBLISHED }, { label: '已归档', value: ContentStatus.ARCHIVED },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AnnouncementManagement;
