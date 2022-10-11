import React,{useState} from 'react';
import {Button, message, Modal} from 'antd';
import { request } from 'umi';
import CAXViewBasic, {
  ModelType
} from "../CAXViewFull/CAXViewSimple/CAXViewBasic";
import { getUint8ArrayFromBlob } from "../CAXViewFull/basics/Blob";

export type CAXViewModalProps = {
  onCancel: () => void;
  modalVisible: boolean;
  // 弹出窗口的名称
  modalTitle: string|undefined;
  caxFile: {fileViewId:string,modelType:ModelType};
}

const CAXViewModal: React.FC<CAXViewModalProps> = (props) => {
  const [caxModelData,setCaxModelData] = useState<any>();

  React.useEffect(()=>{
    console.log(props.caxFile);
    loadCaxViewData(props.caxFile.fileViewId);
  },[props.caxFile.fileViewId]);

  const loadCaxViewData = async (fileViewId:string)=>{
    // try {
    //   const res = await request('/fileServer/file/download/' + fileViewId, {
    //     method: 'GET',
    //     responseType: 'blob',
    //   });
    //   const blob = new Blob([res]);
    //   const modelData = await getUint8ArrayFromBlob(blob);
    //   setCaxModelData(modelData);
    // } catch (e) {
    //   message.error('加载模型的数据异常【'+e+'】');
    // }
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
    <Modal
      title={props.modalTitle}
      visible={props.modalVisible}
      onCancel={props.onCancel}
      footer={[<Button onClick={props.onCancel}>关闭</Button>]}
      width={1400}
      >
      {caxModelData && <CAXViewBasic
            model={caxModelData}
            type={props.caxFile.modelType}
          />}
    </Modal>
  )
};
export default CAXViewModal;