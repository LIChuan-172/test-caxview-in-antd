import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getPageList } from '@/services/ant-design-pro/api';
import { Select,Form,Input,Button } from 'antd';
import { request } from 'umi';
import UpdateEnumModal from './components/UpdateEnumModal';

const {Option} = Select;

const TableForm: React.FC = () => {
  const [tableColumnList,setTableColumnList] = useState<any[]>();
  const [modalVisible,handleModalVisible] = useState<boolean>();
  const [modalTitle,setModalTitle] = useState<string>();

  React.useEffect(()=>{
    getColumns();
  },[]);
  const getColumns = async ()=>{
    const res = await request('/table/field/list',{});
    if(res && res.length>0){
      const proColumns:any[] = [];
      res.map((field:any)=>{
        if(field.fieldType == 'str'){
          proColumns.push({
            title: field.chName,
            dataIndex: field.enName,
          });
        }else if(field.fieldType == 'number'){
          proColumns.push({
            title: field.chName,
            dataIndex: field.enName,
            hideInSearch: field.hideInForm,
            hideInTable: field.hideInTable,
            renderFormItem: (item:any, { type, defaultRender, ...rest }:any, form:any) => {
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
            }
          });
        }else if(field.fieldType == 'range'){
          proColumns.push({
            title: field.chName,
            dataIndex: field.enName,
            renderFormItem: (item:any, { type, defaultRender, ...rest }:any, form:any) => {
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
            }
          });
        }else if(field.fieldType == 'lwd'){
          proColumns.push({
            title: field.chName,
            dataIndex: field.enName,
            renderFormItem: (item:any, { type, defaultRender, ...rest }:any, form:any) => {
              return <>
           <Input.Group compact>
             <Form.Item name={[item.dataIndex,'property']} initialValue={'length'}>
               <Select key="1" style={{ width: 80 }} >
                 <Option value="length">长</Option>
                 <Option value="width">宽</Option>
                 <Option value="high">高</Option>
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
            }
          });
        }else if(field.fieldType == 'date'){
          proColumns.push({
            key: 'show_'+field.id,
            title: field.chName,
            dataIndex: field.enName,
            valueType: 'date',
            hideInSearch: true
          });
          proColumns.push({
            title: field.chName,
            dataIndex: field.enName,
            valueType: 'dateRange',
            hideInTable: true
          });
        }else if(field.fieldType == 'dateTime'){
          proColumns.push({
            key: 'show_'+field.id,
            title: field.chName,
            dataIndex: field.enName,
            valueType: 'dateTime',
            hideInSearch: true
          });
          proColumns.push({
            title: field.chName,
            dataIndex: field.enName,
            valueType: 'dateRange',
            hideInTable: true
          });
        }
      });
      setTableColumnList(proColumns);
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
  // const tableColumnList: any[] = [];
  // columnDatas.map((column) => {
  //   if (column.fieldType == 'date') {
  //     tableColumnList.push({
  //       title: column.chName,
  //       dataIndex: column.enName,
  //       valueType: 'date',
  //     });
  //   }else if(column.fieldType == 'range'){
  //     tableColumnList.push({
  //       title: column.chName,
  //       dataIndex: column.enName,
  //       renderFormItem: (item:any, { type, defaultRender, ...rest }:any, form:any) => {
  //         console.log(item);
  //         console.log(type);
  //         // if (type === 'form') {
  //         //   return null;
  //         // }
  //         return <>
  //         <Input.Group compact>
  //         <Form.Item name={[item.dataIndex,'operator']} initialValue={'ge'}>
  //             <Select style={{ width: 80 }} >
  //               <Option value="ge">大于</Option>
  //               <Option value="le">小于</Option>
  //               <Option value="eq">
  //                 等于
  //               </Option>
  //             </Select>
  //           </Form.Item>
  //           <Form.Item name={[item.dataIndex,'value']} >
  //           <Input style={{ width: 100 }}/>
  //           </Form.Item>
  //         </Input.Group>
  //         </>;
  //       },
  //     })
  //   }else if(column.fieldType == 'size'){
  //     tableColumnList.push({
  //       title: column.chName,
  //       dataIndex: column.enName,
  //       renderFormItem: (item:any, { type, defaultRender, ...rest }:any, form:any) => {
  //         return <>
  //         <Input.Group compact>
  //           <Form.Item name={[item.dataIndex,'property']} initialValue={'length'}>
  //             <Select key="1" style={{ width: 80 }} >
  //               <Option value="length">长</Option>
  //               <Option value="width">宽</Option>
  //               <Option value="high">
  //                 高
  //               </Option>
  //             </Select>
  //           </Form.Item>
  //           <Form.Item name={[item.dataIndex,'operator']} initialValue={'ge'}>
  //             <Select key="2" style={{ width: 80 }} >
  //               <Option value="ge">大于</Option>
  //               <Option value="le">小于</Option>
  //               <Option value="eq">
  //                 等于
  //               </Option>
  //             </Select>
  //           </Form.Item>
  //           <Form.Item name={[item.dataIndex,'value']} >
  //           <Input style={{ width: 100 }}/>
  //           </Form.Item>
  //         </Input.Group>
  //         </>;
  //       },
  //     })
  //   } else {
  //     tableColumnList.push({
  //       title: column.chName,
  //       dataIndex: column.enName,
  //     });
  //   }
  // });
  return (
    <>
    <ProTable<any>
      headerTitle="试验数据"
      // actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 120,
      }}
      // toolBarRender={() => []}
      request={(params, sort, filter) =>request('/table/data/list',{
        method: 'POST',
        data: params
      })}
      columns={tableColumnList}
      rowSelection={{
        onChange: (_, selectedRows) => {
          // setSelectedRows(selectedRows);
          console.log(selectedRows);
        },
      }}
      toolBarRender={() => [
        <Button type="primary" key="primary" onClick={()=>{
          handleModalVisible(true);
          setModalTitle("设置键值");
        }}>
          枚举
        </Button>,
        <Button type="primary" key="primary" onClick={async ()=>{
          const res = await request('/table/data/addMainTable',{method: 'POST',
          data: {}});
          console.log(res);
        }}>
          创建主表
        </Button>,
        <Button type="primary" key="primary" onClick={async ()=>{
          const res = await request('/table/data/addExtTable',{method: 'POST',
          data: {}});
          console.log(res);
        }}>
          创建扩展表
        </Button>,
        <Button type="primary" key="primary" onClick={async ()=>{
          const res = await request('/table/data/addColumns',{method: 'POST',
          data: {}});
          console.log(res);
        }}>
          创建扩展字段
        </Button>,
        <Button type="primary" key="primary" onClick={async ()=>{
          const res = await request('/table/data/addData',{method: 'POST',
          data: {}});
          console.log(res);
        }}>
          添加数据
        </Button>,
        <Button type="primary" key="primary" onClick={async ()=>{
          const res = await request('/table/data/batchAdd',{method: 'POST',
          data: {}});
          console.log(res);
        }}>
          批量添加
        </Button>
      ]}
    />
    {modalVisible && 
      <UpdateEnumModal 
        modalVisible={modalVisible} 
        modalTitle={modalTitle} 
        onSubmit={(values:any[])=>{
          console.log(values);
          setModalTitle(undefined);
          handleModalVisible(false);
        }} 
        onCancle={()=>{
          setModalTitle(undefined);
          handleModalVisible(false);
        }}
      />}
    </>
  );
};
export default TableForm;
