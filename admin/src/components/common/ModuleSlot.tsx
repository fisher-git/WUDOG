import React from 'react';
import { Empty } from 'antd';

interface ModuleSlotProps {
  moduleId: number;
  src?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
}

const ModuleSlot: React.FC<ModuleSlotProps> = ({
  moduleId,
  src,
  title = `模块 ${moduleId}`,
  width = '100%',
  height = 600,
}) => {
  if (!src) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #d9d9d9',
          borderRadius: 8,
          background: '#fafafa',
        }}
      >
        <Empty
          description={`${title} - 暂无内容`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      style={{
        width,
        height,
        border: 'none',
        borderRadius: 8,
      }}
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
};

export default ModuleSlot;
