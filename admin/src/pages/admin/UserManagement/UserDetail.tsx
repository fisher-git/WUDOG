import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Card, Descriptions, Button, Spin, Tag, Avatar, Space, Typography, Divider, Row, Col, Statistic,
} from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { getTouristDetail, getMerchantDetail, type TouristInfo } from '../../../services/user';
import type { MerchantInfo, MerchantStatus, UserStatus, ModuleType } from '@wudong/shared';
import dayjs from 'dayjs';

const { Title } = Typography;

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tourist, setTourist] = useState<TouristInfo | null>(null);
  const [merchant, setMerchant] = useState<MerchantInfo | null>(null);
  const detailType = location.pathname.includes('/merchant/') ? 'merchant' : 'tourist';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchFn = detailType === 'merchant' ? getMerchantDetail : getTouristDetail;
    fetchFn(Number(id))
      .then((res) => {
        if (detailType === 'merchant') setMerchant(res.data as MerchantInfo);
        else setTourist(res.data as TouristInfo);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, detailType]);

  const statusMap: Record<string, { color: string; label: string }> = {
    active: { color: 'green', label: '正常' },
    banned: { color: 'red', label: '已禁用' },
    suspended: { color: 'orange', label: '已停用' },
    closed: { color: 'default', label: '已关闭' },
  };

  const moduleMap: Record<string, string> = {
    clothing: '华服', food: '美食', lodging: '住宿', travel: '出行',
  };

  return (
    <Spin spinning={loading}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(detailType === 'merchant' ? '/admin/users/merchants' : '/admin/users/tourists')}
        style={{ marginBottom: 16, padding: 0 }}
      >
        返回列表
      </Button>

      {detailType === 'tourist' && tourist && (
        <Card>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <Avatar size={80} src={tourist.avatar} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 12 }}>{tourist.name}</Title>
              <Tag color={statusMap[tourist.status]?.color || 'default'}>
                {statusMap[tourist.status]?.label || tourist.status}
              </Tag>
            </Col>
            <Col xs={24} sm={16}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="用户ID">{tourist.id}</Descriptions.Item>
                <Descriptions.Item label="用户名">{tourist.username}</Descriptions.Item>
                <Descriptions.Item label="手机号">
                  {tourist.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                </Descriptions.Item>
                <Descriptions.Item label="注册时间">
                  {tourist.createdAt ? dayjs(tourist.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="最后登录">
                  {tourist.lastLoginAt ? dayjs(tourist.lastLoginAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      )}

      {detailType === 'merchant' && merchant && (
        <Card>
          <Title level={4} style={{ marginBottom: 24 }}>
            {merchant.shopName}
            <Tag style={{ marginLeft: 8 }} color={statusMap[merchant.status]?.color}>
              {statusMap[merchant.status]?.label || merchant.status}
            </Tag>
          </Title>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="商户ID">{merchant.id}</Descriptions.Item>
            <Descriptions.Item label="用户名">{merchant.username}</Descriptions.Item>
            <Descriptions.Item label="所属模块">
              {moduleMap[merchant.module as string] || merchant.module}
            </Descriptions.Item>
            <Descriptions.Item label="联系人">{merchant.contactName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {merchant.contactPhone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </Descriptions.Item>
            <Descriptions.Item label="联系邮箱">{merchant.contactEmail || '-'}</Descriptions.Item>
            <Descriptions.Item label="入驻时间">
              {merchant.settledAt ? dayjs(merchant.settledAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {merchant.createdAt ? dayjs(merchant.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Spin>
  );
};

export default UserDetail;
