import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Tag, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../../../services/homepage';

const BannerManagement: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try { const res: any = await getBanners(); setData(res?.data?.list || []); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const values = await form.validateFields();
    try {
      if (editingItem) { await updateBanner(editingItem.id, values); } else { await createBanner(values); }
      message.success(editingItem ? '更新成功' : '创建成功');
      setModalVisible(false); fetchData();
    } catch { message.error('操作失败'); }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({ title: '确认删除', onOk: async () => { await deleteBanner(id); message.success('删除成功'); fetchData(); } });
  };

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '图片', dataIndex: 'imageUrl', key: 'imageUrl', render: (url: string) => <img src={url} alt="" style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 4 }} /> },
    { title: '跳转链接', dataIndex: 'linkUrl', key: 'linkUrl', ellipsis: true },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'published' ? 'green' : 'orange'}>{s === 'published' ? '已上架' : s}</Tag> },
    { title: '操作', key: 'action', render: (_: any, record: any) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingItem(record); form.setFieldsValue(record); setModalVisible(true); }} />
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
      </Space>
    )},
  ];

  return (
    <div><Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setModalVisible(true); }} style={{ marginBottom: 16 }}>新增轮播图</Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal title={editingItem ? '编辑轮播图' : '新增轮播图'} open={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="imageUrl" label="图片URL" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="linkUrl" label="跳转链接"><Input /></Form.Item>
          <Form.Item name="sortOrder" label="排序" initialValue={0}><InputNumber /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="published">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement;
