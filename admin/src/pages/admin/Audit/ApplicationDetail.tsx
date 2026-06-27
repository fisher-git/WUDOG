import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Descriptions, Button, Spin, Tag, Image, Space, Row, Col, Modal, Input, Select, Typography, message,
} from 'antd';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getApplicationDetail, auditApplication } from '../../../services/audit';
import type { MerchantApplicationInfo } from '@wudong/shared';
import { AuditStatus, ModuleType } from '@wudong/shared';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const moduleOptions = [
  { label: '华服', value: ModuleType.CLOTHING },
  { label: '美食', value: ModuleType.FOOD },
  { label: '住宿', value: ModuleType.LODGING },
  { label: '出行', value: ModuleType.TRAVEL },
];

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<MerchantApplicationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleType | undefined>();
  const [rejectReason, setRejectReason] = useState('');
  const [auditing, setAuditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getApplicationDetail(Number(id))
      .then((res) => setDetail(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    if (!selectedModule) {
      message.warning('请选择分配的模块');
      return;
    }
    setAuditing(true);
    try {
      await auditApplication(Number(id), { action: 'approve', module: selectedModule });
      message.success('审核通过');
      setApproveModalOpen(false);
      navigate('/admin/audit');
    } catch {
      // handled
    } finally {
      setAuditing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('请输入拒绝原因');
      return;
    }
    setAuditing(true);
    try {
      await auditApplication(Number(id), { action: 'reject', reason: rejectReason });
      message.success('已拒绝');
      setRejectModalOpen(false);
      navigate('/admin/audit');
    } catch {
      // handled
    } finally {
      setAuditing(false);
    }
  };

  const statusMap: Record<string, { color: string; label: string }> = {
    pending: { color: 'processing', label: '待审核' },
    approved: { color: 'success', label: '已通过' },
    rejected: { color: 'error', label: '已拒绝' },
  };

  return (
    <Spin spinning={loading}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/audit')}
        style={{ marginBottom: 16, padding: 0 }}>返回列表</Button>

      {!loading && !detail && (
        <Card><Typography.Text type="secondary">申请不存在或已被删除</Typography.Text></Card>
      )}

      {detail && (
        <>
          <Card
            title={
              <Space>
                <Title level={4} style={{ margin: 0 }}>{detail.shopName}</Title>
                <Tag color={statusMap[detail.status]?.color}>{statusMap[detail.status]?.label}</Tag>
              </Space>
            }
            extra={
              detail.status === AuditStatus.PENDING ? (
                <Space>
                  <Button type="primary" icon={<CheckOutlined />}
                    onClick={() => setApproveModalOpen(true)}>
                    通过
                  </Button>
                  <Button danger icon={<CloseOutlined />}
                    onClick={() => setRejectModalOpen(true)}>
                    拒绝
                  </Button>
                </Space>
              ) : null
            }
          >
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="申请ID">{detail.id}</Descriptions.Item>
              <Descriptions.Item label="用户ID">{detail.userId}</Descriptions.Item>
              <Descriptions.Item label="店铺名称">{detail.shopName}</Descriptions.Item>
              <Descriptions.Item label="申请模块">
                {moduleOptions.find((o) => o.value === detail.module)?.label || detail.module}
              </Descriptions.Item>
              <Descriptions.Item label="联系人">{detail.contactName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {detail.contactPhone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
              </Descriptions.Item>
              <Descriptions.Item label="联系邮箱">{detail.contactEmail}</Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {dayjs(detail.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="店铺描述" span={2}>
                <Paragraph>{detail.shopDescription}</Paragraph>
              </Descriptions.Item>
              {detail.reviewComment && (
                <Descriptions.Item label="审核意见" span={2}>
                  <TextArea value={detail.reviewComment} disabled rows={2} />
                </Descriptions.Item>
              )}
            </Descriptions>

            <Title level={5} style={{ marginTop: 24 }}>资质材料</Title>
            <Row gutter={[16, 16]}>
              {(Array.isArray(detail.materials) ? detail.materials : []).map((url, idx) => (
                <Col key={idx} xs={24} sm={12} md={8} lg={6}>
                  <Card size="small" hoverable>
                    <Image src={url} alt={`材料${idx + 1}`} style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </>
      )}

      {/* 通过弹窗 */}
      <Modal title="审核通过" open={approveModalOpen}
        onOk={handleApprove} onCancel={() => setApproveModalOpen(false)}
        confirmLoading={auditing} okText="确认通过">
        <p>请选择分配的模块：</p>
        <Select placeholder="选择模块" value={selectedModule} onChange={setSelectedModule}
          options={moduleOptions} style={{ width: '100%' }} />
      </Modal>

      {/* 拒绝弹窗 */}
      <Modal title="审核拒绝" open={rejectModalOpen}
        onOk={handleReject} onCancel={() => setRejectModalOpen(false)}
        confirmLoading={auditing} okText="确认拒绝" okType="danger">
        <p>请输入拒绝原因：</p>
        <TextArea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
          placeholder="请输入拒绝原因..." maxLength={500} showCount />
      </Modal>
    </Spin>
  );
};

export default ApplicationDetail;
