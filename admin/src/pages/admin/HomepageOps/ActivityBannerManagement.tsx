import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Form, Input, Select, Upload, Image, DatePicker, message, Row, Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ActivityBannerInfo, ActivityBannerRequest } from '@wudong/shared';
import { ContentStatus } from '@wudong/shared';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../../../services/homepage';
import dayjs from 'dayjs';

const ActivityBannerManagement: React.FC = () => {
  const [data, setData] = useState<ActivityBannerInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getActivities({ page, pageSize });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenAdd = () => { setEditingId(null); form.resetFields(); setImageUrl(''); setModalOpen(true); };
  const handleOpenEdit = (record: ActivityBannerInfo) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      startTime: record.startTime ? dayjs(record.startTime) : undefined,
      endTime: record.endTime ? dayjs(record.endTime) : undefined,
    });
    setImageUrl(record.imageUrl);
    setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload: ActivityBannerRequest = {
        title: values.title, imageUrl: imageUrl || values.imageUrl,
        linkUrl: values.linkUrl || '',
        startTime: values.startTime?.format('YYYY-MM-DD HH:mm:ss') || values.startTime,
        endTime: values.endTime?.format('YYYY-MM-DD HH:mm:ss') || values.endTime,
        status: values.status,
      };
      if (editingId) {
        await updateActivity(editingId, payload);
        message.success('更新成功');
      } else {
        await createActivity(payload);
        message.success('创建成功');
      }
      setModalOpen(false); fetchData();
    } catch { }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({ title: '确认删除此活动?', okText: '确认', cancelText: '取消', okType: 'danger',
      onOk: async () => { await deleteActivity(id); message.success('已删除'); fetchData(); } });
  };

  const statusOptions = [
    { label: '草稿', value: ContentStatus.DRAFT }, { label: '已发布', value: ContentStatus.PUBLISHED }, { label: '已归档', value: ContentStatus.ARCHIVED },
  ];

  const columns: ColumnsType<ActivityBannerInfo> = [
    { title: '图片', dataIndex: 'imageUrl', width: 100, render: (url: string) => <Image src={url} width={60} height={40} style={{ objectFit: 'cover', borderRadius: 4 }}
      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" /> },
    { title: '标题', dataIndex: 'title', width: 150, ellipsis: true },
    { title: '链接', dataIndex: 'linkUrl', width: 150, ellipsis: true, render: (v: string) => v || '-' },
    { title: '开始时间', dataIndex: 'startTime', width: 170, render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm') },
    { title: '结束时间', dataIndex: 'endTime', width: 170, render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm') },
    { title: '状态', dataIndex: 'status', width: 90, render: (s: string) => {
      const m: Record<string, { color: string }> = { draft: { color: 'default' }, published: { color: 'green' }, archived: { color: 'default' } };
      return <Tag color={m[s]?.color}>{s === 'published' ? '已发布' : s === 'draft' ? '草稿' : '已归档'}</Tag>;
    }},
    { title: '操作', key: 'actions', width: 180, fixed: 'right', render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>编辑</Button>
        <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
      </Space>
    )},
  ];

  return (
    <Card title="活动Banner管理" extra={
      <Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>新增</Button>
      </Space>
    }>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 1000 }} />
      <Modal title={editingId ? '编辑活动' : '新增活动'} open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)} destroyOnClose width={600}>
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入标题" maxLength={50} />
          </Form.Item>
          <Form.Item label="图片">
            <Input placeholder="输入图片URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <Upload showUploadList={false} customRequest={({ onSuccess }) => { if (onSuccess) onSuccess({}); message.info('模拟上传'); }}>
              <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>本地上传</Button>
            </Upload>
            {imageUrl && <Image src={imageUrl} style={{ marginTop: 8, maxHeight: 120 }} />}
          </Form.Item>
          <Form.Item name="linkUrl" label="跳转链接"><Input placeholder="请输入跳转链接" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择' }]}>
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="状态" initialValue={ContentStatus.DRAFT} rules={[{ required: true }]}>
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ActivityBannerManagement;
