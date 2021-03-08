import React from 'react';
import { Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { selectProject } from '../../../../store/user';
import { changeLayers } from '../../../../plugins/map/layer';
import { setZoom } from '../../../../plugins/map/event';
import { mutatePhase } from '../../../../store/phase';

const { Option } = Select;

/* change project -> change layers */
const SelectProject = () => {
  const user = useSelector(
    ({ user }) => ({ project: user.project }),
    shallowEqual
  );
  const socket = useSelector((state) => state.socket, shallowEqual);

  const projects = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')).projects
    : null;

  const dispatch = useDispatch();

  const onChangeProject = (value) => {
    dispatch(selectProject(value)).then((res) => {
      // console.log('changed:', res.payload);
      const changed = res.payload[0];

      changeLayers(changed.geoserver, changed.workspace, changed.layers);
      setZoom(false);
      socket.socket?.send(JSON.stringify('#recorded,off,all'));
      dispatch(mutatePhase(null));
    });
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  if (!projects) {
    return <div>There is no Projects</div>;
  }
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      defaultValue={user.project?.id}
      placeholder="Select a project"
      optionFilterProp="children"
      onChange={onChangeProject}
      onSearch={onSearch}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }>
      {projects?.map((prj) => (
        <Option key={prj.id} value={prj.id}>
          {prj.name.toUpperCase()}
        </Option>
      ))}
    </Select>
  );
};

export default SelectProject;
