import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getPageList } from '@/services/ant-design-pro/api';
import { Select,Form,Input,Space } from 'antd';
import CAXViewBasic, {
  ModelType
} from "@/components/CAXViewFull/CAXViewSimple/CAXViewBasic";
import { getUint8ArrayFromBlob } from "@/components/CAXViewFull/basics/Blob";
import { request } from 'umi';

const {Option} = Select;

const QuerySearch: React.FC = () => {
  const [caxModelData,setCaxModelData] = useState<any>();
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
  const genColumnDatas = () => {
    const tableColumns: any[] = [];
    const fieldArr = ['text', 'num', 'date','range'];
    for (let i = 0; i < 10; i++) {
      const id = 10000 + i;
      tableColumns.push({
        id: id,
        key: id,
        enName: 'col_' + i,
        chName: '数据列' + i,
        fieldType: i>5 && i%4 == 3?'size':fieldArr[i % 4],
      });
    }
    // tableColumns.reverse();
    return tableColumns;
  };
  const columnDatas = genColumnDatas();
  const tableColumnList: any[] = [];
  columnDatas.map((column) => {
    if (column.fieldType == 'date') {
      tableColumnList.push({
        title: column.chName,
        dataIndex: column.enName,
        valueType: 'date',
      });
    }else if(column.fieldType == 'range'){
      tableColumnList.push({
        title: column.chName,
        dataIndex: column.enName,
        renderFormItem: (item:any, { type, defaultRender, ...rest }:any, form:any) => {
          console.log(item);
          console.log(type);
          // if (type === 'form') {
          //   return null;
          // }
          return <>
          <Input.Group compact>
          <Form.Item name={[item.dataIndex,'operator']} initialValue={'ge'}>
              <Select style={{ width: 80 }} >
                <Option value="ge">大于</Option>
                <Option value="le">小于</Option>
                <Option value="eq">
                  等于
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name={[item.dataIndex,'value']} >
            <Input style={{ width: 100 }}/>
            </Form.Item>
          </Input.Group>
          </>;
        },
      })
    }else if(column.fieldType == 'size'){
      tableColumnList.push({
        title: column.chName,
        dataIndex: column.enName,
        renderFormItem: (item:any, { type, defaultRender, ...rest }:any, form:any) => {
          return <>
          <Input.Group compact>
            <Form.Item name={[item.dataIndex,'property']} initialValue={'length'}>
              <Select key="1" style={{ width: 80 }} >
                <Option value="length">长</Option>
                <Option value="width">宽</Option>
                <Option value="high">
                  高
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name={[item.dataIndex,'operator']} initialValue={'ge'}>
              <Select key="2" style={{ width: 80 }} >
                <Option value="ge">大于</Option>
                <Option value="le">小于</Option>
                <Option value="eq">等于</Option>
              </Select>
            </Form.Item>
            <Form.Item name={[item.dataIndex,'value']} >
            <Input style={{ width: 100 }}/>
            </Form.Item>
          </Input.Group>
          </>;
        },
      })
    } else {
      tableColumnList.push({
        title: column.chName,
        dataIndex: column.enName,
      });
    }
  });
  return (
    <>
    {/* <ProTable<any>
      headerTitle="试验数据"
      // actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 120,
      }}
      toolBarRender={() => []}
      request={getPageList}
      columns={tableColumnList}
      rowSelection={{
        onChange: (_, selectedRows) => {
          // setSelectedRows(selectedRows);
          console.log(selectedRows);
        },
      }}
    /> */}
    {caxModelData && <CAXViewBasic
            model={caxModelData}
            type={"caxdz"}
          />}
    </>
  );
};
export default QuerySearch;
