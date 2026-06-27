import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Row, Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getShippingTemplates, createShippingTemplate, updateShippingTemplate, deleteShippingTemplate,
  type ShippingTemplate as ShippingTemplateType,
} from '../../../services/system';
import dayjs from 'dayjs';

const ShippingTemplate: React.FC = () => {
  const [data, setData] = useState<ShippingTemplateType[]>([]);
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
      const res = await getShippingTemplates({ page, pageSize });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenAdd = () => { setEditingId(null); form.resetFields(); setModalOpen(true); };
  const handleOpenEdit = (record: ShippingTemplateType) => {
    setEditingId(record.id); form.setFieldsValue(record); setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) { await updateShippingTemplate(editingId, values); message.success('更新成功'); }
      else { await createShippingTemplate(values); message.success('创建成功'); }
      setModalOpen(false); fetchData();
    } catch { }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({ title: '确认删除?', okText: '确认', cancelText: '取消', okType: 'danger',
      onOk: async () => { await deleteShippingTemplate(id); message.success('已删除'); fetchData(); } });
  };

  const columns: ColumnsType<ShippingTemplateType> = [
    { title: '模板名称', dataIndex: 'name', width: 140 },
    { title: '承运方', dataIndex: 'carrier', width: 100 },
    { title: '首重价格', dataIndex: 'basePrice', width: 100, render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '续重单价', dataIndex: 'perUnitPrice', width: 100, render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '包邮门槛', dataIndex: 'freeThreshold', width: 100, render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '预计天数', dataIndex: 'estimatedDays', width: 90 },
    { title: '覆盖地区', dataIndex: 'regions', width: 150, render: (r: string[]) => r?.join(', ') || '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => (
      <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? '启用' : '禁用'}</Tag>
    )},
    { title: '操作', key: 'actions', width: 180, fixed: 'right', render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>编辑</Button>
        <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
      </Space>
    )},
  ];

  return (
    <Card title="物流模板管理" extra={
      <Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>新增模板</Button>
      </Space>
    }>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 1050 }} />
      <Modal title={editingId ? '编辑模板' : '新增模板'} open={modalOpen} onOk={handleOk}
        onCancel={() => setModalOpen(false)} destroyOnClose width={560}>
        <Form form={form} layout="vertical" preserve={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
                <Input placeholder="例如：全国包邮" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="carrier" label="承运方" rules={[{ required: true }]}>
                <Input placeholder="例如：顺丰、中通" maxLength={50} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="basePrice" label="首重价格(元)" initialValue={10} rules={[{ required: true }]}>
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="perUnitPrice" label="续重单价(元)" initialValue={5} rules={[{ required: true }]}>
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="freeThreshold" label="包邮门槛(元)" initialValue={99}>
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="estimatedDays" label="预计天数" rules={[{ required: true }]}>
                <Input placeholder="例如：3-5天" maxLength={20} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" initialValue="active" rules={[{ required: true }]}>
                <Select options={[{ label: '启用', value: 'active' }, { label: '禁用', value: 'disabled' }]} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="regions" label="覆盖地区" rules={[{ required: true, message: '请输入地区' }]}>
                <Select mode="tags" placeholder="输入地区后回车添加" tokenSeparators={[',']}
                  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default ShippingTemplate;
