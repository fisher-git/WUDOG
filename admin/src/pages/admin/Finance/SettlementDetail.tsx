import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Button, Spin, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getSettlementDetail } from '../../../services/finance';
import type { SettlementSheetInfo, SettlementRecordInfo } from '@wudong/shared';
import { SettlementStatus } from '@wudong/shared';
import dayjs from 'dayjs';

const { Title } = Typography;

const statusMap: Record<string, { color: string; label: string }> = {
  [SettlementStatus.PENDING]: { color: 'orange', label: '待确认' },
  [SettlementStatus.CONFIRMED]: { color: 'green', label: '已确认' },
  [SettlementStatus.PAID]: { color: 'blue', label: '已付款' },
};

const SettlementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<SettlementSheetInfo | null>(null);
  const [records, setRecords] = useState<SettlementRecordInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSettlementDetail(Number(id))
      .then((res) => {
        // Backend returns settlement detail directly with records embedded
        const detail = res.data as any;
        setSheet(detail);
        setRecords(detail.records || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const recordColumns: ColumnsType<SettlementRecordInfo> = [
    { title: '订单ID', dataIndex: 'orderId', width: 80 },
    { title: '商家', dataIndex: 'merchantName', width: 140 },
    { title: '订单金额', dataIndex: 'orderAmount', width: 100, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '佣金比例', dataIndex: 'commissionRate', width: 90, render: (v: number) => `${(v * 100).toFixed(1)}%` },
    { title: '佣金金额', dataIndex: 'commissionAmount', width: 100, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '商家收入', dataIndex: 'merchantIncome', width: 100, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => {
      const cfg = statusMap[s] || { color: 'default', label: s };
      return <Tag color={cfg.color}>{cfg.label}</Tag>;
    }},
  ];

  return (
    <Spin spinning={loading}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/finance')}
        style={{ marginBottom: 16, padding: 0 }}>返回列表</Button>
      {sheet && (
        <>
          <Card title={<Title level={4} style={{ margin: 0 }}>结算单详情 #{sheet.id}</Title>}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="结算单ID">{sheet.id}</Descriptions.Item>
              <Descriptions.Item label="结算周期">{sheet.period}</Descriptions.Item>
              <Descriptions.Item label="商家名称">{sheet.merchantName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[sheet.status]?.color}>{statusMap[sheet.status]?.label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="订单总数">{sheet.totalOrders}</Descriptions.Item>
              <Descriptions.Item label="订单总金额">¥{sheet.totalAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="佣金总额">¥{sheet.totalCommission.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="商家总收入">¥{sheet.totalIncome.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {dayjs(sheet.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="订单明细" style={{ marginTop: 16 }}>
            <Table rowKey="id" columns={recordColumns} dataSource={records}
              pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
              scroll={{ x: 800 }} size="small" />
          </Card>
        </>
      )}
    </Spin>
  );
};

export default SettlementDetail;
