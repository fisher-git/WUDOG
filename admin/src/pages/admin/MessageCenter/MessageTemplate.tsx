import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Form, Input, Select, message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MessageTemplateInfo, MessageTemplateRequest } from '@wudong/shared';
import { MessageType } from '@wudong/shared';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../../../services/message';
import dayjs from 'dayjs';

const { TextArea } = Input;

const MessageTemplate: React.FC = () => {
  const [data, setData] = useState<MessageTemplateInfo[]>([]);
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
      const res = await getTemplates({ page, pageSize });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenAdd = () => { setEditingId(null); form.resetFields(); setModalOpen(true); };
  const handleOpenEdit = (record: MessageTemplateInfo) => {
    setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values: MessageTemplateRequest = await form.validateFields();
      if (editingId) { await updateTemplate(editingId, values); message.success('更新成功'); }
      else { await createTemplate(values); message.success('创建成功'); }
      setModalOpen(false); fetchData();
    } catch { }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({ title: '确认删除?', okText: '确认', cancelText: '取消', okType: 'danger',
      onOk: async () => { await deleteTemplate(id); message.success('已删除'); fetchData(); } });
  };

  const columns: ColumnsType<MessageTemplateInfo> = [
    { title: '模板编码', dataIndex: 'code', width: 140 },
    { title: '模板名称', dataIndex: 'name', width: 150 },
    { title: '标题模板', dataIndex: 'titleTemplate', width: 200, ellipsis: true },
    { title: '内容模板', dataIndex: 'contentTemplate', width: 250, ellipsis: true },
    { title: '类型', dataIndex: 'type', width: 100, render: (t: MessageType) => {
      const m: Record<string, string> = { system: '系统', order: '订单', refund: '退款', notification: '通知' };
      return <Tag>{m[t] || t}</Tag>;
    }},
    { title: '更新时间', dataIndex: 'updatedAt', width: 170, render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm') },
    { title: '操作', key: 'actions', width: 180, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>编辑</Button>
        <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
      </Space>
    )},
  ];

  return (
    <Card title="消息模板" extra={
      <Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>新增模板</Button>
      </Space>
    }>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 1100 }} />
      <Modal title={editingId ? '编辑模板' : '新增模板'} open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)} destroyOnClose width={600}>
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="code" label="模板编码" rules={[{ required: true }]}>
            <Input placeholder="例如：order_shipped" maxLength={50} />
          </Form.Item>
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input placeholder="例如：发货通知" maxLength={50} />
          </Form.Item>
          <Form.Item name="type" label="消息类型" rules={[{ required: true }]} initialValue={MessageType.SYSTEM}>
            <Select options={[
              { label: '系统通知', value: MessageType.SYSTEM }, { label: '订单消息', value: MessageType.ORDER },
              { label: '退款消息', value: MessageType.REFUND }, { label: '活动通知', value: MessageType.NOTIFICATION },
            ]} />
          </Form.Item>
          <Form.Item name="titleTemplate" label="标题模板" rules={[{ required: true }]}
            extra="使用 {{变量名}} 作为占位符">
            <Input placeholder="例如：您的订单 {{orderNo}} 已发货" maxLength={100} />
          </Form.Item>
          <Form.Item name="contentTemplate" label="内容模板" rules={[{ required: true }]}
            extra="使用 {{变量名}} 作为占位符">
            <TextArea rows={4} placeholder="消息内容模板..." maxLength={500} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MessageTemplate;
