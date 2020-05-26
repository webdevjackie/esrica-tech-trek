import React from 'react';
import { shallow } from "enzyme";
import { WebMapView } from './WebMapView';

test('rendering WebMapView without crashing', () => {
    shallow(<WebMapView />);
});