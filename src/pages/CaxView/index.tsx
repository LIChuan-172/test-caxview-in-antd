import React, { useState, useRef } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Select, Form, Input, Space } from 'antd';
import MultidimensionalGraph from '@/components/MultidimensionalGraph';
import CAXViewBasic, { ModelType } from '@/components/CAXViewFull/CAXViewSimple/CAXViewBasic';
import { getUint8ArrayFromBlob } from '@/components/CAXViewFull/basics/Blob';
import { request } from 'umi';
import styles from './index.module.css';

const { Option } = Select;

const caxviewModelUrl = 'http://localhost:1234/test_caxdz';
const generateCaxviewUrl = (modelUrl: string): string => {
  const url = `/caxview.html?model=${encodeURIComponent(modelUrl)}`;
  console.log(url)
  return url;
};

const CaxView: React.FC = () => {
  const [caxModelData, setCaxModelData] = useState<any>();

  React.useEffect(() => {
    loadCaxViewData('1578642660672450561');
  }, []);

  const loadCaxViewData = async (fileViewId: string) => {
    try {
      const res = await request('http://localhost:9000/file/preview/' + fileViewId, {
        method: 'GET',
        responseType: 'blob',
      });
      console.log(res);
      const blob = new Blob([res]);
      const modelData = await getUint8ArrayFromBlob(blob);
      setCaxModelData(modelData);
    } catch (e) {
      // message.error('加载模型的数据异常【'+e+'】');
      console.error('加载模型的数据异常【' + e + '】');
      console.log('使用mock数据');
      const res = await request('/api/caxviewmodel', {
        method: 'GET',
        responseType: 'blob',
      });

      const modelData = await getUint8ArrayFromBlob(res);
      setCaxModelData(modelData);
    }
  };

  const nodeData = {
    nodes: [
      {
        id: '10000',
        label: 'BM001',
        nodeType: 'root',
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/%24BtlIJEaI9/shandian.svg',
      },
      {
        id: '10001',
        label: '结构模型',
        nodeType: 'dimension',
        icon: 'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*abGUQKUocSMAAAAAAAAAAABkARQnAQ',
      },
      {
        id: '10002',
        label: 'HFSS模型',
        nodeType: 'dimension',
        status: 'selected',
        icon: 'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*abGUQKUocSMAAAAAAAAAAABkARQnAQ',
      },
      {
        id: '10003',
        label: '力仿真模型',
        nodeType: 'dimension',
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
      },
      {
        id: '10004',
        label: '热仿真模型',
        nodeType: 'dimension',
        status: 'disabled',
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
      },
    ],
    edges: [
      {
        id: '2000',
        source: '10000',
        target: '10001',
      },
      {
        id: '2001',
        source: '10000',
        target: '10002',
      },
      {
        id: '2002',
        source: '10000',
        target: '10003',
      },
      {
        id: '2003',
        source: '10000',
        target: '10004',
      },
    ],
  };

  return (
    <ProCard
      tabs={{
        type: 'card',
        // defaultActiveKey: 'tab2',
        // className: styles.tabs,
      }}
    >
      <ProCard.TabPane key="tab1" tab="产品一">
        <MultidimensionalGraph
          nodeData={nodeData}
          onChange={(nodeId) => {
            console.log(nodeId);
            console.log(document.body.offsetWidth);
          }}
        />
      </ProCard.TabPane>
      <ProCard.TabPane key="tab2" tab="产品二">
        <iframe
          style={{ height: '500px', width: '100%', border: 'none' }}
          src={generateCaxviewUrl(caxviewModelUrl)}
        />
      </ProCard.TabPane>
    </ProCard>
  );
};
export default CaxView;
