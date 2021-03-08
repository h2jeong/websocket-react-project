import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

/* Other Option Config - Server development required */
const Report = () => {
  const callback = (key) => {
    console.log(key);
  };

  return (
    <Tabs defaultActiveKey="1" onChange={callback} size="small">
      <TabPane tab="Tab 1" key="1">
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
        <p>Content of Tab Pane 1</p>
      </TabPane>
      <TabPane tab="Tab 2" key="2">
        <ul>
          <li>Content of Tab Pane 2</li>
          <li>Content of Tab Pane 2</li>
          <li>Content of Tab Pane 2</li>
        </ul>
      </TabPane>
      <TabPane tab="Tab 3" key="3">
        <p>
          Note: this is a one-way operation. Once you eject, you can’t go back!
          If you aren’t satisfied with the build tool and configuration choices,
          you can eject at any time. This command will remove the single build
          dependency from your project. Instead, it will copy all the
          configuration files and the transitive dependencies (webpack, Babel,
          ESLint, etc) right into your project so you have full control over
          them. All of the commands except eject will still work, but they will
          point to the copied scripts so you can tweak them. At this point
          you’re on your own. You don’t have to ever use eject. The curated
          feature set is suitable for small and middle deployments, and you
          shouldn’t feel obligated to use this feature. However we understand
          that this tool wouldn’t be useful if you couldn’t customize it when
          you are ready for it.
        </p>
      </TabPane>
    </Tabs>
  );
};

export default Report;
