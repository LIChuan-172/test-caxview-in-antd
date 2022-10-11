import React,{useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Button } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';
import MultidimensionalGraph from '@/components/MultidimensionalGraph';
// import CAXViewBasic, {
//   ModelType
// } from "@/components/CAXViewFull/CAXViewSimple/CAXViewBasic";
import CAXViewModal from '@/components/common/CAXViewModal';
import { getUint8ArrayFromBlob } from "@/components/CAXViewFull/basics/Blob";
import { request } from 'umi';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome: React.FC = () => {
  const intl = useIntl();
  const [caxModelData,setCaxModelData] = useState<any>(); 
  const [caxViewVisible,handleCaxViewVisible] = useState<boolean>(false);
  const [caxViewTitle,setCaxViewTitle] = useState<string|undefined>();
  const [caxFile,setCaxFile] = useState<any>();

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

  React.useEffect(()=>{
    loadCaxViewData("1578642660672450561");
  },[]);

  const loadCaxViewData = async (fileViewId:string)=>{
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
      console.log(e);
    }
  }

  return (
    <>
      <PageContainer>
        <Card>
          <Alert
            message={intl.formatMessage({
              id: 'pages.welcome.alertMessage',
              defaultMessage: 'Faster and stronger heavy-duty components have been released.',
            })}
            type="success"
            showIcon
            banner
            style={{
              margin: -12,
              marginBottom: 24,
            }}
          />
          <Typography.Text strong>
            <FormattedMessage id="pages.welcome.advancedComponent" defaultMessage="Advanced Form" />{' '}
            <a
              href="https://procomponents.ant.design/components/table"
              rel="noopener noreferrer"
              target="__blank"
            >
              <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
            </a>
          </Typography.Text>
          <CodePreview>yarn add @ant-design/pro-table<Button onClick={()=>{
            handleCaxViewVisible(true);
            setCaxViewTitle("模型可视化");
           setCaxFile({fileViewId:'1578642660672450561',modelType:'caxdz'})
          }}>模型可视化</Button></CodePreview>
          <Typography.Text
            strong
            style={{
              marginBottom: 12,
            }}
          >
            <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="Advanced layout" />{' '}
            <a
              href="https://procomponents.ant.design/components/layout"
              rel="noopener noreferrer"
              target="__blank"
            >
              <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
            </a>
          </Typography.Text>
          <CodePreview>yarn add @ant-design/pro-layout<Button type="link" href="/editTable" rel="noopener noreferrer" target="__blank">模型可视化</Button></CodePreview>
        </Card>
      </PageContainer>
      <MultidimensionalGraph nodeData={nodeData} onChange={(nodeId) => {
        console.log(nodeId);
        console.log(document.body.offsetWidth);
      }}  />
      {/* {caxModelData && <CAXViewBasic
            model={caxModelData}
            type={"caxdz"}
          />} */}
          {caxViewVisible && <CAXViewModal
            onCancel={() => {
              handleCaxViewVisible(false);
              setCaxFile(undefined);
              setCaxViewTitle(undefined);
            }}
            modalVisible={caxViewVisible}
            modalTitle={caxViewTitle}
            caxFile={caxFile}
          />}
    </>
  );
};

export default Welcome;
