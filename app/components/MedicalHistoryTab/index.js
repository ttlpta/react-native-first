import React from 'react';
import { FlatList } from 'react-native';
import MedicalHistory from 'app/components/MedicalHistory';
import withConnect from './withConnect';

class MedicalHistoryTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    const { getMedicalHistory, dataAuth, medicalHistory } = this.props;
    getMedicalHistory(dataAuth.user_code);
  }
  _keyExtractor = (item, index) => 'item_' + index;

  render() {
    const { medicalHistory } = this.props;
    return (
      <FlatList
        keyExtractor={this._keyExtractor}
        data={medicalHistory}
        renderItem={({ item }) => <MedicalHistory navigation={this.props.navigation} item={item} />}
      />
    );
  }
}

export default withConnect(MedicalHistoryTab);
