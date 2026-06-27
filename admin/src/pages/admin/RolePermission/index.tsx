import React, { useEffect, useState, useCallback } from 'react';
import {
  Card, Tree, Row, Col, Button, Space, Modal, Form, Input, Checkbox, message, Spin, Popconfirm,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import {
  getRoles, createRole, updateRole, deleteRole, getPermissions,
} from '../../../services/role';
import type { AdminRoleInfo, AdminPermissionInfo } from '@wudong/shared';

const RolePermissionPage: React.FC = () => {
  const [roles, setRoles] = useState<AdminRoleInfo[]>([]);
  const [allPermissions, setAllPermissions] = useState<AdminPermissionInfo[]>([]);
  const [selectedRole, setSelectedRole] = useState<AdminRoleInfo | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增角色');
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState<AdminRoleInfo | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([getRoles(), getPermissions()]);
      setRoles(rolesRes.data.data);
      setAllPermissions(permsRes.data.data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 构建角色树
  const roleTreeData: DataNode[] = roles.map((role) => ({
    key: `role-${role.id}`,
    title: role.name,
    icon: null,
    isLeaf: false,
    data: role,
  }));

  // 构建权限树（按分组）
  const permissionTreeData: DataNode[] = React.useMemo(() => {
    const groups = new Map<string, AdminPermissionInfo[]>();
    allPermissions.forEach((p) => {
      const g = p.group || '默认';
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(p);
    });
    return Array.from(groups.entries()).map(([group, perms]) => ({
      key: `group-${group}`,
      title: group,
      checkable: false,
      children: perms.map((p) => ({
        key: `perm-${p.id}`,
        title: `${p.name} (${p.code})`,
      })),
    }));
  }, [allPermissions]);

  const handleRoleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length === 0) {
      setSelectedRole(null);
      setCheckedKeys([]);
      return;
    }
    const key = String(selectedKeys[0]);
    const roleId = Number(key.replace('role-', ''));
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      setCheckedKeys(role.permissions?.map((p) => p.id) || []);
    }
  };

  const handleCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    const keys = Array.isArray(checked) ? checked : checked.checked;
    setCheckedKeys(keys.map((k) => Number(String(k).replace('perm-', ''))));
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await updateRole(selectedRole.id, { permissionIds: checkedKeys });
      message.success('权限已保存');
      fetchData();
    } catch {
      // handled
    }
  };

  const handleOpenAddModal = () => {
    setEditingRole(null);
    setModalTitle('新增角色');
    form.resetFields();
    setModalOpen(true);
  };

  const handleOpenEditModal = (role: AdminRoleInfo) => {
    setEditingRole(role);
    setModalTitle('编辑角色');
    form.setFieldsValue({
      name: role.name,
      description: role.description,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await updateRole(editingRole.id, values);
        message.success('角色已更新');
      } else {
        await createRole({ ...values, permissionIds: [] });
        message.success('角色已创建');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      // validation error
    }
  };

  const handleDelete = async (id: number) => {
    await deleteRole(id);
    message.success('角色已删除');
    setSelectedRole(null);
    setCheckedKeys([]);
    fetchData();
  };

  return (
    <Spin spinning={loading}>
      <Card
        title="角色权限管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddModal}>
              新增角色
            </Button>
          </Space>
        }
      >
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Card size="small" title="角色列表" style={{ marginBottom: 16 }}>
              <Tree
                treeData={roleTreeData}
                onSelect={handleRoleSelect}
                selectedKeys={selectedRole ? [`role-${selectedRole.id}`] : []}
                titleRender={(node) => {
                  const role = (node as any).data as AdminRoleInfo | undefined;
                  if (!role) return <span>{node.title as string}</span>;
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span>{role.name}</span>
                      <Space size="small" style={{ visibility: selectedRole?.id === role.id ? 'visible' : 'hidden' }}>
                        <Button type="link" size="small" icon={<EditOutlined />}
                          onClick={(e) => { e.stopPropagation(); handleOpenEditModal(role); }} />
                        <Popconfirm title="确定删除该角色?" onConfirm={() => handleDelete(role.id)}>
                          <Button type="link" size="small" danger icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()} />
                        </Popconfirm>
                      </Space>
                    </div>
                  );
                }}
              />
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card
              size="small"
              title={selectedRole ? `权限配置 - ${selectedRole.name}` : '请选择一个角色'}
              extra={
                selectedRole ? (
                  <Button type="primary" onClick={handleSavePermissions} size="small">
                    保存权限
                  </Button>
                ) : null
              }
            >
              {selectedRole ? (
                <>
                  <p style={{ color: '#8c8c8c', marginBottom: 12 }}>
                    描述：{selectedRole.description || '暂无'}
                  </p>
                  <Checkbox.Group value={checkedKeys} style={{ width: '100%' }}>
                    <Tree
                      checkable
                      defaultExpandAll
                      treeData={permissionTreeData}
                      checkedKeys={checkedKeys.map((k) => `perm-${k}`)}
                      onCheck={handleCheck as any}
                      selectable={false}
                    />
                  </Checkbox.Group>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: '#8c8c8c', padding: 40 }}>
                  请在左侧选择一个角色以查看和编辑其权限
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card>

      <Modal
        title={modalTitle}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="name" label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" maxLength={30} />
          </Form.Item>
          <Form.Item name="description" label="角色描述">
            <Input.TextArea rows={3} placeholder="请输入角色描述" maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default RolePermissionPage;
