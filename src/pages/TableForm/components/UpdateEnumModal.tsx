import React, { useState, useRef } from 'react';
import type {
  ActionType,
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  EditableProTable
} from '@ant-design/pro-components';
import {Button,Modal} from 'antd';

export type UpdateEnumModalProps = {
  modalVisible:boolean;
  modalTitle: string|undefined;
  onSubmit: (values:any[])=>void;
  onCancle: ()=>void;
}

type DataSourceType = {
  id: number;
  title?: string;
  code?: string;
};

const defaultData: DataSourceType[] = new Array(5).fill(1).map((_, index) => {
  return {
    id: Date.now() + index,
    label: `活动名称${index}`,
    value: 'value_'+index,
  };
});
console.log(defaultData);
const UpdateEnumModal: React.FC<UpdateEnumModalProps> = (props) => {

  

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '名称',
      dataIndex: 'label',
    },
    {
      title: '编码',
      dataIndex: 'value',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
    ];
    console.log(dataSource);
    React.useEffect(()=>{
      setDataSource(defaultData);
    },[]);
  return (
    <>
    <Modal
      visible={props.modalVisible}
      title={props.modalTitle}
      onOk={()=>props.onSubmit(dataSource)}
      onCancel={()=>props.onCancle()}
      width={500}
    >
    <EditableProTable<DataSourceType>
      rowKey="id"
      scroll={{
        x: true,
      }}
      actionRef={actionRef}
      columns={columns}
      value={dataSource}
      recordCreatorProps={{
        newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
          }),
      }}
      editable={{
        type: 'single',
        editableKeys,
        onValuesChange: (record, recordList) => {
          setDataSource(recordList);
        },
        onChange: setEditableRowKeys,
      }}    
      />
      </Modal>
      </>
  );
};
export default UpdateEnumModal;