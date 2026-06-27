import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Form, Input, Select, Upload, message,
} from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SensitiveWord } from '../../../services/system';
import { getSensitiveWords, addSensitiveWord, deleteSensitiveWord, batchImportSensitiveWords } from '../../../services/system';
import dayjs from 'dayjs';

const SensitiveWords: React.FC = () => {
  const [data, setData] = useState<SensitiveWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSensitiveWords({ page, pageSize });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch { } finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await addSensitiveWord(values);
      message.success('添加成功');
      setModalOpen(false);
      form.resetFields();
      fetchData();
    } catch { }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({ title: '确认删除?', okText: '确认', cancelText: '取消', okType: 'danger',
      onOk: async () => { await deleteSensitiveWord(id); message.success('已删除'); fetchData(); } });
  };

  const handleBatchImport = async (file: File) => {
    const text = await file.text();
    const words = text.split('\n').map((w) => w.trim()).filter(Boolean);
    if (words.length === 0) { message.warning('未检测到有效内容'); return false; }
    try {
      const res = await batchImportSensitiveWords(words);
      message.success(`成功导入 ${res.data?.imported || words.length} 个敏感词`);
      fetchData();
    } catch { }
    return false; // prevent upload
  };

  const columns: ColumnsType<SensitiveWord> = [
    { title: '敏感词', dataIndex: 'word', width: 200 },
    {
      title: '级别', dataIndex: 'level', width: 100,
      render: (l: string) => {
        const m: Record<string, { color: string; label: string }> = {
          high: { color: 'red', label: '高危' },
          medium: { color: 'orange', label: '中危' },
          low: { color: 'default', label: '低危' },
        };
        return <Tag color={m[l]?.color}>{m[l]?.label || l}</Tag>;
      },
    },
    { title: '添加时间', dataIndex: 'createdAt', width: 180,
      render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm:ss') },
    { title: '操作', key: 'actions', width: 100, fixed: 'right', render: (_, record) => (
      <Button type="link" size="small" danger icon={<DeleteOutlined />}
        onClick={() => handleDelete(record.id)}>删除</Button>
    )},
  ];

  return (
    <Card title="敏感词管理" extra={
      <Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
        <Upload accept=".txt" showUploadList={false} beforeUpload={handleBatchImport}>
          <Button icon={<UploadOutlined />}>批量导入</Button>
        </Upload>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => { form.resetFields(); setModalOpen(true); }}>添加敏感词</Button>
      </Space>
    }>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading}
        pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
        scroll={{ x: 700 }} />
      <Modal title="添加敏感词" open={modalOpen} onOk={handleAdd}
        onCancel={() => setModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="word" label="敏感词" rules={[{ required: true, message: '请输入敏感词' }]}>
            <Input placeholder="请输入敏感词" maxLength={50} />
          </Form.Item>
          <Form.Item name="level" label="级别" initialValue="medium"
            rules={[{ required: true, message: '请选择级别' }]}>
            <Select options={[
              { label: '高危', value: 'high' }, { label: '中危', value: 'medium' }, { label: '低危', value: 'low' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SensitiveWords;
