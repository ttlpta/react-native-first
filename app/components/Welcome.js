/**
 * @providesModule TeleMedicine.Components.Welcome
 */

import React from 'react';
import { Container, Content } from 'native-base';

import Map from './MapView';

export default function TeleMedicine() {
  return (
    <Container>
      <Content >
        <Map />
      </Content>
    </Container>
  );
}

