import React, { useState } from 'react';
import G6 from '@antv/g6';
const Util = G6.Util;

export type MultidimensionalGraphProps = {};
const CustomNode: React.FC<MultidimensionalGraphProps> = (props) => {
  // const data = {
  //   nodes: [
  //     {
  //       id: 'node1',
  //       x: 10,
  //       y: 100,
  //       label: 'Homepage',
  //       type: 'dom-node',
  //       size: [120, 40],
  //     },
  //     {
  //       id: 'node2',
  //       x: 200,
  //       y: 100,
  //       label: 'Subpage',
  //     },
  //   ],
  //   edges: [
  //     {
  //       source: 'node1',
  //       target: 'node2',
  //     },
  //   ],
  // };
  const data = {
    nodes: [
      {
        id: '0',
        label: 'BM001',
        type: 'circle',
        size: 60,
        icon: {
          show: true,
          img: 'https://gw.alipayobjects.com/zos/antfincdn/%24BtlIJEaI9/shandian.svg',
          width: 50,
          height: 50,
        },
        labelCfg: {
          style: { fontSize: 14, fontWeight: 'bold', fill: 'rgb(255, 91, 32)' },
          position: 'bottom',
        },
        style: {
          fill: 'l(0) 0:rgb(255,247,244) 1:rgb(254,165,114)',
          stroke: 'rgb(248,233,227)',
        },
        // anchorPoints: [[1, 0.5]],
      },
      {
        id: '1',
        label: '结构模型',
        logoIcon: {
          // 是否显示 icon，值为 false 则不渲染 icon
          show: true,
          x: 0,
          y: 0,
          // icon 的地址，字符串类型
          img: 'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*abGUQKUocSMAAAAAAAAAAABkARQnAQ',
          width: 24,
          height: 24,
          // 用于调整图标的左右位置
          offset: -10,
        },
        disabled: true,
        anchorPoints: [
          [0, 0],
          [0, 0.5],
          [0, 1],
          [0.5, 1],
          [1, 1],
          [1, 0.5],
          [1, 0],
          [0.5, 0],
        ],
      },
      {
        id: '2',
        label: 'HFSS模型',
        type: 'modelRect',
        // size: [150, 40],
        logoIcon: {
          // 是否显示 icon，值为 false 则不渲染 icon
          show: true,
          x: 0,
          y: 0,
          // icon 的地址，字符串类型
          img: 'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*abGUQKUocSMAAAAAAAAAAABkARQnAQ',
          width: 24,
          height: 24,
          // 用于调整图标的左右位置
          offset: -10,
        },
        anchorPoints: [
          [0, 0],
          [0, 0.5],
          [0, 1],
          [0.5, 1],
          [1, 1],
          [1, 0.5],
          [1, 0],
          [0.5, 0],
        ],
      },
      {
        id: '3',
        label: '力仿真模型',
        logoIcon: {
          show: true,
          img: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
          width: 24,
          height: 24,
          // 用于调整图标的左右位置
          offset: -10,
        },
        anchorPoints: [
          [0, 0],
          [0, 0.5],
          [0, 1],
          [0.5, 1],
          [1, 1],
          [1, 0.5],
          [1, 0],
          [0.5, 0],
        ],
      },
      {
        id: '4',
        label: '热仿真模型',
        logoIcon: {
          show: true,
          img: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
          width: 24,
          height: 24,
          // 用于调整图标的左右位置
          offset: -10,
        },
        anchorPoints: [
          [0, 0],
          [0, 0.5],
          [0, 1],
          [0.5, 1],
          [1, 1],
          [1, 0.5],
          [1, 0],
          [0.5, 0],
        ],
      },
    ],
    edges: [
      {
        source: '0',
        target: '1',
      },
      {
        source: '0',
        target: '2',
      },
      {
        source: '0',
        target: '3',
      },
      {
        source: '0',
        target: '4',
      },
    ],
  };

  React.useEffect(() => {
    //注册节点
    const graph = new G6.Graph({
      container: 'mountNode',
      width: 800,
      height: 500,
      fitCenter: true,
      layout: {
        type: 'gForce', // 流程图显示形式 'dagre'....
        preventOverlap: true,
        nodeSize: 30,
        linkDistance: 120,
      },
      modes: {
        // 设置默认节点和默认边的地方，‘zoom-canvas’ 参数的作用是鼠标滚动可以对图形方法缩小
        default: ['drag-node', 'zoom-canvas'],
      },
      defaultNode: {
        type: 'modelRect',
        size: [150, 40],
        // size: 50, //节点大小
        stateIcon: {
          // 是否显示 icon，值为 false 则不渲染 icon
          show: false,
        },
        labelCfg: {
          style: { fontSize: 14, fontWeight: 'bold', fill: 'rgb(255, 91, 32)' },
        },
        style: {
          fill: 'l(0) 0:#ffffff 1:rgb(255,247,244)',
          stroke: 'rgb(248,233,227)',
          cursor: 'pointer',
        },
        preRect: {
          // 设置为 false，则不显示
          show: false,
        },
        stateStyles: {
          hover: {
            // keyShape 的状态样式
            opacity: 0.5,
            fillOpacity: 0.5,
          },
          // 二值状态 running 为 true 时的样式
          selected: {
            // keyShape 的状态样式
            fill: 'l(0) 0:rgb(255,138,37) 0.5:rgb(255,123,35) 1:rgb(255,91,32)',
            stroke: 'l(0) 0:rgb(255,138,37) 0.5:rgb(255,123,35) 1:rgb(255,91,32)',
          },
          disabled: {
            fill: 'l(0) 0:#ffffff 1:rgb(240,240,240)',
            stroke: 'rgb(240,240,240)',
          },
        },
      },
      defaultEdge: {
        size: 2, // 连线的粗细
        color: '#FF7C4D', // 连线的颜色(#FFB08F\#A6A6A6)
        style: {
          endArrow: {
            // 连线末端的箭头，不需要可以不设置
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#FF7C4D',
          },
        },
      },
    });
    graph.data(data);
    graph.render();
    /**
     * 节点点击
     */
    graph.on('node:click', (ev) => {
      const node = ev.item; // 被点击的节点元素
      const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
      console.log('click', node);
      console.log('click', shape);
      graph.setItemState(node, 'selected', true);
      graph.updateItem(node, {
        labelCfg: {
          style: { fill: '#ffffff' },
        },
      });
    });
    graph.on('node:mouseover', (ev) => {
      const node = ev.item; // 被点击的节点元素
      const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
      graph.setItemState(node, 'hover', true);
    });
    graph.on('node:mouseleave', (ev) => {
      const node = ev.item; // 被点击的节点元素
      const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
      console.log('mouseleave', node);
      console.log('mouseleave', shape);
      // 鼠标 hover
      const hasActived = node.hasState('selected');
      console.log(hasActived);
      if (!hasActived) {
        graph.setItemState(node, 'hover', false);
      }
    });
  }, []);
  return <div id="mountNode" style={{ backgroundColor: '#eee' }}></div>;
};
export default CustomNode;
