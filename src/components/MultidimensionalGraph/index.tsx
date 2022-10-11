import React, { useState } from 'react';
import G6, { INode } from '@antv/g6';
const Util = G6.Util;

export type MultidimensionalGraphProps = {
  nodeData: any;
  onChange: (nodeId: string) => void;
};
const MultidimensionalGraph: React.FC<MultidimensionalGraphProps> = (props) => {
  const [nodeDatas, setNodeDatas] = useState();
  const data = {
    nodes: [
      {
        id: '0',
        label: 'BM001',
        type: 'circle',
        size: 60,
        // img: 'https://gw.alipayobjects.com/zos/antfincdn/%24BtlIJEaI9/shandian.svg',
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
        type: 'modelRect',
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
        size: [150, 40],
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
        type: 'modelRect',
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
        type: 'modelRect',
        logoIcon: {
          show: true,
          img: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
          width: 24,
          height: 24,
          // 用于调整图标的左右位置
          offset: -10,
        },
        state: 'disabled',
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
    const container: any = document.getElementById('container');
    const width = container.scrollWidth;
    console.log( container.scrollHeight);
    const height = container.scrollHeight || 200;
    console.log(width,height);
    const graphData = props.nodeData;
    const nodeLen = graphData.nodes.length;
    const pointCfg = new Object();
    pointCfg[1] = {point0:{x:width/2,y:height/2}};
    //圆心半径30，间距50，节点半径75，间距50
    pointCfg[2] = {point0:{x:width/2-80,y:height/2},point1:{x:width/2+125,y:height/2}};
    //圆心半径30，节点半径75，间距50
    pointCfg[3] = {point0:{x:width/2,y:height/2},point1:{x:width/2-155,y:height/2},point2:{x:width/2+155,y:height/2}};
    //圆心半径30，节点半径75，间距50
    pointCfg[4] = {point0:{x:width/2,y:height/2},point1:{x:width/2,y:height/2-100},point2:{x:width/2-150,y:height/2+50},point3:{x:width/2+150,y:height/2+50}};
    //圆心半径30，节点半径75，间距50
    pointCfg[5] = {point0:{x:width/2,y:height/2},point1:{x:width/2-150,y:height/2-50},point2:{x:width/2+150,y:height/2-50},point3:{x:width/2-150,y:height/2+50},point4:{x:width/2+150,y:height/2+50}};
    const curPoint = pointCfg[nodeLen];
    console.log(pointCfg);
    const disabledNodes: string[] = [];
    let selectedNode: any;
    graphData.nodes.map((node: any,index:number) => {
      if (node.nodeType == 'root') {
        node.type = 'circle';
        node.size = 60;
        node.icon = {
          show: true,
          img: node.icon,
          width: 50,
          height: 50,
        };
        node.x = curPoint['point'+index].x;
        node.y = curPoint['point'+index].y;
        node.labelCfg = {
          style: { fontSize: 14, fontWeight: 'bold', fill: 'rgb(255, 91, 32)' },
          position: 'bottom',
        };
        node.style = {
          fill: 'l(0) 0:rgb(255,247,244) 1:rgb(254,165,114)',
          stroke: 'rgb(248,233,227)',
        };
      } else {
        node.type = 'modelRect';
        node.logoIcon = {
          show: true,
          img: node.icon,
          width: 24,
          height: 24,
          offset: -10,
        };
        node.x = curPoint['point'+index].x;
        node.y = curPoint['point'+index].y;
        console.log(node.x,node.y);
        node.anchorPoints = [
          [0, 0],
          [0, 0.5],
          [0, 1],
          [0.5, 1],
          [1, 1],
          [1, 0.5],
          [1, 0],
          [0.5, 0],
        ];
        if (node.status && node.status == 'selected') {
          selectedNode = node.id;
          node.style = {
            fill: 'l(0) 0:rgb(255,138,37) 0.5:rgb(255,123,35) 1:rgb(255,91,32)',
            stroke: 'l(0) 0:rgb(255,138,37) 0.5:rgb(255,123,35) 1:rgb(255,91,32)',
          };
          node.labelCfg = {
            style: { fill: '#ffffff' },
          };
        } else if (node.status && node.status == 'disabled') {
          disabledNodes.push(node.id);
          node.style = {
            fill: 'l(0) 0:rgb(240,240,240) 1:rgb(94,94,94)',
            stroke: 'rgb(240,240,240)',
          };
          node.labelCfg = {
            style: { fill: '#000000' },
          };
        }
      }
    });
    //设置边的颜色
    graphData.edges.map((edge: any) => {
      if (disabledNodes.includes(edge.source) || disabledNodes.includes(edge.target)) {
        edge.color = 'rgb(170,170,170)';
        edge.style = {
          endArrow: {
            fill: 'rgb(170,170,170)',
          },
        };
      } else {
        if (selectedNode == edge.source || selectedNode == edge.target) {
          edge.color = '#FF7C4D';
          edge.style = {
            endArrow: {
              fill: '#FF7C4D',
            },
          };
        }
      }
    });
    const graph = new G6.Graph({
      container: 'container',
      width,
      height,
      fitCenter: true,
      // fitView: true,
      layout: {
        // type: 'gForce', // 流程图显示形式 'dagre'....
        // preventOverlap: true,
        // nodeSize: 30,
        // linkDistance: 120,
        // type: 'dendrogram',
        // direction: 'LR',
        // nodeSep: 20,
        // rankSep: 100,
        // radial: true,
      },
      modes: {
        // 设置默认节点和默认边的地方，'drag-node'拖拽节点，‘zoom-canvas’ 参数的作用是鼠标滚动可以对图形方法缩小
        default: [],
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
            fill: 'l(0) 0:rgb(240,240,240) 1:rgb(94,94,94)',
            stroke: 'rgb(240,240,240)',
          },
        },
      },
      defaultEdge: {
        size: 2, // 连线的粗细
        color: '#FFB08F', // 连线的颜色(#FFB08F\#A6A6A6)
        style: {
          endArrow: {
            // 连线末端的箭头，不需要可以不设置
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#FFB08F',
          },
        },
        stateStyles: {
          focused: {
            stroke: '#FF7C4D',
            endArrow: {
              // 连线末端的箭头，不需要可以不设置
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              fill: '#FF7C4D',
            },
          },
          normal: {
            stroke: '#FFB08F',
            endArrow: {
              // 连线末端的箭头，不需要可以不设置
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              fill: '#FFB08F',
            },
          },
        },
      },
    });
    graph.data(graphData);
    graph.render();

    /**
     * 节点点击
     */
    graph.on('node:click', (ev) => {
      const node: any = ev.item; // 被点击的节点元素
      const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
      if (node?._cfg?.model?.nodeType != 'root' && node?._cfg?.model?.status != 'disabled') {
        graph.getNodes().map((graphNode) => {
          if (node?._cfg?.id == graphNode._cfg?.id) {
            graph.updateItem(node, {
              style: {
                fill: 'l(0) 0:rgb(255,138,37) 0.5:rgb(255,123,35) 1:rgb(255,91,32)',
                stroke: 'l(0) 0:rgb(255,138,37) 0.5:rgb(255,123,35) 1:rgb(255,91,32)',
              },
              labelCfg: {
                style: { fill: '#ffffff' },
              },
            });
            //更改边的颜色
            const edges = node.getEdges();
            if (node?._cfg?.status == 'selected') {
              edges.forEach((edge: any) => {
                graph.clearItemStates(edge, ['focused', 'normal']);
              });
            } else {
              edges.forEach((edge: any) => {
                graph.setItemState(edge, 'focused', true);
              });
            }
          } else {
            if (
              graphNode?._cfg?.model?.nodeType != 'root' &&
              graphNode?._cfg?.model?.status != 'disabled'
            ) {
              graph.updateItem(graphNode, {
                style: {
                  fill: 'l(0) 0:#ffffff 1:rgb(255,247,244)',
                  stroke: 'rgb(248,233,227)',
                },
                labelCfg: {
                  style: { fill: 'rgb(255, 91, 32)' },
                },
              });
              const edges = graphNode.getEdges();
              edges.forEach((edge: any) => {
                graph.clearItemStates(edge, ['focused', 'normal']);
                graph.setItemState(edge, 'normal', true);
              });
            }
          }
        });
      }
      props.onChange(node._cfg?.model?.id);
    });
    console.log(window);
    if (typeof window !== 'undefined'){
      window.onresize = () => {
        const offsetWidth = document.body.offsetWidth-208-31;
        console.log(offsetWidth);
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(offsetWidth, container.scrollHeight);
        graph.fitCenter();
      };
    }
      
    // G6.registerNode(
    //   'custom',
    //   {
    //     options: {
    //       size: 60,
    //       icon: {
    //         show: true,
    //         img: 'https://gw.alipayobjects.com/zos/antfincdn/%24BtlIJEaI9/shandian.svg',
    //         width: 50,
    //         height: 50,
    //       },
    //       labelCfg: {
    //         style: { fontSize: 14, fontWeight: 'bold', fill: 'rgb(255, 91, 32)' },
    //         position: 'bottom',
    //       },
    //       style: {
    //         fill: 'l(0) 0:rgb(255,247,244) 1:rgb(254,165,114)',
    //         stroke: 'rgb(248,233,227)',
    //       },
    //     },
    //   },
    //   'circle',
    // );
    // G6.registerNode(
    //   'dimension',
    //   {
    //     options: {
    //       size: [150, 40],
    //       stateIcon: {
    //         // 是否显示 icon，值为 false 则不渲染 icon
    //         show: false,
    //       },
    //       labelCfg: {
    //         style: { fontSize: 14, fontWeight: 'bold', fill: 'rgb(255, 91, 32)' },
    //       },
    //       style: {
    //         fill: 'l(0) 0:#ffffff 1:rgb(255,247,244)',
    //         stroke: 'rgb(248,233,227)',
    //         cursor: 'pointer',
    //       },
    //       preRect: {
    //         // 设置为 false，则不显示
    //         show: false,
    //       },
    //       stateStyles: {
    //         hover: {
    //           // keyShape 的状态样式
    //           opacity: 0.5,
    //           fillOpacity: 0.5,
    //         },
    //         // 二值状态 running 为 true 时的样式
    //         selected: {
    //           // keyShape 的状态样式
    //           fill: 'l(0) 0:rgb(255,138,37) 0.5:rgb(255,123,35) 1:rgb(255,91,32)',
    //           stroke: 'l(0) 0:rgb(255,138,37) 0.5:rgb(255,123,35) 1:rgb(255,91,32)',
    //         },
    //         disabled: {
    //           fill: 'l(0) 0:rgb(240,240,240) 1:rgb(94,94,94)',
    //           stroke: 'rgb(240,240,240)',
    //         },
    //       },
    //     },
    //     getAnchorPoints: (cfg) => {
    //       return [
    //         [0, 0],
    //         [0, 0.5],
    //         [0, 1],
    //         [0.5, 1],
    //         [1, 1],
    //         [1, 0.5],
    //         [1, 0],
    //         [0.5, 0],
    //       ];
    //     },
    //     afterDraw: (cfg, group) => {
    //       console.log(group);
    //     },
    //   },
    //   'modelRect',
    // );
    //注册节点

    // graph.updateItem(node, {
    //   labelCfg: {
    //     style: { fill: '#000000' },
    //   },
    // });

    // graph.on('node:mouseover', (ev) => {
    //   const node = ev.item; // 被点击的节点元素
    //   const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
    //   graph.setItemState(node, 'hover', true);
    // });
    // graph.on('node:mouseleave', (ev) => {
    //   const node = ev.item; // 被点击的节点元素
    //   const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
    //   console.log('mouseleave', node);
    //   console.log('mouseleave', shape);
    //   // 鼠标 hover
    //   const hasActived = node.hasState('selected');
    //   console.log(hasActived);
    //   if (!hasActived) {
    //     graph.setItemState(node, 'hover', false);
    //   }
    // });
  }, []);
  return <div id="container" style={{ backgroundColor: 'skyblue' }}></div>;
};
export default MultidimensionalGraph;
